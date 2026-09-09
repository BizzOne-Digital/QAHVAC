import React from 'react';
import { noIndexMetadata } from '@/lib/seo';

/**
 * The sign-in page is the only publicly reachable admin URL — everything else
 * behind /admin redirects anonymous visitors away. robots.txt stops it being
 * crawled; this meta tag stops it being indexed if it is ever linked to.
 */
export const metadata = noIndexMetadata('Admin sign-in');

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
