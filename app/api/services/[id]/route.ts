import { NextRequest, NextResponse } from 'next/server';
import { readJsonBody } from '@/lib/http';
import { storage } from '@/lib/storage';
import { verifyAdminAuth } from '@/lib/auth';
import { MAX_SERVICE_IMAGES, isPublicImageUrl, normalizeImageList } from '@/lib/uploads/validation';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const service = await storage.getServiceById(id) || await storage.getServiceBySlug(id);

  if (!service) {
    return NextResponse.json({ success: false, error: 'Service not found.' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: service });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuthed = await verifyAdminAuth(req);
  if (!isAuthed) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }

  const { id } = await params;
  const existing = await storage.getServiceById(id);

  if (!existing) {
    return NextResponse.json({ success: false, error: 'Service not found.' }, { status: 404 });
  }

  try {
    const parsed = await readJsonBody(req);
    if (!parsed.ok) return parsed.response;
    const body = parsed.body;

    // Image fields are re-validated on the way in. Each is only touched when
    // the body actually carries it, so a partial patch that omits `images`
    // leaves the existing gallery alone instead of clearing it.
    const imageFields: Partial<typeof existing> = {};
    if ('images' in body) {
      imageFields.images = normalizeImageList(body.images, MAX_SERVICE_IMAGES);
    }
    if ('image' in body) {
      imageFields.image = isPublicImageUrl(body.image) ? body.image.trim() : existing.image;
    }

    const updated = await storage.saveService({
      ...existing,
      ...body,
      ...imageFields,
      id: existing.id, // Immutable ID
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json({ success: false, error: 'Failed to update service.' }, { status: 500 });
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
  const deleted = await storage.deleteService(id);

  if (!deleted) {
    return NextResponse.json({ success: false, error: 'Service not found.' }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: 'Service removed successfully.' });
}
