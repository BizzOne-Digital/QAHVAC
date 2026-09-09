import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';

export async function GET() {
  const isAuthed = await verifyAdminAuth();
  return NextResponse.json({
    success: true,
    authenticated: isAuthed,
    user: isAuthed ? { name: 'Jayson', role: 'admin', company: 'QP HVAC' } : null,
  });
}
