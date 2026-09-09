import React from 'react';

type Tone = 'canvas' | 'sunk' | 'surface' | 'obsidian';
type Space = 'default' | 'tight' | 'loose';

interface SectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  tone?: Tone;
  space?: Space;
  /** Hairline top rule. Sections are separated by rules, never by shadows. */
  divide?: boolean;
}

const TONES: Record<Tone, string> = {
  canvas: 'bg-canvas text-ink',
  sunk: 'bg-canvas-sunk text-ink',
  surface: 'bg-surface text-ink',
  obsidian: 'bg-obsidian text-white',
};

const SPACE: Record<Space, string> = {
  tight: 'py-14 sm:py-16 lg:py-20',
  default: 'py-20 sm:py-24 lg:py-32',
  loose: 'py-24 sm:py-32 lg:py-40',
};

export function Section({
  children,
  id,
  className = '',
  tone = 'canvas',
  space = 'default',
  divide = false,
}: SectionProps) {
  const rule = divide ? (tone === 'obsidian' ? 'border-t border-obsidian-line' : 'border-t border-line') : '';

  return (
    <section id={id} className={`${TONES[tone]} ${SPACE[space]} ${rule} ${className}`}>
      {children}
    </section>
  );
}
