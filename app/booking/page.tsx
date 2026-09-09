import React, { Suspense } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BookingWizard } from '@/components/booking/BookingWizard';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { APP_CONFIG } from '@/lib/config';
import { buildMetadata } from '@/lib/seo';
import { HERO_ART } from '@/lib/images';

export const metadata = buildMetadata({
  title: 'Book an Appointment | Father & Son HVAC Scheduling',
  description: 'Book your heating, air conditioning, heat pump, or emergency service appointment online with QP HVAC. Direct scheduling with Jayson.',
  path: '/booking',
});

function BookingContent() {
  const art = HERO_ART.booking;

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col">
      <Navbar />

      <main className="flex-1">
        <PageHero
          eyebrow="Scheduling"
          title="Reserve your service call."
          lead="Pick a date and an arrival window. Jayson reviews every request personally and calls to confirm."
          imageSrc={art.src}
          imageAlt={art.alt}
          imagePosition={art.position}
          align={art.align}
          meta={[
            { label: 'Arrival', value: '30-minute call-ahead' },
            { label: 'Diagnostics', value: 'Flat-rate guarantee' },
            { label: 'Parts', value: 'Stocked for same-day' },
            { label: 'Confirmation', value: 'Direct from Jayson' },
          ]}
        />

        <Section tone="canvas">
          <Container>
            <BookingWizard />
          </Container>
        </Section>

        {/* Emergency fallback */}
        <Section tone="sunk" space="tight" divide>
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 gap-x-16 items-end">
              <div className="lg:col-span-7">
                <Eyebrow tone="urgent" rule={false}>
                  Complete climate failure
                </Eyebrow>
                <h2 className="type-h2 text-ink mt-5">Need someone today?</h2>
                <p className="type-body text-ink-2 mt-5 max-w-[32rem]">
                  Do not wait on a form. Call the direct mobile dispatch line and we will get a van moving.
                </p>
              </div>

              <div className="lg:col-span-5 lg:justify-self-end">
                <Button href={`tel:${APP_CONFIG.phone}`} variant="urgent" size="lg">
                  Call {APP_CONFIG.phoneDisplay}
                </Button>
              </div>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-canvas flex items-center justify-center">
          <p className="type-label text-ink-3">Loading scheduler</p>
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
