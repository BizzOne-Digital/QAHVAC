'use client';

import { useEffect, useState } from 'react';
import { SiteContact, toSiteContact } from '@/lib/site';

/**
 * Resolves the business contact details shown in the site chrome.
 *
 * Server-rendered pages pass the live settings in as a prop (no round trip).
 * Fully client-rendered pages omit it, and the hook fetches them once so the
 * header and footer never fall out of step with the dashboard.
 */
export function useSiteContact(contactProp?: SiteContact): SiteContact {
  const [contact, setContact] = useState<SiteContact>(contactProp ?? toSiteContact());

  useEffect(() => {
    if (contactProp) {
      setContact(contactProp);
      return;
    }

    let cancelled = false;
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (!cancelled && data?.success) setContact(toSiteContact(data.data));
      })
      .catch(() => {
        /* Falls back to the compiled defaults already in state. */
      });

    return () => {
      cancelled = true;
    };
  }, [contactProp]);

  return contact;
}
