'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { toSiteContact } from '@/lib/site';

interface EmergencyBannerProps {
  headline?: string;
  message?: string;
  /** Raw dialable number; the display form is derived from it. */
  phone?: string;
}

/**
 * A single flat utility strip. No pulse, no ping, no gradient — urgency comes
 * from the one reserved colour in the palette and from the wording.
 */
export function EmergencyBanner({
  headline = '24/7 emergency heating and cooling dispatch',
  message,
  phone,
}: EmergencyBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const contact = toSiteContact(phone ? { phone } : null);

  if (!isVisible) return null;

  return (
    <div id="emergency-dispatch-banner" className="bg-urgent text-white">
      <Container>
        <div className="flex items-center justify-between gap-6 py-2.5">
          <p className="type-meta text-white/85 truncate">
            <span className="type-label mr-3 text-white">Emergency</span>
            <span className="hidden sm:inline">
              {message || `${headline} — no heat or no cooling? Speak to us directly:`}{' '}
            </span>
            <a href={`tel:${contact.phone}`} id="emergency-banner-call-btn" className="font-semibold text-white underline underline-offset-[3px] decoration-white/40 hover:decoration-white">
              {contact.phoneDisplay}
            </a>
          </p>

          <button
            onClick={() => setIsVisible(false)}
            id="dismiss-emergency-banner-btn"
            aria-label="Dismiss emergency dispatch notice"
            className="-mr-2 p-2 text-white/60 hover:text-white transition-colors flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        </div>
      </Container>
    </div>
  );
}
