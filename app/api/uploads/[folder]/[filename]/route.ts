import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { isAllowedFolder } from '@/lib/uploads';

export const runtime = 'nodejs';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ folder: string; filename: string }> }
) {
  const { folder, filename } = await params;

  // Sanitize and validate
  if (!isAllowedFolder(folder)) {
    return new NextResponse('Invalid upload category', { status: 404 });
  }

  // Reject directory traversal
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return new NextResponse('Invalid file request', { status: 400 });
  }

  const upload = storage.getUploadByFolderAndFilename(folder, filename);

  if (!upload || !upload.dataBase64) {
    return new NextResponse('Asset not found', { status: 404 });
  }

  try {
    const buffer = Buffer.from(upload.dataBase64, 'base64');
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': upload.mimeType || 'image/jpeg',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error streaming stored upload:', error);
    return new NextResponse('Failed to render file', { status: 500 });
  }
}
