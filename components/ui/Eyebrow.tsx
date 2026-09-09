import React from 'react';

interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
  tone?: 'ink' | 'muted' | 'inverse' | 'urgent';
  /** A hairline rule to the left, in place of a pill or a badge. */
  rule?: boolean;
}

const TONES = {
  ink: 'text-ink',
  muted: 'text-ink-3',
  inverse: 'text-white/55',
  urgent: 'text-urgent',
} as const;

const RULES = {
  ink: 'bg-line-strong',
  muted: 'bg-line-strong',
  inverse: 'bg-white/25',
  urgent: 'bg-urgent/40',
} as const;

export function Eyebrow({ children, className = '', tone = 'muted', rule = true }: EyebrowProps) {
  return (
    <span className={`type-label inline-flex items-center gap-3 ${TONES[tone]} ${className}`}>
      {rule && <span aria-hidden className={`h-px w-7 ${RULES[tone]}`} />}
      {children}
    </span>
  );
}
