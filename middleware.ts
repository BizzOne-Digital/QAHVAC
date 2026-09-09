import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifySession } from '@/lib/session';

/**
 * Server-side guard for the dispatch portal. The signature and expiry are
 * checked here (Edge runtime, no database access); the API routes additionally
 * confirm the admin record still exists.
 */
export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const session = await verifySession(req.cookies.get(ADMIN_SESSION_COOKIE)?.value);

  if (pathname === '/admin/login') {
    if (session) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    const loginUrl = new URL('/admin/login', req.url);
    loginUrl.searchParams.set('next', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
