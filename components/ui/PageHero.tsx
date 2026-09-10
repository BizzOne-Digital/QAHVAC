import React from 'react';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';

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
  /**
   * Strength of the readability wash over the photograph. `default` suits a
   * bright frame; `soft` lifts it for a dim one that would otherwise crush to
   * a flat black panel. Only the far side of the gradient changes — the text
   * column keeps its full wash either way, so contrast is unaffected.
   */
  scrim?: 'default' | 'soft';
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
  scrim = 'default',
  size = 'md',
  meta,
  children,
}: PageHeroProps) {
  const isRight = align === 'right';
  const isSoft = scrim === 'soft';

  const sideScrim = isSoft
    ? isRight
      ? 'bg-gradient-to-l from-obsidian via-obsidian/80 to-transparent'
      : 'bg-gradient-to-r from-obsidian via-obsidian/80 to-transparent'
    : isRight
      ? 'bg-gradient-to-l from-obsidian via-obsidian/88 to-obsidian/25'
      : 'bg-gradient-to-r from-obsidian via-obsidian/88 to-obsidian/25';

  const edgeScrim = isSoft
    ? 'bg-gradient-to-b from-obsidian/60 via-transparent to-obsidian/65'
    : 'bg-gradient-to-b from-obsidian/75 via-transparent to-obsidian/80';

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
        <div aria-hidden className={`absolute inset-0 ${sideScrim}`} />
        {/* Vertical settling, so the header and the section rule below both hold. */}
        <div aria-hidden className={`absolute inset-0 ${edgeScrim}`} />
      </div>

      <Container className="relative">
        <div className={`grid grid-cols-1 lg:grid-cols-12 ${isRight ? 'lg:justify-items-end' : ''}`}>
          <div
            className={`lg:col-span-7 ${isRight ? 'lg:col-start-6 xl:col-start-7' : ''} ${
              size === 'lg' ? 'max-w-[46rem]' : 'max-w-[40rem]'
            }`}
          >
            {/* The hero copy arrives one line at a time, and fades back out
                on the way past so it re-reads on the return scroll. */}
            {eyebrow && (
              <Reveal as="span" className="block" repeat>
                <Eyebrow tone="inverse">{eyebrow}</Eyebrow>
              </Reveal>
            )}

            <Reveal as="h1" delay={90} repeat
              className={`${size === 'lg' ? 'type-display' : 'type-display-sm'} text-white ${eyebrow ? 'mt-6' : ''}`}
            >
              {title}
            </Reveal>

            {lead && (
              <Reveal as="p" delay={180} repeat className="type-lead text-white/70 mt-6 max-w-[36rem]">
                {lead}
              </Reveal>
            )}

            {actions && (
              <Reveal delay={270} repeat className="mt-9 flex flex-col sm:flex-row sm:items-center gap-3">
                {actions}
              </Reveal>
            )}

            {children}
          </div>
        </div>
      </Container>

      {/* Hero footer facts, on a hairline rather than in badges. */}
      {meta && meta.length > 0 && (
        <Container className="relative mt-14 sm:mt-20">
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8 border-t border-white/15 pt-8">
            {meta.map((item, index) => (
              <Reveal key={item.label} delay={360 + index * 90} repeat>
                <dt className="type-label text-white/45">{item.label}</dt>
                <dd className="type-h4 text-white mt-2.5">{item.value}</dd>
                {item.note && <p className="type-meta text-white/45 mt-1">{item.note}</p>}
              </Reveal>
            ))}
          </dl>
        </Container>
      )}
    </section>
  );
}
