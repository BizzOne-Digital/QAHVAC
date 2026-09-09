import { randomBytes } from 'crypto';

/** The only folders an upload may be filed under. Anything else is rejected. */
export const UPLOAD_FOLDERS = ['products', 'gallery', 'pages', 'misc'] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

/** The only image types accepted. Extension alone is never trusted. */
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const;
export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
export const MAX_UPLOAD_LABEL = '8MB';

/** Extension is derived from the validated MIME type, not the uploaded name. */
const EXTENSION_BY_MIME: Record<AllowedMimeType, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

/** Human labels for the accept attribute and error copy. */
export const ACCEPT_ATTRIBUTE = ALLOWED_MIME_TYPES.join(',');

export interface UploadSuccessResponse {
  success: true;
  url: string;
  filename: string;
  size: number;
  folder: UploadFolder;
  mimeType: AllowedMimeType;
}

export interface UploadErrorResponse {
  success: false;
  error: string;
}

export type UploadResponse = UploadSuccessResponse | UploadErrorResponse;

/** A stored upload as exposed to the admin UI — never includes the binary. */
export interface StoredUploadSummary {
  id: string;
  folder: UploadFolder;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
}

export function isUploadFolder(value: unknown): value is UploadFolder {
  return typeof value === 'string' && (UPLOAD_FOLDERS as readonly string[]).includes(value);
}

export function isAllowedMimeType(value: unknown): value is AllowedMimeType {
  return typeof value === 'string' && (ALLOWED_MIME_TYPES as readonly string[]).includes(value);
}

/**
 * A stored filename is always machine-generated, so the only shape we ever
 * accept back is `<digits>-<hex>.<ext>`. This rejects `..`, slashes,
 * backslashes, encoded traversal and anything else by construction.
 */
const STORED_FILENAME = /^[0-9]{10,17}-[0-9a-f]{8,32}\.(jpg|png|webp|gif)$/;

export function isSafeStoredFilename(value: unknown): value is string {
  if (typeof value !== 'string' || value.length > 128) return false;
  if (value.includes('..') || value.includes('/') || value.includes('\\') || value.includes('\0')) {
    return false;
  }
  return STORED_FILENAME.test(value);
}

/** `1778429123456-a8f31c92.webp` — unguessable, collision-safe, immutable. */
export function generateStoredFilename(mimeType: AllowedMimeType): string {
  return `${Date.now()}-${randomBytes(4).toString('hex')}.${EXTENSION_BY_MIME[mimeType]}`;
}

export function buildUploadUrl(folder: UploadFolder, filename: string): string {
  return `/api/uploads/${folder}/${filename}`;
}

/** Splits an internal upload URL back into its parts, or null if it is not one. */
export function parseUploadUrl(url: string): { folder: UploadFolder; filename: string } | null {
  if (typeof url !== 'string' || !url.startsWith('/api/uploads/')) return null;

  const [folder, filename, ...rest] = url.slice('/api/uploads/'.length).split('/');
  if (rest.length > 0) return null;
  if (!isUploadFolder(folder) || !isSafeStoredFilename(filename)) return null;

  return { folder, filename };
}

/** Legacy disk-backed URLs from before MongoDB storage; these no longer resolve. */
export function isLegacyUploadUrl(url: string): boolean {
  return typeof url === 'string' && url.startsWith('/uploads/');
}
