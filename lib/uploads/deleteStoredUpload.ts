import { connectToDatabase } from '@/lib/mongodb';
import { StoredUpload } from '@/models/StoredUpload';
import { UploadFolder, parseUploadUrl } from './validation';

/**
 * Deletes the stored binary behind an internal upload URL.
 *
 * Anything that is not one of our own `/api/uploads/<folder>/<filename>` URLs —
 * an external image, a placeholder, a legacy `/uploads/...` path — is ignored
 * rather than treated as an error, so callers can pass whatever the content
 * document happened to hold.
 *
 * Returns true only when a record was actually removed.
 */
export async function deleteStoredUploadByUrl(url: string | null | undefined): Promise<boolean> {
  if (!url) return false;

  const parsed = parseUploadUrl(url);
  if (!parsed) return false;

  return deleteStoredUpload(parsed.folder, parsed.filename);
}

export async function deleteStoredUpload(folder: UploadFolder, filename: string): Promise<boolean> {
  await connectToDatabase();
  const result = await StoredUpload.deleteOne({ folder, filename });
  return result.deletedCount > 0;
}
