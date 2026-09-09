import React from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Container } from '@/components/ui/Container';
import { APP_CONFIG } from '@/lib/config';

const SERVICE_LINKS = [
  { label: 'Furnaces & heating', href: '/services/furnace-heating-repair-installation' },
  { label: 'Air conditioning', href: '/services/air-conditioning-cooling' },
  { label: 'Cold-climate heat pumps', href: '/services/cold-climate-heat-pumps' },
  { label: 'Seasonal tune-ups', href: '/services/seasonal-tuneup-maintenance' },
  { label: 'Commercial HVAC', href: '/services/commercial-hvac-services' },
  { label: 'Emergency dispatch', href: '/services/emergency-24-7-repair' },
];

const SITE_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'All services', href: '/services' },
  { label: 'Our story', href: '/about' },
  { label: 'Book an appointment', href: '/booking' },
  { label: 'Contact', href: '/contact' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="site-footer" className="bg-obsidian text-white">
      <Container>
        {/* Closing statement, set as a spread rather than a banner. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 gap-x-8 pt-20 pb-16 sm:pt-24 lg:pb-20">
          <div className="lg:col-span-7">
            <p className="type-display-sm text-white max-w-[26rem]">
              Family values,
              <br />
              professional comfort.
            </p>
          </div>

          <div className="lg:col-span-5 lg:pt-3">
            <p className="type-body text-white/60 max-w-[26rem]">
              Honest pricing, dependable service and craftsmanship you can count on — from a father and
              son who answer the phone themselves.
            </p>
            <div className="mt-8 flex flex-wrap items-baseline gap-x-8 gap-y-3">
              <a
                href={`tel:${APP_CONFIG.phone}`}
                className="type-h3 text-white hover:text-white/70 transition-colors"
              >
                {APP_CONFIG.phoneDisplay}
              </a>
              <a
                href={`mailto:${APP_CONFIG.email}`}
                className="type-small text-white/60 hover:text-white transition-colors"
              >
                {APP_CONFIG.email}
              </a>
            </div>
          </div>
        </div>

        {/* Directory */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-y-12 gap-x-8 py-14 border-t border-white/12">
          <div className="col-span-2 lg:col-span-4">
            <BrandLogo variant="light" />
            <p className="type-meta text-white/45 mt-6 max-w-[18rem]">
              Licensed gas and refrigeration technicians. Residential and commercial dispatch throughout the
              greater region.
            </p>
          </div>

          <nav aria-label="Services" className="lg:col-span-3">
            <h3 className="type-label text-white/40">Services</h3>
            <ul className="mt-5 space-y-3">
              {SERVICE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="type-small text-white/70 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Site" className="lg:col-span-2">
            <h3 className="type-label text-white/40">Site</h3>
            <ul className="mt-5 space-y-3">
              {SITE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="type-small text-white/70 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h3 className="type-label text-white/40">Hours</h3>
            <dl className="mt-5 space-y-2.5 type-small text-white/70">
              <div className="flex justify-between gap-4">
                <dt className="text-white/45">Mon – Fri</dt>
                <dd>7:00am – 8:00pm</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-white/45">Saturday</dt>
                <dd>8:00am – 6:00pm</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-white/45">Sunday</dt>
                <dd>9:00am – 4:00pm</dd>
              </div>
              <div className="flex justify-between gap-4 pt-2.5 border-t border-white/12">
                <dt className="text-white/45">Emergency</dt>
                <dd className="text-white">24 hours</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Legal */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-8 border-t border-white/12">
          <p className="type-meta text-white/40">
            © {currentYear} QP HVAC. Owned and operated by Jayson and family.
          </p>
          <Link href="/admin/login" className="type-meta text-white/40 hover:text-white/70 transition-colors">
            Technician portal
          </Link>
        </div>
      </Container>
    </footer>
  );
}
