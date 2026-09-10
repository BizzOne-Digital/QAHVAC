'use client';

import React, { useId, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { AdminImage } from './AdminImage';
import { useToast } from './Toast';
import { deleteServiceImage } from '@/lib/uploads/client';
import {
  ACCEPT_ATTRIBUTE,
  ALLOWED_MIME_TYPES,
  MAX_SERVICE_IMAGES,
  MAX_UPLOAD_BYTES,
  MAX_UPLOAD_LABEL,
  UploadFolder,
  isAllowedMimeType,
} from '@/lib/uploads/validation';

interface LocalImageGalleryFieldProps {
  label: string;
  /** Current gallery, in display order. */
  value: string[];
  /** Receives the complete new list on every add, remove or reorder. */
  onChange: (urls: string[]) => void;
  folder: UploadFolder;
  hint?: string;
  max?: number;
}

/**
 * Multi-image companion to {@link LocalImageField}.
 *
 * Uploads go to POST /api/upload one file at a time — the endpoint takes a
 * single file per request — and every successful URL is appended in the order
 * the files were chosen. A file that fails is reported and skipped rather than
 * aborting the batch, so one oversized photograph does not discard the rest.
 *
 * Removal deletes the stored binary immediately. That is safe here in a way it
 * would not be for the cover image: the gallery entry is gone from the list at
 * the same moment, and the parent form saves the list it was handed.
 */
export function LocalImageGalleryField({
  label,
  value,
  onChange,
  folder,
  hint,
  max = MAX_SERVICE_IMAGES,
}: LocalImageGalleryFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  const images = value ?? [];
  const remaining = Math.max(0, max - images.length);
  const isFull = remaining === 0;

  const openPicker = () => inputRef.current?.click();

  const uploadOne = async (file: File): Promise<string | null> => {
    if (!isAllowedMimeType(file.type)) {
      toast.error(`${file.name}: unsupported type. Use PNG, JPG, WebP or GIF.`);
      return null;
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error(`${file.name}: over the ${MAX_UPLOAD_LABEL} limit.`);
      return null;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok || !data.success) throw new Error(data.error || 'Upload failed.');
      return data.url as string;
    } catch (err) {
      toast.error(`${file.name}: ${err instanceof Error ? err.message : 'upload failed.'}`);
      return null;
    }
  };

  const handleFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (chosen.length === 0) return;

    // Trim to the remaining capacity up front so the extras are never uploaded.
    const accepted = chosen.slice(0, remaining);
    if (chosen.length > accepted.length) {
      toast.error(`Only ${max} images are allowed, so ${chosen.length - accepted.length} were skipped.`);
    }

    setBusy(true);
    const uploaded: string[] = [];

    for (const file of accepted) {
      const url = await uploadOne(file);
      if (url) uploaded.push(url);
    }

    setBusy(false);

    if (uploaded.length > 0) {
      onChange([...images, ...uploaded]);
      toast.success(`${uploaded.length} image${uploaded.length === 1 ? '' : 's'} added.`);
    }
  };

  const handleRemove = async (url: string) => {
    onChange(images.filter(item => item !== url));
    await deleteServiceImage(url);
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label className="field-label" htmlFor={inputId}>
          {label}
        </label>
        <span className="type-meta text-ink-3">
          {images.length} of {max}
        </span>
      </div>

      <input
        id={inputId}
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPT_ATTRIBUTE}
        onChange={handleFiles}
        disabled={busy || isFull}
        className="sr-only"
      />

      {images.length > 0 && (
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {images.map((url, index) => (
            <li key={url} className="border border-line bg-canvas-sunk">
              <div className="relative aspect-[4/3] w-full">
                <AdminImage
                  src={url}
                  alt={`${label} ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 220px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemove(url)}
                  disabled={busy}
                  aria-label={`Remove image ${index + 1}`}
                  className="absolute top-1.5 right-1.5 bg-canvas/90 border border-line p-1 text-urgent hover:bg-canvas disabled:opacity-45"
                >
                  <X className="w-3.5 h-3.5" strokeWidth={2} />
                </button>
              </div>

              <div className="flex items-center justify-between gap-2 px-2 py-1.5 border-t border-line bg-surface">
                <span className="type-meta text-ink-3">{index + 1}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, index - 1)}
                    disabled={busy || index === 0}
                    aria-label={`Move image ${index + 1} earlier`}
                    className="text-ink hover:text-ink-2 disabled:opacity-30"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, index + 1)}
                    disabled={busy || index === images.length - 1}
                    aria-label={`Move image ${index + 1} later`}
                    className="text-ink hover:text-ink-2 disabled:opacity-30"
                  >
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={openPicker}
        disabled={busy || isFull}
        className="w-full border border-dashed border-line-strong bg-surface px-6 py-7 text-center transition-colors hover:border-ink disabled:opacity-60"
      >
        <span className="type-h4 text-ink block">
          {busy ? 'Uploading…' : isFull ? `Limit of ${max} reached` : 'Add gallery images'}
        </span>
        <span className="type-meta text-ink-3 block mt-2">
          {isFull
            ? 'Remove one to add another.'
            : `Choose several at once · ${ALLOWED_MIME_TYPES.map(t => t.replace('image/', '').toUpperCase()).join(', ')} · maximum ${MAX_UPLOAD_LABEL} each`}
        </span>
      </button>

      {hint && <p className="type-meta text-ink-3 mt-2">{hint}</p>}
    </div>
  );
}
