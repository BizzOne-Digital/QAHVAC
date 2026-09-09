import { Metadata } from 'next';
import { ServiceItem, SiteSettings } from '@/types';
import { APP_CONFIG } from './config';
import { storage } from './storage';

/**
 * Site-wide SEO helpers.
 *
 * The site is single-locale (Canadian English). `LOCALES` exists so that adding
 * a second language later means adding an entry here rather than reworking
 * every page: hreflang alternates are emitted only once more than one locale is
 * configured, since a self-referencing hreflang on a monolingual site is noise.
 */

export const DEFAULT_LOCALE = 'en-CA';
export const LOCALES = [DEFAULT_LOCALE] as const;
export type Locale = (typeof LOCALES)[number];

/** Maps a BCP-47 tag to the underscored form Open Graph expects. */
function ogLocale(locale: string): string {
  return locale.replace('-', '_');
}

/**
 * Absolute origin for canonicals, Open Graph URLs and the sitemap.
 *
 * NEXT_PUBLIC_SITE_URL is the value to set in production. VERCEL_URL is used
 * automatically for preview deployments so their canonicals point at
 * themselves rather than at production.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL;
  if (explicit) return explicit.replace(/\/$/, '');

  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  return 'http://localhost:3000';
}

export function absoluteUrl(path = ''): string {
  const normalised = path && !path.startsWith('/') ? `/${path}` : path;
  // The homepage canonical is the origin with a trailing slash.
  return `${getSiteUrl()}${normalised || '/'}`;
}

const SITE_NAME = APP_CONFIG.businessName;
const TITLE_SUFFIX = `${SITE_NAME} — Father & Son Heating & Cooling`;

const DEFAULT_DESCRIPTION =
  "Family values, professional comfort. Father and son keeping your home's heating and cooling running at its best — honest pricing, 24/7 emergency dispatch, furnace, AC and heat pump service.";

/** Used when a page supplies no image of its own. */
export const DEFAULT_OG_IMAGE =
  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200&auto=format&fit=crop';

export const SITE_KEYWORDS = [
  'HVAC',
  'furnace repair',
  'furnace installation',
  'air conditioning repair',
  'AC installation',
  'heat pump installation',
  'ductless mini-split',
  'emergency HVAC repair',
  'HVAC maintenance',
  'commercial HVAC',
  'heating and cooling',
  'licensed gas technician',
];

export interface BuildMetadataParams {
  title?: string;
  description?: string;
  /** Path only, e.g. `/services/furnace-repair`. Becomes the canonical URL. */
  path?: string;
  image?: string;
  locale?: Locale;
  noIndex?: boolean;
  keywords?: string[];
  /** `article` suits a service detail page; everything else is a `website`. */
  type?: 'website' | 'article';
}

/**
 * Builds a page's metadata: canonical, hreflang alternates, Open Graph and
 * Twitter card. Every public page should call this (directly or through
 * `generatePageMetadata`) so the tags stay consistent.
 */
export function buildMetadata({
  title,
  description,
  path = '',
  image = DEFAULT_OG_IMAGE,
  locale = DEFAULT_LOCALE,
  noIndex = false,
  keywords,
  type = 'website',
}: BuildMetadataParams = {}): Metadata {
  const fullTitle = title ? `${title} | ${TITLE_SUFFIX}` : TITLE_SUFFIX;
  const metaDescription = description || DEFAULT_DESCRIPTION;
  const canonical = absoluteUrl(path);

  // Only meaningful once the site is genuinely multilingual.
  const languages =
    LOCALES.length > 1
      ? Object.fromEntries(LOCALES.map(l => [l, absoluteUrl(path)]))
      : undefined;

  return {
    // Absolute: these titles are already composed with the brand, so the root
    // layout's `%s | QP HVAC` template must not append it a second time.
    title: { absolute: fullTitle },
    description: metaDescription,
    keywords: keywords ?? SITE_KEYWORDS,
    alternates: {
      canonical,
      ...(languages ? { languages } : {}),
    },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
        },
    openGraph: {
      title: fullTitle,
      description: metaDescription,
      url: canonical,
      siteName: SITE_NAME,
      locale: ogLocale(locale),
      type,
      images: [{ url: image, width: 1200, height: 630, alt: `${SITE_NAME} — heating and cooling` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: metaDescription,
      images: [image],
    },
  };
}

/** Cart, checkout and account-style pages: reachable, never indexed. */
export function noIndexMetadata(title = 'Private'): Metadata {
  return {
    title: { absolute: `${title} | ${SITE_NAME}` },
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: { index: false, follow: false },
    },
  };
}

/* -------------------------------------------------------------------------- */
/* Page copy, with database fallbacks                                          */
/* -------------------------------------------------------------------------- */

export type PageKey = 'home' | 'about' | 'services' | 'booking' | 'contact';

interface PageCopy {
  title: string;
  description: string;
}

/** Static fallbacks, used when the database has nothing better to offer. */
const PAGE_COPY: Record<PageKey, PageCopy> = {
  home: {
    title: '',
    description: DEFAULT_DESCRIPTION,
  },
  about: {
    title: 'About us',
    description:
      'A father-and-son HVAC team. Honest pricing, repair before replacement, and licensed gas and refrigeration work you can stand behind.',
  },
  services: {
    title: 'Heating, cooling and heat pump services',
    description:
      'Furnace and AC diagnostics, cold-climate heat pumps, seasonal tune-ups, commercial HVAC and 24/7 emergency dispatch. Upfront pricing on every call.',
  },
  booking: {
    title: 'Book an appointment',
    description:
      'Reserve a heating, cooling, heat pump or emergency service call online. Pick your date and arrival window; we confirm by phone.',
  },
  contact: {
    title: 'Contact',
    description:
      'Speak directly with the owner — no call centre and no automated queue. Call, text or send a message for a quote or an urgent repair.',
  },
};

