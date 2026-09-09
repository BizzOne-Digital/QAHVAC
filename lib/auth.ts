import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { AdminUser, PublicAdminUser } from '@/types';
import { APP_CONFIG } from './config';
import { verifyPassword } from './password';
import {
  ADMIN_SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  SessionPayload,
  signSession,
  verifySession,
} from './session';
import { storage } from './storage';

export { ADMIN_SESSION_COOKIE };

/** Bootstrap identity used until `npm run seed:admin` has been run. */
const ENV_ADMIN_ID = 'env-admin';

export function toPublicAdmin(admin: AdminUser): PublicAdminUser {
  const { passwordHash: _passwordHash, ...rest } = admin;
  return rest;
}

/** Reads the session from the cookie, falling back to a Bearer token. */
export async function getSession(req?: NextRequest): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const fromCookie = await verifySession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
  if (fromCookie) return fromCookie;

  const authHeader = req?.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return verifySession(authHeader.slice('Bearer '.length));
  }

  return null;
}

export async function verifyAdminAuth(req?: NextRequest): Promise<boolean> {
  const session = await getSession(req);
  if (!session) return false;

  // A seeded admin must still exist; the bootstrap identity is only valid while
  // no admin has been seeded.
  if (session.sub === ENV_ADMIN_ID) {
    return (await storage.getAdmins()).length === 0;
  }

  return Boolean(await storage.getAdminById(session.sub));
}

export async function getCurrentAdmin(req?: NextRequest): Promise<PublicAdminUser | null> {
  const session = await getSession(req);
  if (!session) return null;

  if (session.sub === ENV_ADMIN_ID) {
    if ((await storage.getAdmins()).length > 0) return null;
    return {
      id: ENV_ADMIN_ID,
      name: APP_CONFIG.contactPerson,
      email: session.email,
      role: 'admin',
      createdAt: new Date(0).toISOString(),
      updatedAt: new Date(0).toISOString(),
    };
  }

  const admin = await storage.getAdminById(session.sub);
  return admin ? toPublicAdmin(admin) : null;
}

export type AuthResult =
  | { success: true; admin: PublicAdminUser }
  | { success: false; error: string };

/**
 * Validates credentials against the seeded admin accounts. When no admin has
 * been seeded yet, the ADMIN_PASSWORD environment value is accepted so the
 * portal is never locked out on a fresh install.
 */
export async function authenticateAdmin(
  email: string | undefined,
  password: string
): Promise<AuthResult> {
  const admins = await storage.getAdmins();

  if (admins.length === 0) {
    if (password.trim() === APP_CONFIG.defaultAdminPassword.trim()) {
      return {
        success: true,
        admin: {
          id: ENV_ADMIN_ID,
          name: APP_CONFIG.contactPerson,
          email: (email || 'admin@qphvac.local').trim().toLowerCase(),
          role: 'admin',
          createdAt: new Date(0).toISOString(),
          updatedAt: new Date(0).toISOString(),
        },
      };
    }
    return { success: false, error: 'Invalid admin credentials.' };
  }

  const normalisedEmail = email?.trim().toLowerCase();
  let candidates: AdminUser[] = admins;
  if (normalisedEmail) {
    const match = await storage.getAdminByEmail(normalisedEmail);
    candidates = match ? [match] : [];
  }

  for (const candidate of candidates) {
    if (verifyPassword(password, candidate.passwordHash)) {
      // Stamping the sign-in time is a write that can fail for reasons which
      // have nothing to do with the credentials — a database blip, a dropped
      // connection. It is bookkeeping: never fail a valid login over it.
      try {
        await storage.updateAdmin(candidate.id, { lastLoginAt: new Date().toISOString() });
      } catch (err) {
        console.warn(`Could not record lastLoginAt for ${candidate.id}:`, err);
      }

      return { success: true, admin: toPublicAdmin(candidate) };
    }
  }

  return { success: false, error: 'Invalid admin credentials.' };
}

export async function setAdminSessionCookie(admin: PublicAdminUser): Promise<void> {
  const token = await signSession({
    sub: admin.id,
    email: admin.email,
    role: 'admin',
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  });

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}
