import React from 'react';
import { Hero } from '@/components/home/Hero';
import { DiagnosticTriage } from '@/components/home/DiagnosticTriage';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { Testimonials } from '@/components/home/Testimonials';
import { ServiceCard } from '@/components/services/ServiceCard';
import { BookingWizard } from '@/components/booking/BookingWizard';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { EmergencyBanner } from '@/components/layout/EmergencyBanner';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { storage } from '@/lib/storage';
import { APP_CONFIG } from '@/lib/config';
import { generateHvacBusinessSchema } from '@/lib/seo';

export default function HomePage() {
  const services = storage.getServices(true);
  const settings = storage.getSettings();
  const jsonLd = generateHvacBusinessSchema();

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {settings.emergencyBanner.enabled && (
        <EmergencyBanner headline={settings.emergencyBanner.headline} />
      )}

      <Navbar />

      <main className="flex-1">
        <Hero />

        {/* Statement — the promise in the owner's own words, set as editorial copy. */}
        <Section tone="canvas" space="default">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 gap-x-16">
              <div className="lg:col-span-4">
                <Eyebrow>Our promise</Eyebrow>
              </div>

              <div className="lg:col-span-8">
                <p className="type-display-sm text-ink max-w-[36rem]">{settings.aboutStory}</p>

                <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-10 mt-16 pt-10 border-t border-line">
                  <div>
                    <dd className="type-stat text-ink">{settings.stats.yearsExperience}</dd>
                    <dt className="type-meta text-ink-3 mt-3">Years in the trade</dt>
                  </div>
                  <div>
                    <dd className="type-stat text-ink">{settings.stats.familiesServed}</dd>
                    <dt className="type-meta text-ink-3 mt-3">Families served</dt>
                  </div>
                  <div>
                    <dd className="type-stat text-ink">{settings.stats.responseRate}</dd>
                    <dt className="type-meta text-ink-3 mt-3">Typical response</dt>
                  </div>
                  <div>
                    <dd className="type-stat text-ink">{settings.stats.satisfactionRate}</dd>
                    <dt className="type-meta text-ink-3 mt-3">Work stood behind</dt>
                  </div>
                </dl>
              </div>
            </div>
          </Container>
        </Section>

        {/* Service catalogue preview */}
        <Section id="services-preview-section" tone="canvas" divide>
          <Container>
            <SectionHeading
              eyebrow="Heating, cooling & airflow"
              title="What we do"
              lead="From an emergency furnace call at midnight to a quiet central cooling installation and cold-climate heat pump conversions."
              aside={
                <Button href="/services" id="view-all-services-link" variant="secondary" size="md">
                  View all services
                </Button>
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line mt-16 lg:mt-20">
              {services.map((service, index) => (
                <ServiceCard key={service.id} service={service} priority={index < 3} />
              ))}
            </div>
          </Container>
        </Section>

        <DiagnosticTriage />

        <WhyChooseUs />

        <Testimonials />

        {/* Scheduling */}
        <Section id="fast-booking-section" tone="canvas" divide>
          <Container>
            <SectionHeading
              align="center"
              eyebrow="Online scheduling"
              title="Book your appointment"
              lead="Choose your service and a convenient arrival window. Jayson confirms every dispatch personally."
              className="mx-auto"
            />

            <div className="mt-14 lg:mt-16">
              <BookingWizard />
            </div>
          </Container>
        </Section>

        {/* Closing emergency strip */}
        <Section tone="obsidian" space="tight">
          <Container>
            <Reveal>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 gap-x-16 items-end">
                <div className="lg:col-span-7">
                  <Eyebrow tone="urgent" rule={false}>
                    Immediate assistance
                  </Eyebrow>
                  <h2 className="type-h2 text-white mt-5">
                    A freezing night or a heatwave will not wait until morning.
                  </h2>
                  <p className="type-body text-white/60 mt-5 max-w-[34rem]">
                    If there are young children or elderly family in the house, call us now. Our father and son
                    team is equipped for same-day emergency dispatch.
                  </p>
                </div>

                <div className="lg:col-span-5 lg:justify-self-end">
                  <Button
                    href={`tel:${APP_CONFIG.phone}`}
                    id="emergency-strip-call-btn"
                    variant="urgent"
                    size="lg"
                  >
                    Call Jayson · {APP_CONFIG.phoneDisplay}
                  </Button>
                </div>
              </div>
            </Reveal>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
