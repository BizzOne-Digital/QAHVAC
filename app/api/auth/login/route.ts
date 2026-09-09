import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin, setAdminSessionCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ success: false, error: 'Password is required.' }, { status: 400 });
    }

    if (email !== undefined && typeof email !== 'string') {
      return NextResponse.json({ success: false, error: 'Email must be a string.' }, { status: 400 });
    }

    const result = authenticateAdmin(email, password);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 401 });
    }

    await setAdminSessionCookie(result.admin);

    return NextResponse.json({
      success: true,
      message: 'Authenticated successfully as QP HVAC Administrator.',
      user: result.admin,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'An unexpected server error occurred.' }, { status: 500 });
  }
}
