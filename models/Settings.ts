import mongoose, { Model, Schema } from 'mongoose';
import { SiteSettings } from '@/types';

/**
 * Site settings are a singleton: exactly one document, pinned by `key`, so a
 * concurrent upsert can never create a second copy.
 */
export interface SettingsDocument extends SiteSettings {
  key: string;
}

const SettingsSchema = new Schema<SettingsDocument>(
  {
    key: { type: String, required: true, unique: true, default: 'site' },

    businessName: { type: String, required: true },
    tagline: { type: String, required: true },
    heroHeadline: String,
    contactPerson: { type: String, required: true },
    phone: { type: String, required: true },
    phoneDisplay: String,
    email: { type: String, required: true },
    serviceArea: { type: String, required: true },

    hours: {
      weekdays: String,
      saturday: String,
      sunday: String,
      emergency: String,
    },

    emergencyBanner: {
      enabled: Boolean,
      headline: String,
      message: String,
      phone: String,
    },

    aboutStory: String,
    fatherSonPhilosophy: String,

    stats: {
      yearsExperience: String,
      familiesServed: String,
      responseRate: String,
      satisfactionRate: String,
    },

    socialLinks: {
      facebook: String,
      instagram: String,
      googleReviews: String,
    },

    logoUrl: String,
  },
  { timestamps: true, minimize: false }
);

export const SettingsModel: Model<SettingsDocument> =
  (mongoose.models.Settings as Model<SettingsDocument>) ||
  mongoose.model<SettingsDocument>('Settings', SettingsSchema);
