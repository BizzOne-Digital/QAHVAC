import { StoredUpload } from '@/types';
import { APP_CONFIG, UploadFolder } from './config';
import { storage } from './storage';

export function isAllowedFolder(folder: string): folder is UploadFolder {
  return (APP_CONFIG.uploadFolders as readonly string[]).includes(folder);
}

export function isAllowedMimeType(mimeType: string): boolean {
  return (APP_CONFIG.allowedMimeTypes as readonly string[]).includes(mimeType);
}

export async function processUpload(
  file: File,
  folder: string
): Promise<{ success: true; upload: StoredUpload } | { success: false; error: string }> {
  if (!isAllowedFolder(folder)) {
    return { success: false, error: `Invalid folder. Allowed: ${APP_CONFIG.uploadFolders.join(', ')}` };
  }

  if (!isAllowedMimeType(file.type)) {
    return { success: false, error: `Invalid file type. Allowed: ${APP_CONFIG.allowedMimeTypes.join(', ')}` };
  }

  if (file.size > APP_CONFIG.maxUploadSize) {
    return { success: false, error: `File too large. Maximum size is ${APP_CONFIG.maxUploadSize / (1024 * 1024)}MB` };
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64Data = buffer.toString('base64');

  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const cleanRandom = Math.random().toString(36).substring(2, 8);
  const filename = `${Date.now()}-${cleanRandom}.${extension}`;
  const url = `/api/uploads/${folder}/${filename}`;

  const stored: StoredUpload = {
    id: `upl-${Date.now()}-${cleanRandom}`,
    folder,
    filename,
    originalName: file.name,
    mimeType: file.type,
    size: file.size,
    url,
    dataBase64: base64Data,
    createdAt: new Date().toISOString(),
  };

  storage.saveUpload(stored);

  return { success: true, upload: stored };
}
