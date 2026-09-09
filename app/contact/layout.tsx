import React from 'react';
import { generatePageMetadata } from '@/lib/seo';

/**
 * The contact page itself is a client component (it owns the form state), and
 * a client component cannot export `metadata` — so the route's tags live here.
 */
export async function generateMetadata() {
  return generatePageMetadata('contact', '/contact');
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
