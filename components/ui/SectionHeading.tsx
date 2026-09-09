import React from 'react';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';

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
        {/* Eyebrow, headline and lead fade up in sequence, and fade back out
            once the section leaves the viewport. */}
        {eyebrow && (
          <Reveal as="span" className="block" repeat>
            <Eyebrow tone={inverse ? 'inverse' : 'muted'} rule={!centered}>
              {eyebrow}
            </Eyebrow>
          </Reveal>
        )}

        <Reveal
          as="h2"
          delay={90}
          repeat
          className={`type-h2 ${inverse ? 'text-white' : 'text-ink'} ${eyebrow ? 'mt-5' : ''}`}
        >
          {title}
        </Reveal>

        {lead && (
          <Reveal
            as="p"
            delay={180}
            repeat
            className={`type-body ${inverse ? 'text-white/60' : 'text-ink-2'} mt-4 max-w-[34rem] ${centered ? 'mx-auto' : ''}`}
          >
            {lead}
          </Reveal>
        )}
      </div>

      {aside && <div className="flex-shrink-0">{aside}</div>}
    </div>
  );
}
