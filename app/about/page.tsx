import React from 'react';
import Image from 'next/image';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { storage } from '@/lib/storage';
import { APP_CONFIG } from '@/lib/config';
import { buildMetadata } from '@/lib/seo';
import { HERO_ART, photo } from '@/lib/images';

/**
 * Rendered per request: the page reads live content from the data store, so it
 * must reflect edits made in the admin dashboard without a rebuild.
 */
export const dynamic = 'force-dynamic';


export const metadata = buildMetadata({
  title: 'About Us | Father & Son HVAC Craftsmanship',
  description: 'Learn about QP HVAC. Dedicated to providing our community with honest pricing, reliable service, and professional craftsmanship you can count on.',
  path: '/about',
});

const PROMISES = [
  {
    title: 'Honest diagnostic pricing',
    body: 'You know the exact cost before we touch a tool. Nothing is added afterwards.',
  },
  {
    title: 'Repair first, replace second',
    body: 'We never push an unneeded replacement to hit a sales quota, because we do not have one.',
  },
  {
    title: 'Respect for the house',
    body: 'Shoe covers, drop cloths, and a mechanical room left cleaner than we found it.',
  },
  {
    title: 'Direct accountability',
    body: 'Jayson is one phone call away, before the job, during it and long after.',
  },
];

const CREDENTIALS = [
  {
    title: 'Gas technician certified',
    body: 'Licensed for natural gas and propane heating appliances, including safety venting.',
  },
  {
    title: 'Refrigerant handling',
    body: 'Certified for refrigerant leak detection, recovery and system charging.',
  },
  {
    title: 'Comprehensive liability',
    body: 'Full residential and commercial liability insurance covering your property.',
  },
  {
    title: 'Factory authorised',
    body: 'Trained on warranty maintenance protocols across all major manufacturer platforms.',
  },
];

const BRANDS = [
  'Carrier', 'Trane', 'Lennox', 'Daikin', 'Mitsubishi Electric', 'Rheem',
  'Goodman', 'Keeprite', 'Napoleon', 'York', 'Bosch', 'Fujitsu',
];

export default function AboutPage() {
  const settings = storage.getSettings();
  const art = HERO_ART.about;

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        <PageHero
          eyebrow="Our story"
          title="Two generations, one standard."
          lead="A father and a son, a stocked van, and a family name we are not willing to put behind careless work."
          imageSrc={art.src}
          imageAlt={art.alt}
          imagePosition={art.position}
          align={art.align}
        />

        {/* Philosophy — a reading column, set wide and quiet. */}
        <Section tone="canvas">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 gap-x-16">
              <div className="lg:col-span-4">
                <Reveal as="span" className="block" repeat>
                  <Eyebrow>Every call is personal</Eyebrow>
                </Reveal>
              </div>

              <div className="lg:col-span-8">
                <Reveal as="p" delay={90} repeat className="type-display-sm text-ink max-w-[36rem]">
                  {settings.aboutStory}
                </Reveal>

                <div className="mt-12 space-y-6 max-w-[36rem]">
                  <Reveal as="p" delay={180} repeat className="type-body text-ink-2">
                    {settings.fatherSonPhilosophy}
                  </Reveal>
                  <p className="type-body text-ink-2">
                    Whether that means diagnosing an intermittent flame failure during a blizzard, tuning a
                    central air conditioner before summer, or calculating the heat loss of a two-storey home
                    for a cold-climate heat pump, we take the time to do it properly.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Full-width photograph — an image-led break in the rhythm. */}
        <div className="relative h-[clamp(20rem,52vh,34rem)] bg-obsidian">
          <Image
            src={photo('twoTechnicians', 2200)}
            alt="QP HVAC father and son team working on a residential system"
            fill
            referrerPolicy="no-referrer"
            sizes="100vw"
            className="object-cover saturate-[0.85]"
            style={{ objectPosition: '50% 35%' }}
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-transparent to-transparent" />
          <Container className="absolute inset-x-0 bottom-0 pb-10">
            <p className="type-label text-white/60">Jayson and family · Licensed and insured</p>
          </Container>
        </div>

        {/* Four promises */}
        <Section tone="canvas">
          <Container>
            <SectionHeading eyebrow="Four promises" title="What you can hold us to" />

            <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-16 mt-16 border-t border-line">
              {PROMISES.map((promise, index) => (
                <Reveal as="li" key={promise.title} delay={index * 90} repeat>
                  <div className="py-9 border-b border-line h-full">
                    <span className="type-label text-ink-3">{String(index + 1).padStart(2, '0')}</span>
                    <h3 className="type-h3 text-ink mt-4">{promise.title}</h3>
                    <p className="type-body text-ink-2 mt-3 max-w-[30rem]">{promise.body}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </Container>
        </Section>

        {/* Credentials — a table, not four cards. */}
        <Section tone="sunk" divide>
          <Container>
            <SectionHeading
              eyebrow="Licences & certification"
              title="Compliance you can verify"
              lead="Safety standards, gas licensing and insurance are not selling points. They are the baseline."
            />

            <dl className="mt-16 border-t border-line-strong">
              {CREDENTIALS.map((item) => (
                <div
                  key={item.title}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-x-8 gap-y-2 py-7 border-b border-line"
                >
                  <dt className="sm:col-span-4 type-h4 text-ink">{item.title}</dt>
                  <dd className="sm:col-span-8 type-body text-ink-2">{item.body}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </Section>

        {/* Brands */}
        <Section tone="canvas" space="tight">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 gap-x-16">
              <div className="lg:col-span-4">
                <Eyebrow>Equipment we service</Eyebrow>
              </div>
              <ul className="lg:col-span-8 flex flex-wrap gap-x-8 gap-y-3">
                {BRANDS.map((brand) => (
                  <li key={brand} className="type-h4 text-ink-2">
                    {brand}
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </Section>

        {/* Closing */}
        <Section tone="obsidian" space="tight">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 gap-x-16 items-end">
              <div className="lg:col-span-7">
                <h2 className="type-h2 text-white">Experience honest craftsmanship.</h2>
                <p className="type-body text-white/60 mt-5 max-w-[32rem]">
                  Book a seasonal tune-up, a diagnostic visit or a new system quote — or speak with Jayson
                  directly.
                </p>
              </div>

              <div className="lg:col-span-5 lg:justify-self-end flex flex-col sm:flex-row gap-3">
                <Button href="/booking" variant="inverse" size="lg">
                  Book an appointment
                </Button>
                <Button href={`tel:${APP_CONFIG.phone}`} variant="outline-inverse" size="lg">
                  Call {APP_CONFIG.phoneDisplay}
                </Button>
              </div>
            </div>
          </Container>
        </Section>
      </main>

      <SiteFooter />
    </div>
  );
}
