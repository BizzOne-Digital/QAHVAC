import React from 'react';
import { Phone } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { SafeImage } from '@/components/ui/SafeImage';
import { BUSINESS_CARD_FALLBACK_HEADING, isBusinessCardVisible } from '@/lib/businessCard';
import { BusinessCard } from '@/types';

interface BusinessCardSectionProps {
  card?: BusinessCard | null;
  /** Used for the alt text and the call link when the card sets neither. */
  businessName: string;
  phone: string;
  phoneDisplay: string;
}

/**
 * The scanned business card, uploaded from the admin dashboard.
 *
 * Renders nothing at all unless the card is switched on and has art, so the
 * home page is unchanged for a site that has never uploaded one.
 *
 * Nothing here assumes a card shape. An admin may upload a flat 3.5x2 scan or
 * a photograph of a card with margins around it, so `aspectRatio: auto` lets
 * the artwork's own proportions drive the frame once it loads; the width and
 * height props remain only as the pre-load hint Next requires. Cropping is
 * never an option — it would cut off the phone number, which is the point of
 * showing the card at all.
 */
export function BusinessCardSection({
  card,
  businessName,
  phone,
  phoneDisplay,
}: BusinessCardSectionProps) {
  if (!isBusinessCardVisible(card)) return null;

  const heading = card.heading?.trim() || BUSINESS_CARD_FALLBACK_HEADING;
  const alt = card.alt?.trim() || `Business card for ${businessName}`;

  return (
    <Section id="business-card-section" tone="sunk" divide space="tight">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 gap-x-16 items-center">
          <div className="lg:col-span-5">
            <Reveal repeat>
              <Eyebrow>Our details</Eyebrow>
              <h2 className="type-h2 text-ink mt-5">{heading}</h2>

              {card.caption?.trim() && (
                <p className="type-body text-ink-2 mt-5 max-w-[30rem]">{card.caption.trim()}</p>
              )}

              <a
                href={`tel:${phone}`}
                className="inline-flex items-center gap-2.5 mt-8 text-sm font-semibold text-ink hover:text-accent transition-colors"
              >
                <Phone className="w-4 h-4" strokeWidth={1.75} />
                Call {phoneDisplay}
              </a>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={90} repeat>
              <div className="border border-line bg-canvas p-4 sm:p-6">
                <SafeImage
                  src={card.imageUrl}
                  alt={alt}
                  width={1050}
                  height={600}
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="w-full h-auto"
                  style={{ aspectRatio: 'auto' }}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
