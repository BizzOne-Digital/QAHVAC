import { parseUploadUrl } from './validation';

/**
 * Browser-side cleanup for an image that a content record no longer points at.
 *
 * Only internal `/api/uploads/...` URLs are touched — external and placeholder
 * URLs are left alone. Failures are logged rather than thrown: by the time this
 * runs, the content change has already been saved and must not be rolled back
 * because a stale binary could not be swept up.
 */
export async function deleteServiceImage(url: string | null | undefined): Promise<void> {
  if (!url || !parseUploadUrl(url)) return;

  try {
    await fetch(`/api/upload?url=${encodeURIComponent(url)}`, { method: 'DELETE' });
  } catch (err) {
    console.error('Could not remove the orphaned image:', err);
  }
}
