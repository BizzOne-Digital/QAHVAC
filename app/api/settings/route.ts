import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { verifyAdminAuth } from '@/lib/auth';

export async function GET() {
  const settings = storage.getSettings();
  return NextResponse.json({ success: true, data: settings });
}

export async function PATCH(req: NextRequest) {
  const isAuthed = await verifyAdminAuth(req);
  if (!isAuthed) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = storage.updateSettings(body);
    return NextResponse.json({ success: true, data: updated, message: 'Settings saved successfully.' });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to update settings.' }, { status: 500 });
  }
}
