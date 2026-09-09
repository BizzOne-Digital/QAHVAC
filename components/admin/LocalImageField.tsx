'use client';

import React, { useId, useRef, useState } from 'react';
import { AdminImage } from './AdminImage';
import { useToast } from './Toast';
import {
  ACCEPT_ATTRIBUTE,
  ALLOWED_MIME_TYPES,
  MAX_UPLOAD_BYTES,
  MAX_UPLOAD_LABEL,
  UploadFolder,
  isAllowedMimeType,
  parseUploadUrl,
} from '@/lib/uploads/validation';

interface LocalImageFieldProps {
  label: string;
  /** Current image URL, or null/empty when unset. */
  value?: string | null;
  /** Receives the new public URL, or null when the image is removed. */
  onChange: (url: string | null) => void;
  folder: UploadFolder;
  hint?: string;
  /** Copy shown in the empty dropzone, e.g. "Upload service image". */
  placeholder?: string;
}

/**
 * Admin image field backed by MongoDB storage.
 *
 * Uploads go to POST /api/upload and the component hands back only the
 * resulting `/api/uploads/<folder>/<filename>` URL — the caller persists that
 * string on its own document. The previous image is deleted only after the
 * replacement has been stored, so a failed upload never loses the old one.
 */
export function LocalImageField({
  label,
  value,
  onChange,
  folder,
  hint,
  placeholder = 'Upload an image',
}: LocalImageFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const toast = useToast();

  const currentUrl = value || '';
  const hasImage = currentUrl.length > 0;

  const openPicker = () => inputRef.current?.click();

  /**
   * Best-effort cleanup of a replaced image. A failure here is logged and
   * surfaced quietly: the new image is already saved and must keep working.
   */
  const discardPrevious = async (previousUrl: string) => {
    if (!parseUploadUrl(previousUrl)) return;
    try {
      await fetch(`/api/upload?url=${encodeURIComponent(previousUrl)}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Could not remove the replaced image:', err);
    }
  };

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!isAllowedMimeType(file.type)) {
      toast.error('Unsupported image type. Use PNG, JPG, WebP or GIF.');
      return;
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error(`Maximum image size is ${MAX_UPLOAD_LABEL}.`);
      return;
    }

    const previousUrl = currentUrl;
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Image upload failed.');
      }

      // Hand the URL up first; the old binary goes only once the new one is safe.
      onChange(data.url);
      toast.success('Image uploaded successfully.');

      if (previousUrl && previousUrl !== data.url) {
        await discardPrevious(previousUrl);
      }
    } catch (err) {
      // The existing image is untouched, so the field simply stays as it was.
      toast.error(err instanceof Error ? err.message : 'Image upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    const previousUrl = currentUrl;
    onChange(null);
    toast.success('Image removed successfully.');
    await discardPrevious(previousUrl);
  };

  return (
    <div>
      <label className="field-label" htmlFor={inputId}>
        {label}
      </label>

      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={ACCEPT_ATTRIBUTE}
        onChange={handleFile}
        disabled={isUploading}
        className="sr-only"
      />

      {hasImage ? (
        <div className="border border-line bg-canvas-sunk">
          <div className="relative aspect-[16/9] w-full bg-canvas-sunk">
            <AdminImage
              src={currentUrl}
              alt={label}
              fill
              sizes="(max-width: 768px) 100vw, 480px"
              className="object-cover"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-canvas/80 flex items-center justify-center">
                <span className="type-label text-ink-2">Uploading…</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 px-3.5 py-3 border-t border-line bg-surface">
            <span className="type-meta text-ink-3 truncate max-w-[60%]" title={currentUrl}>
              {currentUrl}
            </span>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={openPicker}
                disabled={isUploading}
                className="type-label text-ink hover:text-ink-2 transition-colors disabled:opacity-45"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={isUploading}
                className="type-label text-urgent hover:text-urgent-hover transition-colors disabled:opacity-45"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          disabled={isUploading}
          className="w-full border border-dashed border-line-strong bg-surface px-6 py-10 text-center transition-colors hover:border-ink disabled:opacity-60"
        >
          <span className="type-h4 text-ink block">
            {isUploading ? 'Uploading…' : placeholder}
          </span>
          <span className="type-meta text-ink-3 block mt-2">
            {ALLOWED_MIME_TYPES.map(t => t.replace('image/', '').toUpperCase()).join(', ')} · maximum{' '}
            {MAX_UPLOAD_LABEL}
          </span>
          {!isUploading && (
            <span className="type-label text-ink border border-line-strong px-4 py-2 inline-block mt-5">
              Choose image
            </span>
          )}
        </button>
      )}

      {hint && <p className="type-meta text-ink-3 mt-2">{hint}</p>}
    </div>
  );
}
