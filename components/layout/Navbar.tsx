'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { SiteContact } from '@/lib/site';
import { useSiteContact } from './useSiteContact';

const NAV_LINKS = [
  { name: 'Services', href: '/services' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

interface NavbarProps {
  /** Supplied by server pages so the header renders live settings without a round trip. */
  contact?: SiteContact;
  /** Uploaded logo from site settings, when one has been set. */
  logoUrl?: string;
}

export function Navbar({ contact: contactProp, logoUrl }: NavbarProps = {}) {
  const contact = useSiteContact(contactProp);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // The drawer covers the viewport, so the page beneath must not scroll.
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  /* Every page opens on a dark photographic hero, so the header starts
     transparent and resolves to paper once the visitor scrolls past it. */
  const solid = isScrolled || mobileMenuOpen;

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        solid ? 'bg-canvas/92 backdrop-blur-md border-b border-line' : 'bg-transparent border-b border-transparent'
      }`}
    >
      <Container>
        <div className="h-[4.75rem] flex items-center justify-between gap-8">
          <BrandLogo
            variant={solid ? 'dark' : 'light'}
            showSubtitle={false}
            logoUrl={logoUrl}
            businessName={contact.businessName}
          />

          <nav aria-label="Primary" className="hidden md:flex items-center gap-9">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  id={`nav-link-${link.name.toLowerCase()}`}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative text-sm font-medium py-1 transition-colors ${
                    solid
                      ? isActive
                        ? 'text-ink'
                        : 'text-ink-2 hover:text-ink'
                      : isActive
                      ? 'text-white'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span
                      aria-hidden
                      className={`absolute -bottom-0.5 left-0 right-0 h-px ${solid ? 'bg-ink' : 'bg-white'}`}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-6">
            <a
              href={`tel:${contact.phone}`}
              id="nav-direct-call-btn"
              className={`text-sm font-medium transition-colors ${
                solid ? 'text-ink-2 hover:text-ink' : 'text-white/70 hover:text-white'
              }`}
            >
              {contact.phoneDisplay}
            </a>

            <Button
              href="/booking"
              id="nav-book-appointment-btn"
              variant={solid ? 'primary' : 'inverse'}
              size="sm"
            >
              Book service
            </Button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-toggle-btn"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className={`md:hidden -mr-2 p-2 transition-colors ${solid ? 'text-ink' : 'text-white'}`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" strokeWidth={1.5} /> : <Menu className="w-5 h-5" strokeWidth={1.5} />}
          </button>
        </div>
      </Container>

      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="md:hidden absolute top-full left-0 right-0 h-[calc(100dvh-4.75rem)] bg-canvas border-t border-line overflow-y-auto"
        >
          <Container className="py-10 flex flex-col min-h-full">
            <nav aria-label="Mobile" className="flex flex-col">
              <Link
                href="/"
                className={`type-h2 py-3 border-b border-line ${pathname === '/' ? 'text-ink' : 'text-ink-2'}`}
              >
                Home
              </Link>
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`type-h2 py-3 border-b border-line ${isActive ? 'text-ink' : 'text-ink-2'}`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto pt-12 space-y-3">
              <Button href="/booking" variant="primary" size="lg" fullWidth>
                Book service appointment
              </Button>
              <Button href={`tel:${contact.phone}`} variant="secondary" size="lg" fullWidth>
                Call {contact.phoneDisplay}
              </Button>
              <p className="type-meta text-ink-3 pt-4">
                Mon–Fri 7am–8pm · Sat 8am–6pm · Sun 9am–4pm.{' '}
                <span className="text-urgent font-semibold">24/7 emergency dispatch.</span>
              </p>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
