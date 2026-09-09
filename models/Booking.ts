import mongoose, { Model, Schema } from 'mongoose';
import { Booking } from '@/types';

/** A service appointment requested from the public booking wizard. */
const BookingSchema = new Schema<Booking>(
  {
    id: { type: String, required: true, unique: true },
    referenceNumber: { type: String, required: true, index: true },
    customerName: { type: String, required: true },
    email: { type: String, default: '' },
    phone: { type: String, required: true },
    propertyType: { type: String, default: 'residential' },
    serviceId: { type: String, default: '' },
    serviceName: { type: String, required: true },
    preferredDate: { type: String, required: true },
    preferredTimeSlot: { type: String, default: '' },
    urgency: { type: String, default: 'standard' },
    address: {
      street: String,
      city: String,
      postalCode: String,
    },
    equipmentBrand: String,
    equipmentAge: String,
    issueDescription: { type: String, default: '' },
    status: { type: String, default: 'pending', index: true },
    technicianNotes: String,
    assignedTechnician: String,
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
  },
  { minimize: false }
);

// The dashboard always lists newest first.
BookingSchema.index({ createdAt: -1 });

export const BookingModel: Model<Booking> =
  (mongoose.models.Booking as Model<Booking>) ||
  mongoose.model<Booking>('Booking', BookingSchema);
