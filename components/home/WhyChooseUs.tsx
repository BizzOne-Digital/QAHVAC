import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { photo } from '@/lib/images';

const PRINCIPLES = [
  {
    title: 'Honest upfront pricing',
    body: 'Flat diagnostic pricing agreed before we begin. No trip surcharges, no line items that appear after the work is done.',
  },
  {
    title: 'Repair before replace',
    body: 'If a furnace or air conditioner can be repaired safely and reliably, we repair it. Replacement is recommended only when the numbers say so.',
  },
  {
    title: 'Emergency readiness',
    body: 'Severe freezes and heatwaves do not keep office hours. Our van is stocked for same-day recovery, seven days a week.',
  },
  {
    title: 'Workmanship guarantee',
    body: 'Our family name sits on every install, pipe connection and wire crimp. If something is not running right, Jayson returns and makes it right.',
  },
];

export function WhyChooseUs() {
  return (
    <Section id="why-choose-qp-hvac" tone="canvas" divide>
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-14 gap-x-16 items-start">
          {/* Statement */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <Eyebrow>The difference</Eyebrow>
            <h2 className="type-h2 text-ink mt-5">
              Why homeowners choose a family over a franchise
            </h2>
            <p className="type-body text-ink-2 mt-6 max-w-[30rem]">
              When you call QP HVAC you speak with Jayson. Not a call centre, not a dispatcher, and not a
              commissioned salesperson working from a script.
            </p>

            <div className="relative aspect-[5/6] mt-10 overflow-hidden bg-canvas-sunk">
              <Image
                src={photo('craftsmanAtWork', 1200)}
                alt="QP HVAC craftsman servicing climate equipment"
                fill
                unoptimized
                referrerPolicy="no-referrer"
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover saturate-[0.88]"
              />
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 mt-8 text-sm font-semibold text-ink hover:text-accent transition-colors"
            >
              Read the father and son story
              <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
            </Link>
          </div>

          {/* Numbered principles — a list, not a card grid. */}
          <div className="lg:col-span-7">
            <ol className="border-t border-line">
              {PRINCIPLES.map((item, index) => (
                <Reveal as="li" key={item.title} delay={index * 90} repeat>
                  <div className="grid grid-cols-[3rem_1fr] sm:grid-cols-[5rem_1fr] gap-x-4 py-9 border-b border-line">
                    <span className="type-label text-ink-3 pt-1.5">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="type-h3 text-ink">{item.title}</h3>
                      <p className="type-body text-ink-2 mt-3 max-w-[34rem]">{item.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </Section>
  );
}
