import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  showSubtitle?: boolean;
}

export function BrandLogo({ className = '', variant = 'dark', showSubtitle = true }: BrandLogoProps) {
  const isLight = variant === 'light';

  return (
    <Link href="/" className={`inline-flex items-center gap-3.5 group select-none ${className}`} id="qp-hvac-brand-logo">
      {/* Precision Engineered HVAC Emblem */}
      <div className="relative w-11 h-11 rounded-xl bg-zinc-950/90 flex items-center justify-center p-2.5 shadow-lg border border-white/10 group-hover:border-white/25 transition-all duration-300">
        <svg viewBox="0 0 48 48" fill="none" className="w-full h-full transform group-hover:scale-105 transition-transform duration-300">
          {/* Dual Thermal Convergence Curves */}
          <path
            d="M24 7 C16 14, 11 21, 11 29 C11 37, 17 42, 24 42"
            stroke="#38BDF8"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M24 7 C32 14, 37 21, 37 29 C37 37, 31 42, 24 42"
            stroke="#F43F5E"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Central Precision Core Indicator */}
          <circle cx="24" cy="27" r="4" fill="#FFFFFF" />
          <path
            d="M24 16 L24 20 M24 34 L24 38 M13 27 L17 27 M31 27 L35 27"
            stroke="#94A3B8"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
        {/* Discrete Micro Status Pip */}
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-zinc-950 shadow-sm" title="24/7 Dispatch Ready" />
      </div>

      {/* Brand Wordmark & Heritage Subtitle */}
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1.5">
          <span className={`text-xl sm:text-2xl font-black tracking-tight font-display ${isLight ? 'text-white' : 'text-zinc-900'}`}>
            QP
          </span>
          <span className="text-xl sm:text-2xl font-black tracking-tight font-display text-sky-400">
            HVAC
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 border border-white/10 ml-1">
            EST.
          </span>
        </div>
        {showSubtitle && (
          <span className={`text-[10px] tracking-[0.18em] uppercase font-semibold -mt-0.5 ${isLight ? 'text-zinc-400' : 'text-zinc-500'}`}>
            Father & Son Craftsmanship
          </span>
        )}
      </div>
    </Link>
  );
}
