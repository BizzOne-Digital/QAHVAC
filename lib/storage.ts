import { AdminUser, Booking, ContactSubmission, ServiceItem, SiteSettings } from '@/types';
import { connectToDatabase } from './mongodb';
import { INITIAL_SERVICES, INITIAL_SETTINGS } from './seed-data';
import { AdminModel } from '@/models/Admin';
import { BookingModel } from '@/models/Booking';
import { InquiryModel } from '@/models/Inquiry';
import { ServiceModel } from '@/models/Service';
import { SettingsModel } from '@/models/Settings';

/**
 * The application's data store, backed by MongoDB.
 *
 * This used to read and write `data/db.json`. A serverless host mounts the
 * filesystem read-only, so every write threw and surfaced as a 500 — including
 * admin sign-in, which stamps a last-login time. Everything now lives in the
 * same database the uploaded images do, and survives redeployments.
 *
 * Every method is async. Documents keep their original string `id` values so
 * existing URLs, slugs and booking references stay valid.
 */

/**
 * Drops Mongo's own bookkeeping fields (`_id`, `__v`) so callers get the plain
 * domain shape they had when this was a JSON file. Documents that carry their
 * own ISO-string `createdAt`/`updatedAt` keep them; Mongoose's Date versions of
 * those fields are discarded.
 */
function strip<T>(doc: unknown): T | undefined {
  if (!doc) return undefined;

  const {
    _id: _ignoredId,
    __v: _ignoredVersion,
    createdAt,
    updatedAt,
    ...rest
  } = doc as Record<string, unknown>;

  const result = rest as Record<string, unknown>;
  if (typeof createdAt === 'string') result.createdAt = createdAt;
  if (typeof updatedAt === 'string') result.updatedAt = updatedAt;

  return result as T;
}

function stripAll<T>(docs: unknown[]): T[] {
  return docs.map(d => strip<T>(d)).filter((d): d is T => Boolean(d));
}

function nowIso(): string {
  return new Date().toISOString();
}

function randomId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
}

