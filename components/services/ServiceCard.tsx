import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { ServiceItem } from '@/types';

interface ServiceCardProps {
  service: ServiceItem;
  /** Index is used only for the image `sizes` hint on above-the-fold cards. */
  priority?: boolean;
}

const CATEGORY_LABEL: Record<ServiceItem['category'], string> = {
  heating: 'Heating',
  cooling: 'Cooling',
  'heat-pumps': 'Heat pumps',
  emergency: 'Emergency',
  maintenance: 'Maintenance',
  commercial: 'Commercial',
};

export function ServiceCard({ service, priority = false }: ServiceCardProps) {
  return (
    <article
      id={`service-card-${service.slug}`}
      className="group flex flex-col h-full bg-surface overflow-hidden transition-colors duration-300 hover:bg-canvas"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-canvas-sunk">
        <Image
          src={service.image}
          alt={service.title}
          fill
          priority={priority}
          unoptimized
          referrerPolicy="no-referrer"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover saturate-[0.9] transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-col flex-1 p-6 sm:p-7">
        <div className="flex items-baseline justify-between gap-4">
          <span className="type-label text-ink-3">{CATEGORY_LABEL[service.category]}</span>
          {service.emergencyAvailable && (
            <span className="type-label text-urgent">24/7</span>
          )}
        </div>

        <h3 className="type-h3 text-ink mt-4">
          <Link href={`/services/${service.slug}`} className="hover:text-accent transition-colors">
            {service.title}
          </Link>
        </h3>

        <p className="type-small text-ink-2 mt-3">{service.shortDesc}</p>

        <ul className="mt-6 border-t border-line">
          {service.features.slice(0, 3).map((feature) => (
            <li key={feature} className="type-meta text-ink-2 py-2.5 border-b border-line">
              {feature}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-6 flex items-end justify-between gap-4">
          <div>
            <span className="type-label text-ink-3">From</span>
            <p className="type-h4 text-ink mt-1.5">{service.priceEstimate}</p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Link
              href={`/services/${service.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-accent transition-colors"
            >
              Details
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
            </Link>
            <Link
              href={`/booking?service=${encodeURIComponent(service.title)}`}
              className="type-meta text-ink-3 hover:text-ink transition-colors"
            >
              Book this service
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
