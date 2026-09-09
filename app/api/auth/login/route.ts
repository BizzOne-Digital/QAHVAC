import { NextRequest, NextResponse } from 'next/server';
import { isValidAdminPassword, setAdminSessionCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body;

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ success: false, error: 'Password is required.' }, { status: 400 });
    }

    if (!isValidAdminPassword(password)) {
      return NextResponse.json({ success: false, error: 'Invalid admin credentials.' }, { status: 401 });
    }

    await setAdminSessionCookie();

    return NextResponse.json({
      success: true,
      message: 'Authenticated successfully as QP HVAC Administrator.',
      user: { role: 'admin', name: 'Jayson (QP HVAC)' }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'An unexpected server error occurred.' }, { status: 500 });
  }
}
