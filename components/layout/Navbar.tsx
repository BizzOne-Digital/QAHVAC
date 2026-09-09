'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Calendar, Menu, X, ShieldCheck, Flame, Snowflake, Clock } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { APP_CONFIG } from '@/lib/config';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top micro-bar for credibility & hours */}
      <div className="bg-zinc-950 text-zinc-300 text-xs py-2 px-4 border-b border-white/[0.06] hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5 text-[11px] font-medium tracking-wide">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              Licensed Gas & Refrigeration Master Technicians
            </span>
            <span className="text-zinc-600">|</span>
            <span className="flex items-center gap-1.5 text-zinc-400">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              Heating
              <span className="text-zinc-600">/</span>
              <Snowflake className="w-3.5 h-3.5 text-sky-400" />
              Cooling
              <span className="text-zinc-600">/</span>
              Heat Pumps
            </span>
          </div>

          <div className="flex items-center gap-5 text-[11px]">
            <span className="flex items-center gap-1.5 text-zinc-400">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              Mon-Sun: 7am - 8pm <span className="text-zinc-600">•</span> <span className="text-rose-400 font-semibold">24/7 Rapid Emergency Dispatch</span>
            </span>
            <span className="text-zinc-700">|</span>
            <Link
              href="/admin/login"
              id="header-admin-link"
              className="text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-wider text-[10px] font-bold"
            >
              Technician Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation container */}
      <nav
        id="main-navigation"
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-zinc-950/90 backdrop-blur-xl shadow-2xl border-b border-white/[0.08]'
            : 'bg-zinc-950/70 backdrop-blur-md border-b border-white/[0.05]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <BrandLogo variant="light" />

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1 bg-zinc-900/60 p-1.5 rounded-full border border-white/[0.08]">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  id={`nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`text-xs font-semibold tracking-wide px-4 py-1.5 rounded-full transition-all ${
                    isActive
                      ? 'bg-white text-zinc-950 shadow-sm'
                      : 'text-zinc-300 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions (Call + Booking CTA) */}
          <div className="hidden lg:flex items-center gap-3.5">
            <a
              href={`tel:${APP_CONFIG.phone}`}
              id="nav-direct-call-btn"
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-100 border border-white/[0.08] hover:border-white/20 transition-all text-xs font-medium"
            >
              <div className="w-6 h-6 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center">
                <Phone className="w-3 h-3" />
              </div>
              <div className="text-left leading-none">
                <div className="text-[9px] text-zinc-400 uppercase font-bold tracking-wider">Direct to Jayson</div>
                <div className="font-bold text-white tracking-tight text-xs mt-0.5">{APP_CONFIG.phoneDisplay}</div>
              </div>
            </a>

            <Link
              href="/booking"
              id="nav-book-appointment-btn"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs tracking-tight shadow-md hover:shadow-white/10 transition-all active:scale-[0.98]"
            >
              <Calendar className="w-3.5 h-3.5 text-zinc-900" />
              <span>Book Service</span>
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <a
              href={`tel:${APP_CONFIG.phone}`}
              aria-label="Call Jayson"
              className="p-2.5 rounded-xl bg-zinc-900 text-rose-400 border border-white/10"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-menu-toggle-btn"
              aria-label="Toggle navigation menu"
              className="p-2.5 rounded-xl bg-zinc-900 text-zinc-200 border border-white/10 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div id="mobile-navigation-drawer" className="md:hidden bg-zinc-950 border-b border-white/10 px-5 pt-3 pb-6 space-y-3">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-white text-zinc-950 font-bold'
                        : 'text-zinc-300 hover:bg-zinc-900'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-white/[0.08] space-y-2">
              <a
                href={`tel:${APP_CONFIG.phone}`}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-900 text-white font-bold border border-white/10 text-xs"
              >
                <Phone className="w-4 h-4 text-rose-400" />
                Call Jayson: {APP_CONFIG.phoneDisplay}
              </a>
              <Link
                href="/booking"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-zinc-950 font-bold text-xs"
              >
                <Calendar className="w-4 h-4" />
                Book Service Appointment
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
