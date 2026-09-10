import { NextRequest, NextResponse } from 'next/server';
import { readJsonBody } from '@/lib/http';
import { storage } from '@/lib/storage';
import { verifyAdminAuth } from '@/lib/auth';
import { normalizeBusinessCard } from '@/lib/businessCard';

export async function GET() {
  const settings = await storage.getSettings();
  return NextResponse.json({ success: true, data: settings });
}

export async function PATCH(req: NextRequest) {
  const isAuthed = await verifyAdminAuth(req);
  if (!isAuthed) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const parsed = await readJsonBody(req);
    if (!parsed.ok) return parsed.response;
    const body = parsed.body;

    // The card has a dedicated endpoint, but the settings form saves the whole
    // document, so the same validation has to apply on this path too.
    if ('businessCard' in body) {
      const current = await storage.getSettings();
      body.businessCard = normalizeBusinessCard(body.businessCard, current.businessCard);
    }

    const updated = await storage.updateSettings(body);
    return NextResponse.json({ success: true, data: updated, message: 'Settings saved successfully.' });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to update settings.' }, { status: 500 });
  }
}
