import React from 'react';
import { Navbar } from './Navbar';
import { storage } from '@/lib/storage';
import { toSiteContact } from '@/lib/site';

/**
 * Server-rendered header. Reads the live site settings so the phone number in
 * the navigation always matches what the dashboard has saved, with no client
 * round trip. Client-only pages can still render <Navbar /> directly.
 */
export function SiteHeader() {
  const settings = storage.getSettings();
  return <Navbar contact={toSiteContact(settings)} logoUrl={settings.logoUrl} />;
}
