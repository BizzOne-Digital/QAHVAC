import type { Metadata } from 'next';
import './globals.css'; // Global styles
import { storage } from '@/lib/storage';
import {
  DEFAULT_LOCALE,
  DEFAULT_OG_IMAGE,
  SITE_KEYWORDS,
  generateHvacBusinessSchema,
  generateWebSiteSchema,
  getSiteUrl,
  jsonLdScript,
} from '@/lib/seo';
import { APP_CONFIG } from '@/lib/config';

/**
 * Site-wide defaults only. Canonical URLs are deliberately absent here: each
 * page sets its own through `buildMetadata`, and a canonical inherited from the
 * layout would point every page at the same URL.
 */
export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${APP_CONFIG.businessName} | Father & Son Heating & Cooling`,
    // Pages pass a fully-composed title, so the template only fills the gap
    // for any route that sets a bare string.
    template: `%s | ${APP_CONFIG.businessName}`,
  },
  description:
    "Family values, professional comfort. Father and son keeping your home's heating and cooling running at its best — residential and commercial HVAC, with 24/7 emergency dispatch.",
  keywords: SITE_KEYWORDS,
  applicationName: APP_CONFIG.businessName,
  authors: [{ name: APP_CONFIG.businessName }],
  creator: APP_CONFIG.businessName,
  publisher: APP_CONFIG.businessName,
  formatDetection: { telephone: true, address: true, email: true },
  openGraph: {
    type: 'website',
    siteName: APP_CONFIG.businessName,
    locale: DEFAULT_LOCALE.replace('-', '_'),
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // The business and site nodes describe the company, not any one page, so
  // they belong here rather than being repeated per route.
  let settings = null;
  try {
    settings = await storage.getSettings();
  } catch (err) {
    // Structured data is an enhancement; never fail the page over it.
    console.warn('Falling back to static structured data:', err);
  }

  const graph = [generateHvacBusinessSchema(settings), generateWebSiteSchema(settings)];

  return (
    <html lang={DEFAULT_LOCALE}>
      <body suppressHydrationWarning>
        {graph.map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={jsonLdScript(schema)}
          />
        ))}
        {children}
      </body>
    </html>
  );
}
