import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { storage } from '@/lib/storage';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { BookingWizard } from '@/components/booking/BookingWizard';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { APP_CONFIG } from '@/lib/config';
import { Metadata } from 'next';
import {
  buildMetadata,
  generateBreadcrumbSchema,
  generateServiceSchema,
  jsonLdScript,
} from '@/lib/seo';

/**
 * Rendered per request: the page reads live content from the data store, so it
 * must reflect edits made in the admin dashboard without a rebuild.
 */
export const dynamic = 'force-dynamic';


export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const service = await storage.getServiceBySlug(slug);

  if (!service) {
    return buildMetadata({ title: 'Service Details', noIndex: true });
  }

  return buildMetadata({
    title: service.title,
    description: service.shortDesc,
    path: `/services/${service.slug}`,
    image: service.image || undefined,
    type: 'article',
    keywords: [service.title, service.category, ...service.features.slice(0, 4)],
  });
}

const CATEGORY_LABEL: Record<string, string> = {
  heating: 'Heating',
  cooling: 'Cooling',
  'heat-pumps': 'Heat pumps',
  emergency: 'Emergency',
  maintenance: 'Maintenance',
  commercial: 'Commercial',
};

export default async function ServiceDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const service = await storage.getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const settings = await storage.getSettings();

  // Service (with its offer) and the trail that reached it.
  const schemas = [
    generateServiceSchema(service, settings),
    generateBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
      { name: service.title, path: `/services/${service.slug}` },
    ]),
  ];

  const eyebrow = service.emergencyAvailable
    ? `${CATEGORY_LABEL[service.category] ?? 'Service'} · 24/7 dispatch`
    : CATEGORY_LABEL[service.category] ?? 'Service';

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col">
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(schema)}
        />
      ))}

      <SiteHeader />

      <main className="flex-1">
        {/* The service's own photograph carries its hero. */}
        <PageHero
          eyebrow={eyebrow}
          title={service.title}
          lead={service.shortDesc}
          imageSrc={service.image}
          imageAlt={service.title}
          imagePosition="60% 50%"
          actions={
            <>
              <Button href={`/booking?service=${encodeURIComponent(service.title)}`} variant="inverse" size="lg">
                Book this service
              </Button>
              <Button href={`tel:${APP_CONFIG.phone}`} variant="outline-inverse" size="lg">
                Call {APP_CONFIG.phoneDisplay}
              </Button>
            </>
          }
          meta={[
            { label: 'Price guide', value: service.priceEstimate, note: 'Exact quote before work begins' },
            { label: 'Typical duration', value: service.durationEstimate, note: '30-minute arrival call-ahead' },
          ]}
        />

        <Section tone="canvas">
          <Container>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 type-meta text-ink-3 hover:text-ink transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
              All services
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-16 gap-x-16 items-start mt-12">
              {/* Detail */}
              <div className="lg:col-span-7">
                <p className="type-lead text-ink max-w-[36rem]">{service.fullDesc}</p>

                <div className="mt-14">
                  <h2 className="type-label text-ink-3">What the visit includes</h2>
                  <ul className="mt-6 border-t border-line">
                    {service.features.map((feature) => (
                      <li key={feature} className="type-body text-ink py-4 border-b border-line">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="type-small text-ink-2 mt-12 border-l-2 border-line-strong pl-5 max-w-[34rem]">
                  <span className="font-semibold text-ink">Our workmanship guarantee.</span> Parts and
                  replacement units carry full manufacturer warranty protection alongside our own guarantee on
                  the work. If something is not running right, Jayson returns and makes it right.
                </p>
              </div>

              {/* Booking */}
              <div className="lg:col-span-5 lg:sticky lg:top-32">
                <div className="border-t-2 border-ink pt-8">
                  <h2 className="type-h3 text-ink">Schedule this service</h2>
                  <p className="type-small text-ink-2 mt-2">
                    Booked directly with Jayson, who confirms your arrival window by phone.
                  </p>
                </div>

                <div className="mt-8">
                  <BookingWizard initialService={service.title} frameless />
                </div>

                <p className="type-small text-ink-2 mt-8">
                  Prefer to talk it through?{' '}
                  <a
                    href={`tel:${APP_CONFIG.phone}`}
                    className="font-semibold text-ink underline underline-offset-[3px] decoration-line-strong hover:decoration-ink"
                  >
                    Call {APP_CONFIG.phoneDisplay}
                  </a>
                </p>
              </div>
            </div>
          </Container>
        </Section>
      </main>

      <SiteFooter />
    </div>
  );
}
