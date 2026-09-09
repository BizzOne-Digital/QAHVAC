import mongoose, { Model, Schema } from 'mongoose';
import { UPLOAD_FOLDERS, UploadFolder } from '@/lib/uploads/validation';

/**
 * The single persistent home for uploaded binaries.
 *
 * The image bytes live here and nowhere else: content documents (services,
 * settings, gallery entries) store only the `/api/uploads/<folder>/<filename>`
 * URL that resolves back to one of these records.
 */
export interface StoredUploadDocument {
  folder: UploadFolder;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  data: Buffer;
  createdAt: Date;
  updatedAt: Date;
}

const StoredUploadSchema = new Schema<StoredUploadDocument>(
  {
    folder: { type: String, required: true, enum: UPLOAD_FOLDERS },
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true }
);

// Filenames are generated per folder, and the delivery route looks records up
// by exactly this pair.
StoredUploadSchema.index({ folder: 1, filename: 1 }, { unique: true });

// Newest-first listing for the media library.
StoredUploadSchema.index({ createdAt: -1 });

/**
 * Reuse the compiled model across hot reloads; recompiling the same name throws
 * `OverwriteModelError` in development.
 */
export const StoredUpload: Model<StoredUploadDocument> =
  (mongoose.models.StoredUpload as Model<StoredUploadDocument>) ||
  mongoose.model<StoredUploadDocument>('StoredUpload', StoredUploadSchema);
