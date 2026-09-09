import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { connectToDatabase, MissingMongoUriError } from '@/lib/mongodb';
import { StoredUpload } from '@/models/StoredUpload';
import { deleteStoredUpload } from '@/lib/uploads/deleteStoredUpload';
import {
  ALLOWED_MIME_TYPES,
  MAX_UPLOAD_BYTES,
  MAX_UPLOAD_LABEL,
  StoredUploadSummary,
  UPLOAD_FOLDERS,
  UploadFolder,
  buildUploadUrl,
  generateStoredFilename,
  isAllowedMimeType,
  isSafeStoredFilename,
  isUploadFolder,
  parseUploadUrl,
} from '@/lib/uploads/validation';

/** Mongoose and Buffer handling both require the Node runtime. */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function storageUnavailable() {
  return NextResponse.json(
    { success: false, error: 'Image storage is not configured. Set MONGODB_URI and try again.' },
    { status: 503 }
  );
}

/** GET /api/upload — media library listing. Never returns binaries. */
export async function GET(req: NextRequest) {
  if (!(await verifyAdminAuth(req))) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const folderParam = searchParams.get('folder');
    const filter = folderParam && isUploadFolder(folderParam) ? { folder: folderParam } : {};

    const docs = await StoredUpload.find(filter)
      .select('-data')
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    const data: StoredUploadSummary[] = docs.map(doc => ({
      id: String(doc._id),
      folder: doc.folder as UploadFolder,
      filename: doc.filename,
      originalName: doc.originalName,
      mimeType: doc.mimeType,
      size: doc.size,
      url: buildUploadUrl(doc.folder as UploadFolder, doc.filename),
      createdAt: new Date(doc.createdAt).toISOString(),
    }));

    return NextResponse.json({ success: true, data, meta: { folders: UPLOAD_FOLDERS } });
  } catch (error) {
    if (error instanceof MissingMongoUriError) return storageUnavailable();
    console.error('Error listing uploads:', error);
    return NextResponse.json({ success: false, error: 'Could not load the media library.' }, { status: 500 });
  }
}

/** POST /api/upload — stores one image as a binary document in MongoDB. */
export async function POST(req: NextRequest) {
  if (!(await verifyAdminAuth(req))) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const folderValue = formData.get('folder');

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ success: false, error: 'No image was provided.' }, { status: 400 });
    }

    if (!isUploadFolder(folderValue)) {
      return NextResponse.json(
        { success: false, error: `Invalid folder. Allowed folders: ${UPLOAD_FOLDERS.join(', ')}.` },
        { status: 400 }
      );
    }

    if (!isAllowedMimeType(file.type)) {
      return NextResponse.json(
        { success: false, error: `Unsupported image type. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}.` },
        { status: 415 }
      );
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { success: false, error: `Maximum image size is ${MAX_UPLOAD_LABEL}.` },
        { status: 413 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Re-check the real byte length; the declared size is client-supplied.
    if (buffer.length > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { success: false, error: `Maximum image size is ${MAX_UPLOAD_LABEL}.` },
        { status: 413 }
      );
    }

    await connectToDatabase();

    const filename = generateStoredFilename(file.type);

    await StoredUpload.create({
      folder: folderValue,
      filename,
      originalName: file.name.slice(0, 180),
      mimeType: file.type,
      size: buffer.length,
      data: buffer,
    });

    return NextResponse.json(
      {
        success: true,
        url: buildUploadUrl(folderValue, filename),
        filename,
        size: buffer.length,
        folder: folderValue,
        mimeType: file.type,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof MissingMongoUriError) return storageUnavailable();
    console.error('Upload processing error:', error);
    return NextResponse.json({ success: false, error: 'The image could not be saved.' }, { status: 500 });
  }
}

/**
 * DELETE /api/upload?url=/api/uploads/<folder>/<filename>
 * DELETE /api/upload?folder=<folder>&filename=<filename>
 */
export async function DELETE(req: NextRequest) {
  if (!(await verifyAdminAuth(req))) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  const folder = searchParams.get('folder');
  const filename = searchParams.get('filename');

  let target: { folder: UploadFolder; filename: string } | null = null;

  if (url) {
    target = parseUploadUrl(url);
  } else if (folder && filename) {
    target = isUploadFolder(folder) && isSafeStoredFilename(filename) ? { folder, filename } : null;
  } else {
    return NextResponse.json(
      { success: false, error: 'Provide either ?url= or both ?folder= and ?filename=.' },
      { status: 400 }
    );
  }

  if (!target) {
    return NextResponse.json({ success: false, error: 'Invalid media reference.' }, { status: 400 });
  }

  try {
    const deleted = await deleteStoredUpload(target.folder, target.filename);

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Media asset not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Image removed successfully.' });
  } catch (error) {
    if (error instanceof MissingMongoUriError) return storageUnavailable();
    console.error('Error deleting upload:', error);
    return NextResponse.json({ success: false, error: 'The image could not be removed.' }, { status: 500 });
  }
}
