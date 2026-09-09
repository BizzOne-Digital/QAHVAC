import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  showSubtitle?: boolean;
}

/**
 * Two converging thermal curves — heating and cooling meeting at a single point.
 * Monochrome, so the mark inherits the surface it sits on rather than
 * introducing another colour to the page.
 */
export function BrandLogo({ className = '', variant = 'dark', showSubtitle = true }: BrandLogoProps) {
  const isLight = variant === 'light';

  return (
    <Link
      href="/"
      id="qp-hvac-brand-logo"
      aria-label="QP HVAC — home"
      className={`inline-flex items-center gap-3 select-none group ${className}`}
    >
      <svg
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden
        className={`w-8 h-8 flex-shrink-0 ${isLight ? 'text-white' : 'text-ink'}`}
      >
        <path
          d="M20 4C12.5 10 8.5 16 8.5 23c0 6.6 5.1 11.5 11.5 11.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
        />
        <path
          d="M20 4c7.5 6 11.5 12 11.5 19 0 6.6-5.1 11.5-11.5 11.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
          opacity="0.42"
        />
        <circle cx="20" cy="22" r="2.75" fill="currentColor" />
      </svg>

      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-[1.4rem] tracking-[-0.02em] ${isLight ? 'text-white' : 'text-ink'}`}
        >
          QP HVAC
        </span>
        {showSubtitle && (
          <span
            className={`text-[0.625rem] font-semibold uppercase tracking-[0.18em] mt-1.5 ${
              isLight ? 'text-white/45' : 'text-ink-3'
            }`}
          >
            Heating &amp; Cooling
          </span>
        )}
      </span>
    </Link>
  );
}
