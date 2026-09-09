import React from 'react';
import { Footer } from './Footer';
import { storage } from '@/lib/storage';
import { toSiteContact } from '@/lib/site';

/**
 * Server-rendered footer. Reads the live site settings so the published phone
 * number and email always match the dashboard, with no client round trip.
 * Client-only pages can still render <Footer /> directly.
 */
export function SiteFooter() {
  return <Footer contact={toSiteContact(storage.getSettings())} />;
}
