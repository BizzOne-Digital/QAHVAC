import { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo';
import { storage } from '@/lib/storage';

/**
 * Rendered per request: the page reads live content from the data store, so it
 * must reflect edits made in the admin dashboard without a rebuild.
 */
export const dynamic = 'force-dynamic';


export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const services = storage.getServices(true);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/booking`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = services.map(service => ({
    url: `${siteUrl}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  return [...staticRoutes, ...serviceRoutes];
}
