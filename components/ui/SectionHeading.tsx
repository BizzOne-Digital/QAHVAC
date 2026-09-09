import React from 'react';
import { Eyebrow } from '@/components/ui/Eyebrow';

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  /** Right-hand slot for a single tertiary link. */
  aside?: React.ReactNode;
  align?: 'left' | 'center';
  inverse?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  aside,
  align = 'left',
  inverse = false,
  className = '',
}: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <div
      className={`flex flex-col ${
        aside ? 'lg:flex-row lg:items-end lg:justify-between gap-8' : ''
      } ${centered ? 'text-center items-center' : ''} ${className}`}
    >
      <div className={centered ? 'max-w-[42rem]' : 'max-w-[38rem]'}>
        {eyebrow && (
          <Eyebrow tone={inverse ? 'inverse' : 'muted'} rule={!centered}>
            {eyebrow}
          </Eyebrow>
        )}
        <h2 className={`type-h2 ${inverse ? 'text-white' : 'text-ink'} ${eyebrow ? 'mt-5' : ''}`}>{title}</h2>
        {lead && (
          <p className={`type-body ${inverse ? 'text-white/60' : 'text-ink-2'} mt-4 max-w-[34rem] ${centered ? 'mx-auto' : ''}`}>
            {lead}
          </p>
        )}
      </div>

      {aside && <div className="flex-shrink-0">{aside}</div>}
    </div>
  );
}
