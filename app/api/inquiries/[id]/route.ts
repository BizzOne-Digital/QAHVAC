import { NextRequest, NextResponse } from 'next/server';
import { readJsonBody } from '@/lib/http';
import { storage } from '@/lib/storage';
import { verifyAdminAuth } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuthed = await verifyAdminAuth(req);
  if (!isAuthed) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const parsed = await readJsonBody(req);
    if (!parsed.ok) return parsed.response;
    const body = parsed.body;
    const updated = await storage.updateInquiry(id, body);

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Inquiry not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating inquiry:', error);
    return NextResponse.json({ success: false, error: 'Failed to update inquiry.' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuthed = await verifyAdminAuth(req);
  if (!isAuthed) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await storage.deleteInquiry(id);

  if (!deleted) {
    return NextResponse.json({ success: false, error: 'Inquiry not found.' }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: 'Inquiry removed successfully.' });
}
