'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/admin/Toast';
import {
  AdminPageHeading,
  EmptyState,
  LoadingState,
  Panel,
  StatPanel,
  StatusPill,
} from '@/components/admin/ui';
import { Button } from '@/components/ui/Button';
import { Booking, ContactSubmission, ServiceItem, SiteSettings } from '@/types';
import { toSiteContact } from '@/lib/site';

const STATUS_TONE: Record<Booking['status'], 'active' | 'neutral' | 'muted'> = {
  pending: 'neutral',
  confirmed: 'active',
  in_progress: 'active',
  completed: 'muted',
  cancelled: 'muted',
};

const STATUS_LABEL: Record<Booking['status'], string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  in_progress: 'In progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inquiries, setInquiries] = useState<ContactSubmission[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const toast = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bRes, iRes, sRes, setRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/inquiries'),
        fetch('/api/services'),
        fetch('/api/settings'),
      ]);

      const [bData, iData, sData, setData] = await Promise.all([
        bRes.json(),
        iRes.json(),
        sRes.json(),
        setRes.json(),
      ]);

      if (bData.success) setBookings(bData.data);
      if (iData.success) setInquiries(iData.data);
      if (sData.success) setServices(sData.data);
      if (setData.success) setSettings(setData.data);
    } catch {
      toast.error('Could not load the dashboard. Check the connection and refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Runs once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleQuickStatusChange = async (id: string, newStatus: Booking['status']) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'The appointment could not be updated.');
      }

      setBookings(prev => prev.map(b => (b.id === id ? data.data : b)));
      toast.success(`Appointment marked ${STATUS_LABEL[newStatus].toLowerCase()}.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'The appointment could not be updated.');
    } finally {
      setUpdatingId(null);
    }
  };

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const emergencyBookings = bookings.filter(b => b.urgency === 'emergency_today');
  const newInquiries = inquiries.filter(i => i.status === 'new');
  const contact = toSiteContact(settings);

  return (
    <>
      <AdminPageHeading
        eyebrow="Overview"
        title="Dispatch board"
        description="Appointments, inquiries and the state of the public catalogue."
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={fetchData} disabled={loading}>
              {loading ? 'Refreshing…' : 'Refresh'}
            </Button>
            <Button href="/admin/bookings" variant="primary" size="sm">
              All appointments
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatPanel
          label="Awaiting confirmation"
          value={pendingBookings.length}
          note="Requests not yet slotted"
        />
        <StatPanel
          label="Confirmed"
          value={confirmedBookings.length}
          note="On the dispatch calendar"
        />
        <StatPanel
          label="Emergency today"
          value={emergencyBookings.length}
          note="No heat or no cooling"
          urgent={emergencyBookings.length > 0}
        />
        <StatPanel label="Unread inquiries" value={newInquiries.length} note="From the contact form" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent appointments */}
        <section className="lg:col-span-8">
          <div className="flex items-baseline justify-between gap-4 pb-4 border-b border-line">
            <h2 className="type-h3 text-ink">Recent requests</h2>
            <Link href="/admin/bookings" className="type-label text-ink-2 hover:text-ink transition-colors">
              View all
            </Link>
          </div>

          {loading ? (
            <div className="mt-5">
              <LoadingState>Loading appointments…</LoadingState>
            </div>
          ) : bookings.length === 0 ? (
            <div className="mt-5">
              <EmptyState>
                No appointments yet. Requests from the website appear here immediately.
              </EmptyState>
            </div>
          ) : (
            <ul className="mt-5 space-y-4">
              {bookings.slice(0, 5).map(bkg => (
                <li key={bkg.id} className="bg-surface border border-line p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="type-meta text-ink-3 font-mono">{bkg.referenceNumber}</span>
                        <StatusPill tone={STATUS_TONE[bkg.status]}>
                          {STATUS_LABEL[bkg.status]}
                        </StatusPill>
                        {bkg.urgency === 'emergency_today' && (
                          <StatusPill tone="urgent">Emergency</StatusPill>
                        )}
                      </div>

                      <p className="type-h4 text-ink mt-3">
                        {bkg.customerName}{' '}
                        <span className="type-meta text-ink-3 font-normal">({bkg.propertyType})</span>
                      </p>

                      <p className="type-small text-ink-2 mt-1">{bkg.serviceName}</p>

                      <p className="type-meta text-ink-3 mt-2.5">
                        {bkg.preferredDate} · {bkg.preferredTimeSlot} · {bkg.address.street},{' '}
                        {bkg.address.city}
                      </p>
                    </div>

                    <div className="flex sm:flex-col sm:items-end gap-3 flex-shrink-0">
                      <a
                        href={`tel:${bkg.phone}`}
                        className="type-small text-ink hover:text-ink-2 transition-colors whitespace-nowrap"
                      >
                        {bkg.phone}
                      </a>

                      {bkg.status === 'pending' && (
                        <button
                          type="button"
                          onClick={() => handleQuickStatusChange(bkg.id, 'confirmed')}
                          disabled={updatingId === bkg.id}
                          className="type-label text-ink hover:text-ink-2 transition-colors disabled:opacity-45 whitespace-nowrap"
                        >
                          {updatingId === bkg.id ? 'Saving…' : 'Confirm'}
                        </button>
                      )}

                      {bkg.status === 'confirmed' && (
                        <button
                          type="button"
                          onClick={() => handleQuickStatusChange(bkg.id, 'completed')}
                          disabled={updatingId === bkg.id}
                          className="type-label text-ink hover:text-ink-2 transition-colors disabled:opacity-45 whitespace-nowrap"
                        >
                          {updatingId === bkg.id ? 'Saving…' : 'Mark completed'}
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Side column */}
        <div className="lg:col-span-4 space-y-6">
          <Panel>
            <div className="flex items-baseline justify-between gap-4">
              <span className="type-label text-ink-3">Emergency banner</span>
              <StatusPill tone={settings?.emergencyBanner.enabled ? 'urgent' : 'muted'}>
                {settings?.emergencyBanner.enabled ? 'Live' : 'Off'}
              </StatusPill>
            </div>
            <p className="type-small text-ink-2 mt-4">
              Urgent calls route to {contact.phoneDisplay} on the public site.
            </p>
            <Link
              href="/admin/settings"
              className="type-label text-ink hover:text-ink-2 transition-colors inline-block mt-5"
            >
              Edit banner
            </Link>
          </Panel>

          <section>
            <div className="flex items-baseline justify-between gap-4 pb-4 border-b border-line">
              <h2 className="type-h3 text-ink">Latest inquiries</h2>
              <Link
                href="/admin/inquiries"
                className="type-label text-ink-2 hover:text-ink transition-colors"
              >
                View all
              </Link>
            </div>

            {inquiries.length === 0 ? (
              <div className="mt-5">
                <EmptyState>No messages yet.</EmptyState>
              </div>
            ) : (
              <ul className="mt-5 space-y-3">
                {inquiries.slice(0, 4).map(inq => (
                  <li key={inq.id} className="bg-surface border border-line p-4">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="type-h4 text-ink truncate">{inq.name}</p>
                      <StatusPill tone={inq.status === 'new' ? 'active' : 'muted'}>
                        {inq.status}
                      </StatusPill>
                    </div>
                    <p className="type-meta text-ink-2 mt-2 line-clamp-2">{inq.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <Panel>
            <span className="type-label text-ink-3">Catalogue</span>
            <p className="type-small text-ink-2 mt-4">
              {services.filter(s => s.active).length} of {services.length} services are live on the
              public site.
            </p>
            <Link
              href="/admin/services"
              className="type-label text-ink hover:text-ink-2 transition-colors inline-block mt-5"
            >
              Manage services
            </Link>
          </Panel>
        </div>
      </div>
    </>
  );
}
