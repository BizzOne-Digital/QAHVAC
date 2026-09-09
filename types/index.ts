export type ServiceCategory = 'heating' | 'cooling' | 'heat-pumps' | 'maintenance' | 'commercial' | 'emergency';

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  category: ServiceCategory;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  priceEstimate: string;
  durationEstimate: string;
  emergencyAvailable: boolean;
  image: string;
  active: boolean;
  order: number;
}

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
export type PropertyType = 'residential' | 'commercial';
export type BookingUrgency = 'standard' | 'emergency_today' | 'flexible';

export interface Booking {
  id: string;
  referenceNumber: string;
  customerName: string;
  email: string;
  phone: string;
  propertyType: PropertyType;
  serviceId: string;
  serviceName: string;
  preferredDate: string;
  preferredTimeSlot: string;
  urgency: BookingUrgency;
  address: {
    street: string;
    city: string;
    postalCode: string;
  };
  equipmentBrand?: string;
  equipmentAge?: string;
  issueDescription: string;
  status: BookingStatus;
  technicianNotes?: string;
  assignedTechnician?: string;
  createdAt: string;
  updatedAt: string;
}

export type InquiryStatus = 'new' | 'contacted' | 'resolved' | 'archived';

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyType: PropertyType;
  subject: string;
  message: string;
  status: InquiryStatus;
  adminNotes?: string;
  createdAt: string;
}

export interface SiteSettings {
  businessName: string;
  tagline: string;
  heroHeadline?: string;
  contactPerson: string;
  phone: string;
  phoneDisplay?: string;
  email: string;
  serviceArea: string;
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
    emergency: string;
  };
  operatingHours?: {
    weekdays: string;
    saturday: string;
    sunday: string;
    emergency?: string;
  };
  emergencyBanner: {
    enabled: boolean;
    headline: string;
    message: string;
    phone: string;
  };
  aboutStory: string;
  fatherSonPhilosophy: string;
  stats: {
    yearsExperience: string;
    familiesServed: string;
    responseRate: string;
    satisfactionRate: string;
  };
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    googleReviews?: string;
  };
  logoUrl?: string;
}

export interface StoredUpload {
  id: string;
  folder: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  publicUrl?: string;
  dataBase64?: string;
  createdAt: string;
}
