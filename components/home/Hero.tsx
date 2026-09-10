import React from 'react';
import { PageHero } from '@/components/ui/PageHero';
import { Button } from '@/components/ui/Button';
import { APP_CONFIG } from '@/lib/config';
import { HERO_ART } from '@/lib/images';

export function Hero() {
  const art = HERO_ART.home;

  return (
    <PageHero
      size="lg"
      eyebrow="Father & son · Licensed gas and refrigeration"
      imageSrc={art.src}
      imageAlt={art.alt}
      imagePosition={art.position}
      align={art.align}
      scrim={art.scrim}
      title={
        <>
          Family values,
          <br />
          <span className="type-italic-serif text-white/80">professional comfort.</span>
        </>
      }
      lead="Father and son keeping your home's heating and cooling running at its best — with honest pricing, upfront quotes and craftsmanship we put our own name behind."
      actions={
        <>
          <Button href="/booking" id="hero-book-appointment-btn" variant="inverse" size="lg">
            Book a service appointment
          </Button>
          <Button href={`tel:${APP_CONFIG.phone}`} id="hero-call-jayson-btn" variant="outline-inverse" size="lg">
            Call Jayson · {APP_CONFIG.phoneDisplay}
          </Button>
        </>
      }
      meta={[
        { label: 'Diagnostics', value: 'Binding upfront quotes', note: 'No surprise fees' },
        { label: 'Approach', value: 'Repair before replace', note: 'No sales commissions' },
        { label: 'Emergency', value: '24 hours, 7 days', note: 'Stocked service van' },
        { label: 'Dispatch', value: 'Family only', note: 'No subcontractors' },
      ]}
    />
  );
}
