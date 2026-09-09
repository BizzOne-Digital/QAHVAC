'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { ToastProvider } from '@/components/admin/Toast';

const NAV_ITEMS = [
  { name: 'Overview', href: '/admin' },
  { name: 'Appointments', href: '/admin/bookings' },
  { name: 'Inquiries', href: '/admin/inquiries' },
  { name: 'Services', href: '/admin/services' },
  { name: 'Media', href: '/admin/media' },
  { name: 'Settings', href: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [operator, setOperator] = useState<{ name: string; email: string } | null>(null);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setIsAuthenticated(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check');
        const data = await res.json();
        if (!data.authenticated) {
          router.push('/admin/login');
        } else {
          setIsAuthenticated(true);
          setOperator(data.user ? { name: data.user.name, email: data.user.email } : null);
        }
      } catch {
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      router.push('/admin/login');
    }
  };

  if (isLoginPage) {
    return <div className="min-h-screen bg-canvas text-ink">{children}</div>;
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <span className="type-label text-ink-3">Verifying session…</span>
      </div>
    );
  }

  const navLink = (href: string, name: string, onNavigate?: () => void) => {
    const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
    return (
      <Link
        key={href}
        href={href}
        onClick={onNavigate}
        id={`admin-nav-${name.toLowerCase()}`}
        className={`block py-2.5 border-b border-line type-small transition-colors ${
          isActive ? 'text-ink font-semibold' : 'text-ink-2 hover:text-ink'
        }`}
      >
        {name}
      </Link>
    );
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-canvas text-ink flex flex-col md:flex-row">
        {/* Desktop rail */}
        {/* Pinned to the viewport: the rail stays put while the page scrolls,
            and scrolls internally only if the nav outgrows the screen. */}
        <aside className="hidden md:flex flex-col justify-between w-64 flex-shrink-0 sticky top-0 h-screen overflow-y-auto bg-canvas-sunk border-r border-line px-6 py-8">
          <div>
            <BrandLogo />
            <p className="type-label text-ink-3 mt-6">Dispatch portal</p>

            <nav className="mt-4 border-t border-line">
              {NAV_ITEMS.map(item => navLink(item.href, item.name))}
            </nav>
          </div>

          <div className="pt-8">
            <p className="type-label text-ink-3">Signed in</p>
            <p className="type-small text-ink mt-2" title={operator?.email}>
              {operator?.name || 'Administrator'}
            </p>
            <p className="type-meta text-ink-3 truncate">{operator?.email}</p>

            <div className="mt-5 pt-5 border-t border-line flex flex-col gap-2.5">
              <Link
                href="/"
                target="_blank"
                className="type-small text-ink-2 hover:text-ink transition-colors"
              >
                View live site
              </Link>
              <button
                onClick={handleLogout}
                id="admin-logout-btn"
                className="type-small text-urgent hover:text-urgent-hover transition-colors text-left"
              >
                Sign out
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile bar */}
        <div className="md:hidden bg-surface border-b border-line px-5 py-4 flex items-center justify-between">
          <BrandLogo />
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-expanded={mobileNavOpen}
            aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
            className="type-label text-ink border border-line-strong px-3 py-2"
          >
            {mobileNavOpen ? 'Close' : 'Menu'}
          </button>
        </div>

        {mobileNavOpen && (
          <div className="md:hidden bg-canvas-sunk border-b border-line px-5 pb-5">
            <nav className="border-t border-line">
              {NAV_ITEMS.map(item => navLink(item.href, item.name, () => setMobileNavOpen(false)))}
            </nav>
            <div className="flex items-center justify-between pt-4">
              <Link href="/" target="_blank" className="type-small text-ink-2">
                View live site
              </Link>
              <button onClick={handleLogout} className="type-small text-urgent">
                Sign out
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 min-w-0 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="max-w-[76rem] mx-auto space-y-8">{children}</div>
        </main>
      </div>
    </ToastProvider>
  );
}
