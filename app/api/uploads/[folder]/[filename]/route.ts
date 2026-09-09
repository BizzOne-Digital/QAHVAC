import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, MissingMongoUriError } from '@/lib/mongodb';
import { StoredUpload } from '@/models/StoredUpload';
import { isSafeStoredFilename, isUploadFolder } from '@/lib/uploads/validation';

/**
 * `.lean()` hands back the raw BSON value, which is a `Binary` wrapper rather
 * than a Node Buffer — passing that straight to `Buffer.from` yields zero
 * bytes. Unwrap it before responding.
 */
function toBuffer(value: unknown): Buffer | null {
  if (Buffer.isBuffer(value)) return value;

  if (value && typeof value === 'object') {
    const binary = value as { buffer?: unknown; value?: () => unknown };

    if (Buffer.isBuffer(binary.buffer)) return binary.buffer;
    if (binary.buffer instanceof Uint8Array) return Buffer.from(binary.buffer);

    if (typeof binary.value === 'function') {
      const inner = binary.value();
      if (Buffer.isBuffer(inner)) return inner;
      if (inner instanceof Uint8Array) return Buffer.from(inner);
    }
  }

  return null;
}

/** Streams a Buffer straight out of MongoDB; needs the Node runtime. */
export const runtime = 'nodejs';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ folder: string; filename: string }> }
) {
  const { folder, filename } = await params;

  // Both segments are validated even though nothing touches the filesystem:
  // the folder must be on the whitelist and the filename must match the
  // machine-generated shape, which rules out `..`, slashes and backslashes.
  if (!isUploadFolder(folder) || !isSafeStoredFilename(filename)) {
    return new NextResponse('Not found', { status: 404 });
  }

  try {
    await connectToDatabase();

    const upload = await StoredUpload.findOne({ folder, filename }).lean();

    if (!upload?.data) {
      return new NextResponse('Not found', { status: 404 });
    }

    const body = toBuffer(upload.data);

    if (!body || body.length === 0) {
      console.error(`Stored upload ${folder}/${filename} holds no readable binary.`);
      return new NextResponse('Unable to load image', { status: 500 });
    }

    return new NextResponse(new Uint8Array(body), {
      status: 200,
      headers: {
        'Content-Type': upload.mimeType,
        'Content-Length': String(body.length),
        // Filenames are unique and content never changes under them.
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    if (error instanceof MissingMongoUriError) {
      return new NextResponse('Image storage is not configured', { status: 503 });
    }
    // Never surface database internals to the client.
    console.error('Error serving stored upload:', error);
    return new NextResponse('Unable to load image', { status: 500 });
  }
}
