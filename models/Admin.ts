import mongoose, { Model, Schema } from 'mongoose';
import { AdminUser } from '@/types';

/**
 * Administrator accounts. `passwordHash` holds a scrypt digest written by
 * `npm run seed:admin`; the plain password is never stored.
 */
const AdminSchema = new Schema<AdminUser>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    role: { type: String, required: true, default: 'admin' },
    passwordHash: { type: String, required: true },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
    lastLoginAt: String,
  },
  { minimize: false }
);

export const AdminModel: Model<AdminUser> =
  (mongoose.models.Admin as Model<AdminUser>) ||
  mongoose.model<AdminUser>('Admin', AdminSchema);
