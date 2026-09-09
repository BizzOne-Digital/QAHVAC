import mongoose, { Model, Schema } from 'mongoose';
import { ContactSubmission } from '@/types';

/** A message submitted through the public contact form. */
const InquirySchema = new Schema<ContactSubmission>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    propertyType: { type: String, default: 'residential' },
    subject: { type: String, default: '' },
    message: { type: String, required: true },
    status: { type: String, default: 'new', index: true },
    adminNotes: String,
    createdAt: { type: String, required: true },
  },
  { minimize: false }
);

InquirySchema.index({ createdAt: -1 });

export const InquiryModel: Model<ContactSubmission> =
  (mongoose.models.Inquiry as Model<ContactSubmission>) ||
  mongoose.model<ContactSubmission>('Inquiry', InquirySchema);
