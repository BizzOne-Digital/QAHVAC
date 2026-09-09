import React from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';

const REVIEWS = [
  {
    name: 'Marcus Vance',
    role: 'Homeowner, Heritage District',
    system: 'Furnace emergency repair',
    comment:
      'Our furnace died on a Friday night at minus fifteen. Jayson answered right away, was at our door within the hour, diagnosed a failed draft inducer, had the part in his van, and our heat was back on before midnight.',
  },
  {
    name: 'Elena Rostova',
    role: 'Commercial café owner',
    system: 'Commercial RTU & cooling',
    comment:
      'Our rooftop unit started leaking into the dining room during a July lunch rush. Father and son arrived quietly, cleared the condensate trap and checked every refrigerant pressure without disturbing a single guest.',
  },
  {
    name: 'David Chen',
    role: 'Homeowner',
    system: 'Heat pump conversion',
    comment:
      'They replaced an ancient oil furnace with a cold-climate heat pump and walked us through the rebate paperwork, which saved us thousands. The sheet metal and wiring work is genuinely immaculate.',
  },
];

export function Testimonials() {
  return (
    <Section id="community-reviews" tone="sunk" divide>
      <Container>
        <SectionHeading
          eyebrow="Verified feedback"
          title="What our neighbours say"
          lead="Every review here represents a home kept warm, a business kept open, and a customer treated the way we would want our own family treated."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-12 mt-16 lg:mt-20">
          {REVIEWS.map((review, index) => (
            <Reveal as="article" key={review.name} delay={index * 100}>
              <figure className="flex flex-col h-full border-t border-line-strong pt-8">
                <blockquote className="type-lead text-ink flex-1">
                  <span className="type-italic-serif">“</span>
                  {review.comment}
                  <span className="type-italic-serif">”</span>
                </blockquote>

                <figcaption className="mt-8">
                  <p className="type-h4 text-ink">{review.name}</p>
                  <p className="type-meta text-ink-3 mt-1">{review.role}</p>
                  <p className="type-label text-ink-3 mt-4">{review.system}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
