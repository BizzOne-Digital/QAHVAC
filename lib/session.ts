/**
 * Signed admin session tokens.
 *
 * Uses Web Crypto only, so the exact same verification runs in a route handler
 * (Node runtime) and in `middleware.ts` (Edge runtime).
 *
 * Token format: `<base64url(payload JSON)>.<base64url(HMAC-SHA256)>`
 */

export interface SessionPayload {
  /** Admin record id, or `env-admin` for the bootstrap account. */
  sub: string;
  email: string;
  role: 'admin';
  /** Expiry, seconds since epoch. */
  exp: number;
}

export const ADMIN_SESSION_COOKIE = 'qp_hvac_admin_token';
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function getSecret(): string {
  const secret = process.env.AUTH_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) {
    // Keeps local development working before any secret is configured; the
    // signature is still consistent within the process lifetime.
    return 'qp-hvac-development-only-secret';
  }
  return secret;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  const binary = atob(padded);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function importKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function signSession(payload: SessionPayload): Promise<string> {
  const body = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const key = await importKey();
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
  return `${body}.${toBase64Url(new Uint8Array(signature))}`;
}

export async function verifySession(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token || typeof token !== 'string') return null;

  const [body, signature] = token.split('.');
  if (!body || !signature) return null;

  try {
    const key = await importKey();
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      fromBase64Url(signature),
      new TextEncoder().encode(body)
    );
    if (!valid) return null;

    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(body))) as SessionPayload;
    if (!payload?.sub || payload.role !== 'admin') return null;
    if (typeof payload.exp !== 'number' || payload.exp * 1000 < Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}
