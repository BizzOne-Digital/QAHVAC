'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Upload,
  Image as ImageIcon,
  Copy,
  Check,
  Trash2,
  AlertCircle,
  FileCheck,
  FolderOpen
} from 'lucide-react';
import { StoredUpload } from '@/types';

export default function AdminMediaPage() {
  const [uploads, setUploads] = useState<StoredUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<'services' | 'team' | 'misc'>('services');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchUploads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/upload');
      const data = await res.json();
      if (data.success) {
        setUploads(data.data);
      }
    } catch (err) {
      console.error('Error fetching uploads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', selectedFolder);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      fetchUploads();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/upload?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setUploads(prev => prev.filter(u => u.id !== id));
      }
    } catch (err) {
      console.error('Error deleting upload:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Media Library & Equipment Photo Storage
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Upload and manage images stored for HVAC service cards, before/after job photos, and site banners.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Upload Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="max-w-xl mx-auto text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-bold text-slate-400">Target Category / Folder:</span>
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value as 'services' | 'team' | 'misc')}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="services">services (Equipment & diagnostic photos)</option>
              <option value="team">team (Craftsman & truck photos)</option>
              <option value="misc">misc (Banners & general assets)</option>
            </select>
          </div>

          <label
            htmlFor="media-file-input"
            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
              uploading
                ? 'border-blue-500 bg-blue-950/20'
                : 'border-slate-700 hover:border-slate-500 bg-slate-950/60'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-blue-950 text-blue-400 flex items-center justify-center mb-3">
              <Upload className="w-6 h-6" />
            </div>

            <span className="text-sm font-bold text-white">
              {uploading ? 'Uploading & Processing Image...' : 'Click to Upload or Drag & Drop'}
            </span>
            <span className="text-[11px] text-slate-400 mt-1">
              Supports JPEG, PNG, WebP, GIF (Max 8MB). Stored safely and served via /api/uploads/
            </span>

            <input
              id="media-file-input"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              disabled={uploading}
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Uploaded Items Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-blue-400" />
            Stored Media Assets ({uploads.length})
          </h3>
        </div>

        {uploads.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-xs">
            No media uploaded yet. Use the upload box above to add equipment and site images.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {uploads.map((upload) => {
              const fileUrl = upload.url || upload.publicUrl || '';
              return (
                <div
                  key={upload.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between shadow-lg hover:border-slate-700 transition-colors"
                >
                  <div className="relative aspect-[4/3] w-full bg-slate-950">
                    <Image
                      src={fileUrl}
                      alt={upload.filename}
                      fill
                      referrerPolicy="no-referrer"
                      className="object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 rounded bg-slate-950/80 text-[10px] font-bold text-white uppercase border border-slate-700">
                        {upload.folder}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-2">
                    <div className="text-[11px] font-mono text-slate-300 truncate" title={upload.filename}>
                      {upload.filename}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {(upload.size / 1024).toFixed(1)} KB • {new Date(upload.createdAt).toLocaleDateString()}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <button
                        onClick={() => copyToClipboard(fileUrl)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-400 hover:text-blue-300"
                      >
                        {copiedUrl === fileUrl ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied URL!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy URL</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDelete(upload.id)}
                        className="p-1 rounded text-slate-500 hover:text-red-400"
                        title="Delete Upload"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
