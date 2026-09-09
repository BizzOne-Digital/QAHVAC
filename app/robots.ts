import { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: '*',
        // `/api/uploads/` must stay crawlable: every uploaded service image and
        // logo is served from there, and blocking it would stop those images
        // being indexed or fetched for link previews.
        allow: ['/', '/api/uploads/'],
        disallow: ['/admin', '/admin/', '/api/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