/**
 * Page metadata assembled from the live site settings, falling back to the
 * static copy above when a setting is empty. The business name, service area
 * and tagline are editable in the dashboard, so the tags follow that content
 * instead of drifting out of date.
 */
export async function generatePageMetadata(
  pageKey: PageKey,
  path: string,
  overrides: BuildMetadataParams = {}
): Promise<Metadata> {
  const fallback = PAGE_COPY[pageKey];

  let settings: SiteSettings | null = null;
  try {
    settings = await storage.getSettings();
  } catch (err) {
    // Metadata must never take a page down; the static copy is enough.
    console.warn(`Falling back to static metadata for "${pageKey}":`, err);
  }

  const description =
    pageKey === 'home' && settings?.tagline
      ? settings.tagline
      : pageKey === 'about' && settings?.aboutStory
        ? settings.aboutStory
        : fallback.description;

  return buildMetadata({
    title: fallback.title || undefined,
    description: description.slice(0, 300),
    path,
    ...overrides,
  });
}

/* -------------------------------------------------------------------------- */
/* Structured data                                                             */
/* -------------------------------------------------------------------------- */

function openingHours(settings?: SiteSettings | null) {
  const hours = settings?.hours;
  return [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '07:00',
      closes: '20:00',
      description: hours?.weekdays,
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday'],
      opens: '08:00',
      closes: '18:00',
      description: hours?.saturday,
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Sunday'],
      opens: '09:00',
      closes: '16:00',
      description: hours?.sunday,
    },
  ];
}

/**
 * LocalBusiness (HVACBusiness) description of the company, driven by the
 * editable site settings. Rendered once, in the root layout.
 */
export function generateHvacBusinessSchema(settings?: SiteSettings | null) {
  const siteUrl = getSiteUrl();
  const phone = settings?.phone || APP_CONFIG.phone;

  return {
    '@context': 'https://schema.org',
    '@type': 'HVACBusiness',
    '@id': `${siteUrl}/#business`,
    name: settings?.businessName || APP_CONFIG.businessName,
    description: settings?.tagline || DEFAULT_DESCRIPTION,
    url: siteUrl,
    telephone: `+${phone.replace(/\D/g, '')}`,
    email: settings?.email || APP_CONFIG.email,
    image: DEFAULT_OG_IMAGE,
    priceRange: '$$',
    ...(settings?.logoUrl ? { logo: absoluteUrl(settings.logoUrl) } : {}),
    founder: {
      '@type': 'Person',
      name: settings?.contactPerson || APP_CONFIG.contactPerson,
      jobTitle: 'Master technician and co-founder',
    },
    openingHoursSpecification: openingHours(settings),
    areaServed: {
      '@type': 'AdministrativeArea',
      name: settings?.serviceArea || 'Greater region and surrounding communities',
    },
    sameAs: [
      settings?.socialLinks?.facebook,
      settings?.socialLinks?.instagram,
      settings?.socialLinks?.googleReviews,
    ].filter(Boolean),
  };
}

/** WebSite node, so search engines can associate the name with the domain. */
export function generateWebSiteSchema(settings?: SiteSettings | null) {
  const siteUrl = getSiteUrl();

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: settings?.businessName || APP_CONFIG.businessName,
    description: settings?.tagline || DEFAULT_DESCRIPTION,
    url: siteUrl,
    inLanguage: DEFAULT_LOCALE,
    publisher: { '@id': `${siteUrl}/#business` },
  };
}

/**
 * Service node for a catalogue entry. This business sells services rather than
 * stocked products, so `Service` with an `Offer` is the accurate type — a
 * `Product` here would misrepresent what is being sold.
 */
export function generateServiceSchema(service: ServiceItem, settings?: SiteSettings | null) {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/services/${service.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name: service.title,
    description: service.fullDesc || service.shortDesc,
    url,
    ...(service.image ? { image: absoluteUrl(service.image) } : {}),
    serviceType: service.category,
    provider: { '@id': `${siteUrl}/#business` },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: settings?.serviceArea || 'Greater region and surrounding communities',
    },
    // The catalogue quotes guide pricing in prose ("Diagnostic from $99"), so
    // the offer carries that text rather than inventing a numeric price.
    offers: {
      '@type': 'Offer',
      priceCurrency: 'CAD',
      description: service.priceEstimate,
      availability: 'https://schema.org/InStock',
      url,
    },
  };
}

/** Breadcrumb trail for a service detail page. */
export function generateBreadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/**
 * FAQPage node. Ready for whenever a FAQ section is added — pass the questions
 * actually shown on the page; marking up questions a visitor cannot see on the
 * page is a structured-data violation.
 */
export function generateFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

/** Serialises JSON-LD for a <script type="application/ld+json"> tag. */
export function jsonLdScript(schema: object): { __html: string } {
  return { __html: JSON.stringify(schema).replace(/</g, '\\u003c') };
}
