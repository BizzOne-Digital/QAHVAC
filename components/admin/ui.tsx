import React from 'react';

/**
 * Admin surface primitives.
 *
 * These carry the same vocabulary as the public site — warm canvas, hairline
 * rules, serif headings, near-sharp corners — so the dispatch portal reads as
 * part of the same product rather than a separate dashboard skin.
 */

export function AdminPageHeading({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between border-b border-line pb-7">
      <div className="max-w-[42rem]">
        <span className="type-label text-ink-3">{eyebrow}</span>
        <h1 className="type-h2 text-ink mt-3">{title}</h1>
        {description && <p className="type-small text-ink-2 mt-3">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  );
}

export function Panel({
  children,
  className = '',
  padded = true,
}: {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div className={`bg-surface border border-line ${padded ? 'p-5 sm:p-6' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function PanelHeading({ children, note }: { children: React.ReactNode; note?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 pb-4 mb-5 border-b border-line">
      <h2 className="type-h3 text-ink">{children}</h2>
      {note && <span className="type-meta text-ink-3">{note}</span>}
    </div>
  );
}

/** A single figure. Serif numerals, as on the public site's statistics. */
export function StatPanel({
  label,
  value,
  note,
  urgent = false,
}: {
  label: string;
  value: React.ReactNode;
  note?: string;
  urgent?: boolean;
}) {
  return (
    <div className="bg-surface border border-line p-5">
      <span className="type-label text-ink-3">{label}</span>
      <p className={`type-stat mt-3 ${urgent ? 'text-urgent' : 'text-ink'}`}>{value}</p>
      {note && <p className="type-meta text-ink-3 mt-2">{note}</p>}
    </div>
  );
}

type PillTone = 'neutral' | 'active' | 'muted' | 'urgent';

const PILL_TONES: Record<PillTone, string> = {
  neutral: 'border-line-strong text-ink-2',
  active: 'border-ink text-ink',
  muted: 'border-line text-ink-3',
  urgent: 'border-urgent text-urgent',
};

/** Status is carried by a hairline outline and a word, never by a colour block. */
export function StatusPill({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode;
  tone?: PillTone;
}) {
  return (
    <span className={`inline-block type-label border px-2 py-1 ${PILL_TONES[tone]}`}>{children}</span>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-line px-6 py-16 text-center">
      <p className="type-small text-ink-3">{children}</p>
    </div>
  );
}

export function LoadingState({ children = 'Loading…' }: { children?: React.ReactNode }) {
  return (
    <div className="bg-surface border border-line px-6 py-16 text-center">
      <p className="type-small text-ink-3">{children}</p>
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
  className = '',
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="field-label">{label}</label>
      {children}
      {hint && <p className="type-meta text-ink-3 mt-1.5">{hint}</p>}
    </div>
  );
}
