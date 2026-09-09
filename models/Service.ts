import mongoose, { Model, Schema } from 'mongoose';
import { ServiceItem } from '@/types';

/**
 * The public catalogue. `id` and `slug` keep the string identifiers the app has
 * always used, so existing URLs and booking references stay valid.
 */
const ServiceSchema = new Schema<ServiceItem>(
  {
    id: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    shortDesc: { type: String, required: true },
    fullDesc: { type: String, default: '' },
    features: { type: [String], default: [] },
    durationEstimate: { type: String, default: '' },
    emergencyAvailable: { type: Boolean, default: false },
    image: { type: String, default: '' },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, minimize: false }
);

ServiceSchema.index({ order: 1 });

export const ServiceModel: Model<ServiceItem> =
  (mongoose.models.Service as Model<ServiceItem>) ||
  mongoose.model<ServiceItem>('Service', ServiceSchema);
