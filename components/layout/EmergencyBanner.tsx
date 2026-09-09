'use client';

import React, { useState } from 'react';
import { PhoneCall, AlertTriangle, X } from 'lucide-react';
import { APP_CONFIG } from '@/lib/config';

interface EmergencyBannerProps {
  headline?: string;
  phone?: string;
}

export function EmergencyBanner({
  headline = '24/7 Rapid Emergency Heating & Cooling Dispatch',
  phone = APP_CONFIG.phoneDisplay,
}: EmergencyBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div
      id="emergency-dispatch-banner"
      className="bg-gradient-to-r from-slate-950 via-red-950 to-slate-950 text-white border-b border-red-900/50 py-2 px-4 text-xs md:text-sm font-medium transition-all"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <span className="flex h-2.5 w-2.5 relative flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-red-300 font-bold uppercase tracking-wider text-[11px] bg-red-950/80 px-2 py-0.5 rounded border border-red-800/60 flex-shrink-0">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            Immediate Dispatch
          </span>
          <p className="truncate text-slate-200">
            {headline} — Furnace or AC emergency? Talk directly to Jayson:
          </p>
          <a
            href={`tel:${APP_CONFIG.phone}`}
            id="emergency-banner-call-btn"
            className="inline-flex items-center gap-1.5 font-bold text-white hover:text-red-300 underline underline-offset-4 flex-shrink-0 transition-colors ml-1"
          >
            <PhoneCall className="w-3.5 h-3.5 text-red-400" />
            {phone}
          </a>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          id="dismiss-emergency-banner-btn"
          aria-label="Dismiss banner"
          className="text-slate-400 hover:text-white p-1 rounded transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