export const storage = {
  /* ------------------------------------------------------------- Settings */

  /**
   * Reads the singleton settings document, creating it from the bootstrap
   * defaults the first time the app runs against an empty database.
   */
  getSettings: async (): Promise<SiteSettings> => {
    await connectToDatabase();

    const existing = await SettingsModel.findOne({ key: 'site' }).lean();
    if (existing) {
      // Merge over the defaults so a document written before a field was added
      // still returns a complete object.
      return { ...INITIAL_SETTINGS, ...strip<SiteSettings>(existing) };
    }

    const created = await SettingsModel.create({ key: 'site', ...INITIAL_SETTINGS });
    return { ...INITIAL_SETTINGS, ...strip<SiteSettings>(created.toObject()) };
  },

  updateSettings: async (updates: Partial<SiteSettings>): Promise<SiteSettings> => {
    await connectToDatabase();

    // `key` is ours to control; never let a request body reassign it.
    const { ...safeUpdates } = updates as Partial<SiteSettings> & { key?: unknown };
    delete (safeUpdates as { key?: unknown }).key;

    const updated = await SettingsModel.findOneAndUpdate(
      { key: 'site' },
      { $set: safeUpdates },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    return { ...INITIAL_SETTINGS, ...strip<SiteSettings>(updated) };
  },

  /* --------------------------------------------------------- Admin accounts */

  getAdmins: async (): Promise<AdminUser[]> => {
    await connectToDatabase();
    return stripAll<AdminUser>(await AdminModel.find().lean());
  },

  getAdminById: async (id: string): Promise<AdminUser | undefined> => {
    await connectToDatabase();
    return strip<AdminUser>(await AdminModel.findOne({ id }).lean());
  },

  getAdminByEmail: async (email: string): Promise<AdminUser | undefined> => {
    await connectToDatabase();
    return strip<AdminUser>(await AdminModel.findOne({ email: email.trim().toLowerCase() }).lean());
  },

  saveAdmin: async (admin: AdminUser): Promise<AdminUser> => {
    await connectToDatabase();
    const saved = await AdminModel.findOneAndUpdate(
      { id: admin.id },
      { $set: admin },
      { new: true, upsert: true }
    ).lean();
    return strip<AdminUser>(saved)!;
  },

  updateAdmin: async (id: string, updates: Partial<AdminUser>): Promise<AdminUser | null> => {
    await connectToDatabase();
    const updated = await AdminModel.findOneAndUpdate(
      { id },
      { $set: { ...updates, id, updatedAt: nowIso() } },
      { new: true }
    ).lean();
    return strip<AdminUser>(updated) ?? null;
  },

  /* -------------------------------------------------------------- Services */

  /**
   * Returns the catalogue in display order, seeding the bootstrap services the
   * first time the app runs against an empty database.
   */
  getServices: async (activeOnly = false): Promise<ServiceItem[]> => {
    await connectToDatabase();

    const count = await ServiceModel.estimatedDocumentCount();
    if (count === 0) {
      await ServiceModel.insertMany(INITIAL_SERVICES, { ordered: false }).catch(err => {
        // A parallel request may have seeded first; duplicates are expected.
        console.warn('Service bootstrap skipped:', err?.message);
      });
    }

    const filter = activeOnly ? { active: true } : {};
    return stripAll<ServiceItem>(await ServiceModel.find(filter).sort({ order: 1 }).lean());
  },

  getServiceBySlug: async (slug: string): Promise<ServiceItem | undefined> => {
    await connectToDatabase();
    return strip<ServiceItem>(await ServiceModel.findOne({ slug }).lean());
  },

  getServiceById: async (id: string): Promise<ServiceItem | undefined> => {
    await connectToDatabase();
    return strip<ServiceItem>(await ServiceModel.findOne({ id }).lean());
  },

  saveService: async (service: ServiceItem): Promise<ServiceItem> => {
    await connectToDatabase();
    const saved = await ServiceModel.findOneAndUpdate(
      { id: service.id },
      { $set: service },
      { new: true, upsert: true }
    ).lean();
    return strip<ServiceItem>(saved)!;
  },

  deleteService: async (id: string): Promise<boolean> => {
    await connectToDatabase();
    const result = await ServiceModel.deleteOne({ id });
    return result.deletedCount > 0;
  },

  /* -------------------------------------------------------------- Bookings */

  getBookings: async (): Promise<Booking[]> => {
    await connectToDatabase();
    return stripAll<Booking>(await BookingModel.find().sort({ createdAt: -1 }).lean());
  },

  getBookingById: async (id: string): Promise<Booking | undefined> => {
    await connectToDatabase();
    return strip<Booking>(await BookingModel.findOne({ id }).lean());
  },

  createBooking: async (
    data: Omit<Booking, 'id' | 'referenceNumber' | 'createdAt' | 'updatedAt' | 'status'> & {
      status?: Booking['status'];
    }
  ): Promise<Booking> => {
    await connectToDatabase();

    const now = nowIso();
    const newBooking: Booking = {
      ...data,
      id: randomId('bkg'),
      referenceNumber: `QP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: data.status || 'pending',
      createdAt: now,
      updatedAt: now,
    };

    const created = await BookingModel.create(newBooking);
    return strip<Booking>(created.toObject())!;
  },

  updateBooking: async (id: string, updates: Partial<Booking>): Promise<Booking | null> => {
    await connectToDatabase();
    const updated = await BookingModel.findOneAndUpdate(
      { id },
      { $set: { ...updates, id, updatedAt: nowIso() } },
      { new: true }
    ).lean();
    return strip<Booking>(updated) ?? null;
  },

  deleteBooking: async (id: string): Promise<boolean> => {
    await connectToDatabase();
    const result = await BookingModel.deleteOne({ id });
    return result.deletedCount > 0;
  },

  /* ------------------------------------------------------------- Inquiries */

  getInquiries: async (): Promise<ContactSubmission[]> => {
    await connectToDatabase();
    return stripAll<ContactSubmission>(await InquiryModel.find().sort({ createdAt: -1 }).lean());
  },

  createInquiry: async (
    data: Omit<ContactSubmission, 'id' | 'createdAt' | 'status'>
  ): Promise<ContactSubmission> => {
    await connectToDatabase();

    const newInquiry: ContactSubmission = {
      ...data,
      id: randomId('inq'),
      status: 'new',
      createdAt: nowIso(),
    };

    const created = await InquiryModel.create(newInquiry);
    return strip<ContactSubmission>(created.toObject())!;
  },

  updateInquiry: async (
    id: string,
    updates: Partial<ContactSubmission>
  ): Promise<ContactSubmission | null> => {
    await connectToDatabase();
    const updated = await InquiryModel.findOneAndUpdate(
      { id },
      { $set: { ...updates, id } },
      { new: true }
    ).lean();
    return strip<ContactSubmission>(updated) ?? null;
  },

  deleteInquiry: async (id: string): Promise<boolean> => {
    await connectToDatabase();
    const result = await InquiryModel.deleteOne({ id });
    return result.deletedCount > 0;
  },
};
