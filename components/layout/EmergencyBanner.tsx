'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { APP_CONFIG } from '@/lib/config';

interface EmergencyBannerProps {
  headline?: string;
  phone?: string;
}

/**
 * A single flat utility strip. No pulse, no ping, no gradient — urgency comes
 * from the one reserved colour in the palette and from the wording.
 */
export function EmergencyBanner({
  headline = '24/7 emergency heating and cooling dispatch',
  phone = APP_CONFIG.phoneDisplay,
}: EmergencyBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div id="emergency-dispatch-banner" className="bg-urgent text-white">
      <Container>
        <div className="flex items-center justify-between gap-6 py-2.5">
          <p className="type-meta text-white/85 truncate">
            <span className="type-label mr-3 text-white">Emergency</span>
            <span className="hidden sm:inline">{headline} — no heat or no cooling? Speak to Jayson directly: </span>
            <a href={`tel:${APP_CONFIG.phone}`} id="emergency-banner-call-btn" className="font-semibold text-white underline underline-offset-[3px] decoration-white/40 hover:decoration-white">
              {phone}
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
