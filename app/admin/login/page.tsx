'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Button } from '@/components/ui/Button';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next');
  const redirectTo = nextPath && nextPath.startsWith('/admin') ? nextPath : '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() || undefined, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid credentials');
      }

      router.replace(redirectTo);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-5 py-16">
      <div className="w-full max-w-[26rem]">
        <BrandLogo />

        <div className="bg-surface border border-line p-8 sm:p-10 mt-8">
          <span className="type-label text-ink-3">Dispatch portal</span>
          <h1 className="type-h2 text-ink mt-3">Sign in</h1>
          <p className="type-small text-ink-2 mt-3">
            Manage appointments, inquiries, services, media and site settings.
          </p>

          {error && (
            <p role="alert" className="type-small text-urgent border-l-2 border-urgent pl-4 mt-7">
              {error}
            </p>
          )}

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label htmlFor="admin-email" className="field-label">
                Email address
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="field"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="field-label">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="field"
              />
            </div>

            <Button
              type="submit"
              id="admin-login-submit-btn"
              variant="primary"
              size="md"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </div>

        <p className="type-meta text-ink-3 mt-6">
          Access is limited to accounts created by the administrator seed.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-canvas flex items-center justify-center">
          <span className="type-label text-ink-3">Loading…</span>
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
