import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { processUpload } from '@/lib/uploads';
import { storage } from '@/lib/storage';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const isAuthed = await verifyAdminAuth(req);
  if (!isAuthed) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }

  const uploads = storage.getUploads();
  return NextResponse.json({ success: true, data: uploads });
}

export async function POST(req: NextRequest) {
  const isAuthed = await verifyAdminAuth(req);
  if (!isAuthed) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'general';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided in form data.' }, { status: 400 });
    }

    const result = await processUpload(file, folder);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      url: result.upload.url,
      filename: result.upload.filename,
      originalName: result.upload.originalName,
      folder: result.upload.folder,
      size: result.upload.size,
      mimeType: result.upload.mimeType,
    }, { status: 201 });
  } catch (error) {
    console.error('Upload processing error:', error);
    return NextResponse.json({ success: false, error: 'Upload failed due to an internal server error.' }, { status: 500 });
  }
}
