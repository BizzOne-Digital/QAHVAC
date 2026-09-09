import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

/**
 * Password digests are stored as `scrypt$<N>$<saltHex>$<hashHex>`.
 *
 * `scripts/seed-admin.mjs` writes the same format with the same parameters —
 * keep the two in step if the cost factor ever changes.
 */
const SCRYPT_COST = 16384;
const KEY_LENGTH = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, KEY_LENGTH, { N: SCRYPT_COST });
  return `scrypt$${SCRYPT_COST}$${salt.toString('hex')}$${hash.toString('hex')}`;
}

export function verifyPassword(password: string, digest: string): boolean {
  const parts = digest.split('$');
  if (parts.length !== 4 || parts[0] !== 'scrypt') return false;

  const cost = Number(parts[1]);
  if (!Number.isInteger(cost) || cost <= 0) return false;

  try {
    const salt = Buffer.from(parts[2], 'hex');
    const expected = Buffer.from(parts[3], 'hex');
    const actual = scryptSync(password, salt, expected.length, { N: cost });
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}
