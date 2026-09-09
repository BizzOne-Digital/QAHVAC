import { Metadata } from 'next';
import { APP_CONFIG } from './config';

export function getSiteUrl(): string {
  return process.env.APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://qphvac.com';
}

interface BuildMetadataParams {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}

export function buildMetadata({
  title,
  description,
  path = '',
  image = 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200&auto=format&fit=crop',
  noIndex = false,
}: BuildMetadataParams = {}): Metadata {
  const siteUrl = getSiteUrl();
  const fullTitle = title
    ? `${title} | QP HVAC - Father & Son Heating & Cooling`
    : "QP HVAC | Father & Son Heating & Cooling | Honest Comfort";
  const metaDescription =
    description ||
    "Family Values, Professional Comfort: Father and Son keeping your home's heating and cooling running at its best. Honest pricing, 24/7 emergency dispatch, furnace, AC & heat pump installations.";

  const canonicalUrl = `${siteUrl}${path}`;

  return {
    title: fullTitle,
    description: metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description: metaDescription,
      url: canonicalUrl,
      siteName: 'QP HVAC',
      type: 'website',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: 'QP HVAC - Heating and Cooling Engineering',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: metaDescription,
      images: [image],
    },
  };
}

export function generateHvacBusinessSchema() {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'HVACBusiness',
    name: 'QP HVAC',
    description: "Family Values, Professional Comfort: Father and Son keeping your home's heating and cooling running at its best.",
    url: siteUrl,
    telephone: '+1-226-926-3032',
    email: 'qphvac00@gmail.com',
    priceRange: '$$',
    founder: {
      '@type': 'Person',
      name: 'Jayson',
      jobTitle: 'Master Technician & Co-Founder',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '07:00',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '08:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday'],
        opens: '09:00',
        closes: '16:00',
      },
    ],
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Southwestern Ontario Community Region',
    },
  };
}
