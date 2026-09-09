import React from 'react';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';

export interface HeroMetaItem {
  label: string;
  value: string;
  /** Optional third line for context. Keep it to a handful of words. */
  note?: string;
}

interface PageHeroProps {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  actions?: React.ReactNode;
  /** Photography sits under the composition, never inside a card. */
  imageSrc: string;
  imageAlt: string;
  /** Match this to the photograph's focal point so the text never sits on the subject. */
  imagePosition?: string;
  /** Text column side. Choose the side opposite the focal point. */
  align?: 'left' | 'right';
  /** `lg` for the homepage statement, `md` for interior pages. */
  size?: 'md' | 'lg';
  meta?: HeroMetaItem[];
  children?: React.ReactNode;
}

/* The header overlays the hero, so each size carries its 4.75rem of clearance. */
const SIZES = {
  md: 'min-h-[clamp(27rem,52vh,35rem)] pt-[8.5rem] pb-16 sm:pt-[10rem] sm:pb-20',
  lg: 'min-h-[clamp(36rem,80vh,48rem)] pt-[10.5rem] pb-20 sm:pt-[13rem] sm:pb-24',
} as const;

export function PageHero({
  eyebrow,
  title,
  lead,
  actions,
  imageSrc,
  imageAlt,
  imagePosition = 'center',
  align = 'left',
  size = 'md',
  meta,
  children,
}: PageHeroProps) {
  const isRight = align === 'right';

  return (
    <section
      className={`relative isolate -mt-[4.75rem] flex flex-col justify-end bg-obsidian text-white ${SIZES[size]}`}
    >
      {/* Photography */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          referrerPolicy="no-referrer"
          sizes="100vw"
          className="object-cover saturate-[0.82] contrast-[1.04]"
          style={{ objectPosition: imagePosition }}
        />

        {/* Readability scrim: anchored to the text column, transparent over the subject. */}
        <div
          aria-hidden
          className={`absolute inset-0 ${
            isRight
              ? 'bg-gradient-to-l from-obsidian via-obsidian/88 to-obsidian/25'
              : 'bg-gradient-to-r from-obsidian via-obsidian/88 to-obsidian/25'
          }`}
        />
        {/* Vertical settling, so the header and the section rule below both hold. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-obsidian/75 via-transparent to-obsidian/80"
        />
      </div>

      <Container className="relative">
        <div className={`grid grid-cols-1 lg:grid-cols-12 ${isRight ? 'lg:justify-items-end' : ''}`}>
          <div
            className={`lg:col-span-7 ${isRight ? 'lg:col-start-6 xl:col-start-7' : ''} ${
              size === 'lg' ? 'max-w-[46rem]' : 'max-w-[40rem]'
            }`}
          >
            {eyebrow && <Eyebrow tone="inverse">{eyebrow}</Eyebrow>}

            <h1 className={`${size === 'lg' ? 'type-display' : 'type-display-sm'} text-white ${eyebrow ? 'mt-6' : ''}`}>
              {title}
            </h1>

            {lead && <p className="type-lead text-white/70 mt-6 max-w-[36rem]">{lead}</p>}

            {actions && <div className="mt-9 flex flex-col sm:flex-row sm:items-center gap-3">{actions}</div>}

            {children}
          </div>
        </div>
      </Container>

      {/* Hero footer facts, on a hairline rather than in badges. */}
      {meta && meta.length > 0 && (
        <Container className="relative mt-14 sm:mt-20">
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8 border-t border-white/15 pt-8">
            {meta.map((item) => (
              <div key={item.label}>
                <dt className="type-label text-white/45">{item.label}</dt>
                <dd className="type-h4 text-white mt-2.5">{item.value}</dd>
                {item.note && <p className="type-meta text-white/45 mt-1">{item.note}</p>}
              </div>
            ))}
          </dl>
        </Container>
      )}
    </section>
  );
}
