import { SiteSettings } from '@/types';
import { APP_CONFIG } from './config';

/** The subset of the site settings the chrome (header, footer, banner) needs. */
export interface SiteContact {
  businessName: string;
  phone: string;
  phoneDisplay: string;
  email: string;
  serviceArea: string;
}

/** `12269263032` -> `(226) 926-3032`. Returns the input unchanged if it is not a NANP number. */
export function formatPhoneDisplay(phone: string): string {
  const digits = (phone || '').replace(/\D/g, '');
  const national = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;
  if (national.length !== 10) return phone;
  return `(${national.slice(0, 3)}) ${national.slice(3, 6)}-${national.slice(6)}`;
}

export function toSiteContact(settings?: Partial<SiteSettings> | null): SiteContact {
  const phone = settings?.phone || APP_CONFIG.phone;
  return {
    businessName: settings?.businessName || APP_CONFIG.businessName,
    phone,
    phoneDisplay: settings?.phoneDisplay || formatPhoneDisplay(phone),
    email: settings?.email || APP_CONFIG.email,
    serviceArea: settings?.serviceArea || 'Greater Region & Surrounding Communities',
  };
}
