import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ServicesCatalog } from '@/components/services/ServicesCatalog';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { storage } from '@/lib/storage';
import { buildMetadata } from '@/lib/seo';
import { HERO_ART } from '@/lib/images';
import { APP_CONFIG } from '@/lib/config';

export const metadata = buildMetadata({
  title: 'Heating, Cooling & Heat Pump Services | QP HVAC',
  description: 'Comprehensive HVAC solutions for residential homeowners and commercial facilities. Upfront pricing, factory diagnostics, and precision craftsmanship.',
  path: '/services',
});

export default function ServicesPage() {
  const allServices = storage.getServices(true);
  const art = HERO_ART.services;

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col">
      <Navbar />

      <main className="flex-1">
        <PageHero
          eyebrow="Services"
          title="Heating, cooling and everything between."
          lead="Every home and building is different. We diagnose honestly, quote upfront, and do the work to a standard we would accept in our own homes."
          imageSrc={art.src}
          imageAlt={art.alt}
          imagePosition={art.position}
          align={art.align}
          actions={
            <>
              <Button href="/booking" variant="inverse" size="lg">
                Book an appointment
              </Button>
              <Button href={`tel:${APP_CONFIG.phone}`} variant="outline-inverse" size="lg">
                Call {APP_CONFIG.phoneDisplay}
              </Button>
            </>
          }
        />

        <Section tone="canvas">
          <Container>
            <ServicesCatalog initialServices={allServices} />
          </Container>
        </Section>

        {/* Custom evaluation */}
        <Section tone="sunk" space="tight" divide>
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 gap-x-16 items-end">
              <div className="lg:col-span-7">
                <Eyebrow>Not sure which you need?</Eyebrow>
                <h2 className="type-h2 text-ink mt-5">
                  Repair, or upgrade? We will tell you straight.
                </h2>
                <p className="type-body text-ink-2 mt-5 max-w-[34rem]">
                  If a system has years left in it, we say so. If replacement genuinely pays for itself, we
                  show you the arithmetic and the rebates you qualify for.
                </p>
              </div>

              <div className="lg:col-span-5 lg:justify-self-end flex flex-col sm:flex-row gap-3">
                <Button href="/booking" variant="primary" size="lg">
                  Book an evaluation
                </Button>
                <Button href={`tel:${APP_CONFIG.phone}`} variant="secondary" size="lg">
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
