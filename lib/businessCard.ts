import { BusinessCard } from '@/types';
import { isPublicImageUrl } from '@/lib/uploads/validation';

/** Used whenever the stored card is missing a heading of its own. */
export const BUSINESS_CARD_FALLBACK_HEADING = 'Keep our card';

const MAX_HEADING = 120;
const MAX_CAPTION = 280;
const MAX_ALT = 180;

export const EMPTY_BUSINESS_CARD: BusinessCard = {
  enabled: false,
  imageUrl: '',
  heading: BUSINESS_CARD_FALLBACK_HEADING,
  caption: '',
  alt: '',
};

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

/**
 * Coerces an untrusted body into a storable business card.
 *
 * Callers pass the current card as `current` so a partial update — the enable
 * toggle on its own, say — keeps the fields it did not mention. An image URL
 * that fails validation is dropped rather than stored, and the card is forced
 * off when no image survives, because an enabled card with no art would render
 * an empty frame on the home page.
 */
export function normalizeBusinessCard(input: unknown, current?: BusinessCard | null): BusinessCard {
  const base = current ?? EMPTY_BUSINESS_CARD;

  if (!input || typeof input !== 'object') return base;
  const patch = input as Record<string, unknown>;

  const imageUrl =
    'imageUrl' in patch
      ? isPublicImageUrl(patch.imageUrl)
        ? patch.imageUrl.trim()
        : ''
      : base.imageUrl;

  const card: BusinessCard = {
    enabled: 'enabled' in patch ? patch.enabled === true : base.enabled,
    imageUrl,
    heading: 'heading' in patch ? text(patch.heading, MAX_HEADING) : base.heading,
    caption: 'caption' in patch ? text(patch.caption, MAX_CAPTION) : base.caption,
    alt: 'alt' in patch ? text(patch.alt, MAX_ALT) : base.alt,
  };

  if (!card.imageUrl) card.enabled = false;

  return card;
}

/** Whether the home page should render the card section at all. */
export function isBusinessCardVisible(card?: BusinessCard | null): card is BusinessCard {
  return Boolean(card?.enabled && card.imageUrl);
}
