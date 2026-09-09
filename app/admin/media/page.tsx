'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AdminImage } from '@/components/admin/AdminImage';
import { useToast } from '@/components/admin/Toast';
import { AdminPageHeading, EmptyState, LoadingState, Panel } from '@/components/admin/ui';
import { Button } from '@/components/ui/Button';
import { StoredUpload } from '@/types';
import {
  ACCEPT_ATTRIBUTE,
  ALLOWED_MIME_TYPES,
  MAX_UPLOAD_BYTES,
  MAX_UPLOAD_LABEL,
  UPLOAD_FOLDERS,
  UploadFolder,
  isAllowedMimeType,
} from '@/lib/uploads/validation';

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminMediaPage() {
  const [uploads, setUploads] = useState<StoredUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [folder, setFolder] = useState<UploadFolder>('products');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const fetchUploads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/upload');
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Could not load the media library.');
      }
      setUploads(data.data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not load the media library.');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUploads();
  }, [fetchUploads]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!isAllowedMimeType(file.type)) {
      toast.error('Unsupported image type. Use PNG, JPG, WebP or GIF.');
      return;
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error(`Maximum image size is ${MAX_UPLOAD_LABEL}.`);
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Image upload failed.');
      }

      toast.success('Image uploaded successfully.');
      await fetchUploads();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2500);
    } catch {
      toast.error('Could not copy the URL to the clipboard.');
    }
  };

  const handleDelete = async (upload: StoredUpload) => {
    try {
      const res = await fetch(`/api/upload?url=${encodeURIComponent(upload.url)}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'The image could not be removed.');
      }

      setUploads(prev => prev.filter(u => u.id !== upload.id));
      toast.success('Image removed successfully.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'The image could not be removed.');
    } finally {
      setPendingDelete(null);
    }
  };

  return (
    <>
      <AdminPageHeading
        eyebrow="Media"
        title="Image library"
        description="Images are stored in the database and served from /api/uploads, so they survive redeployments."
        actions={
          <Button variant="secondary" size="sm" onClick={fetchUploads} disabled={loading}>
            {loading ? 'Refreshing…' : 'Refresh'}
          </Button>
        }
      />

      <Panel>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-[24rem] w-full">
            <label htmlFor="media-folder" className="field-label">
              Destination folder
            </label>
            <select
              id="media-folder"
              value={folder}
              onChange={e => setFolder(e.target.value as UploadFolder)}
              className="field"
            >
              {UPLOAD_FOLDERS.map(name => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <p className="type-meta text-ink-3 mt-2">
              {ALLOWED_MIME_TYPES.map(t => t.replace('image/', '').toUpperCase()).join(', ')} · maximum{' '}
              {MAX_UPLOAD_LABEL}
            </p>
          </div>

          <div>
            <input
              id="media-file-input"
              ref={inputRef}
              type="file"
              accept={ACCEPT_ATTRIBUTE}
              disabled={uploading}
              onChange={handleFileUpload}
              className="sr-only"
            />
            <Button
              variant="primary"
              size="md"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? 'Uploading…' : 'Upload image'}
            </Button>
          </div>
        </div>
      </Panel>

      <section>
        <div className="flex items-baseline justify-between gap-4 pb-4 border-b border-line">
          <h2 className="type-h3 text-ink">Stored images</h2>
          <span className="type-meta text-ink-3">{uploads.length} in library</span>
        </div>

        {loading ? (
          <div className="mt-5">
            <LoadingState>Loading media library…</LoadingState>
          </div>
        ) : uploads.length === 0 ? (
          <div className="mt-5">
            <EmptyState>
              No images stored yet. Upload one above, or add an image directly from a service.
            </EmptyState>
          </div>
        ) : (
          <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {uploads.map(upload => (
              <li key={upload.id} className="bg-surface border border-line flex flex-col">
                <div className="relative aspect-[4/3] w-full bg-canvas-sunk border-b border-line">
                  <AdminImage
                    src={upload.url}
                    alt={upload.originalName}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
                    className="object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-surface/95 border border-line type-label text-ink-2 px-2 py-1">
                    {upload.folder}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col gap-3">
                  <div>
                    <p className="type-h4 text-ink truncate" title={upload.originalName}>
                      {upload.originalName}
                    </p>
                    <p className="type-meta text-ink-3 mt-1">
                      {formatSize(upload.size)} · {upload.mimeType.replace('image/', '').toUpperCase()}
                    </p>
                  </div>

                  <p className="type-meta text-ink-3 truncate" title={upload.url}>
                    {upload.url}
                  </p>

                  <div className="mt-auto pt-3 border-t border-line flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(upload.url)}
                      className="type-label text-ink hover:text-ink-2 transition-colors"
                    >
                      {copiedUrl === upload.url ? 'Copied' : 'Copy URL'}
                    </button>

                    {pendingDelete === upload.id ? (
                      <span className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleDelete(upload)}
                          className="type-label text-urgent hover:text-urgent-hover transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingDelete(null)}
                          className="type-label text-ink-3 hover:text-ink transition-colors"
                        >
                          Cancel
                        </button>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setPendingDelete(upload.id)}
                        className="type-label text-urgent hover:text-urgent-hover transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="type-meta text-ink-3 border-t border-line pt-5">
        Deleting an image here does not clear it from a service or setting that still references it —
        update that record too, or the placeholder will show in its place.
      </p>
    </>
  );
}
