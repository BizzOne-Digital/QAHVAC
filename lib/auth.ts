import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { APP_CONFIG } from './config';

const ADMIN_SESSION_COOKIE = 'qp_hvac_admin_token';
const ADMIN_SESSION_TOKEN = 'qp-hvac-auth-verified-session-key-v1';

export async function verifyAdminAuth(req?: NextRequest): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (token === ADMIN_SESSION_TOKEN) {
    return true;
  }

  // Also check Authorization header if passed
  if (req) {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader === `Bearer ${ADMIN_SESSION_TOKEN}`) {
      return true;
    }
  }

  return false;
}

export function isValidAdminPassword(password: string): boolean {
  const expectedPassword = APP_CONFIG.defaultAdminPassword;
  return password.trim() === expectedPassword.trim();
}

export async function setAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, ADMIN_SESSION_TOKEN, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}
