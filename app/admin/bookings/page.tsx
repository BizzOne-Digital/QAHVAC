'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useToast } from '@/components/admin/Toast';
import {
  AdminPageHeading,
  EmptyState,
  Field,
  LoadingState,
  Panel,
  StatusPill,
} from '@/components/admin/ui';
import { Button } from '@/components/ui/Button';
import { Booking, BookingStatus, BookingUrgency } from '@/types';

const STATUSES: { value: BookingStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const URGENCIES: { value: BookingUrgency; label: string }[] = [
  { value: 'emergency_today', label: 'Emergency / today' },
  { value: 'standard', label: 'Standard' },
  { value: 'flexible', label: 'Flexible' },
];

const STATUS_TONE: Record<BookingStatus, 'active' | 'neutral' | 'muted'> = {
  pending: 'neutral',
  confirmed: 'active',
  in_progress: 'active',
  completed: 'muted',
  cancelled: 'muted',
};

function statusLabel(status: BookingStatus): string {
  return STATUSES.find(s => s.value === status)?.label ?? status;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editStatus, setEditStatus] = useState<BookingStatus>('pending');
  const [editTechNotes, setEditTechNotes] = useState('');
  const [editAssignedTech, setEditAssignedTech] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const toast = useToast();

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Could not load appointments.');
      setBookings(data.data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // Runs once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditStatus(booking.status);
    setEditTechNotes(booking.technicianNotes || '');
    setEditAssignedTech(booking.assignedTechnician || '');
  };

  const handleUpdateBooking = async () => {
    if (!selectedBooking) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/bookings/${selectedBooking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editStatus,
          technicianNotes: editTechNotes,
          assignedTechnician: editAssignedTech,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'The appointment could not be updated.');
      }

      setBookings(prev => prev.map(b => (b.id === selectedBooking.id ? data.data : b)));
      setSelectedBooking(data.data);
      toast.success('Appointment updated.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'The appointment could not be updated.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'The appointment could not be removed.');
      }

      setBookings(prev => prev.filter(b => b.id !== id));
      if (selectedBooking?.id === id) setSelectedBooking(null);
      toast.success('Appointment removed.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'The appointment could not be removed.');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const filteredBookings = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return bookings.filter(b => {
      const matchesSearch =
        !query ||
        b.customerName.toLowerCase().includes(query) ||
        b.phone.includes(searchQuery) ||
        b.referenceNumber.toLowerCase().includes(query) ||
        b.serviceName.toLowerCase().includes(query) ||
        b.address.city.toLowerCase().includes(query);

      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      const matchesUrgency = urgencyFilter === 'all' || b.urgency === urgencyFilter;

      return matchesSearch && matchesStatus && matchesUrgency;
    });
  }, [bookings, searchQuery, statusFilter, urgencyFilter]);

  return (
    <>
      <AdminPageHeading
        eyebrow="Scheduling"
        title="Appointments"
        description="Every request from the website, with the status the customer is waiting on."
        actions={
          <Button variant="secondary" size="sm" onClick={fetchBookings} disabled={loading}>
            {loading ? 'Refreshing…' : 'Refresh'}
          </Button>
        }
      />

      <Panel>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <Field label="Search" className="md:col-span-6">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Name, phone, reference, service or city"
              className="field"
            />
          </Field>

          <Field label="Status" className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="field"
            >
              <option value="all">All statuses</option>
              {STATUSES.map(s => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Urgency" className="md:col-span-3">
            <select
              value={urgencyFilter}
              onChange={e => setUrgencyFilter(e.target.value)}
              className="field"
            >
              <option value="all">All urgencies</option>
              {URGENCIES.map(u => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Panel>

      {loading ? (
        <LoadingState>Loading appointments…</LoadingState>
      ) : filteredBookings.length === 0 ? (
        <EmptyState>
          {bookings.length === 0
            ? 'No appointments yet. Requests from the website appear here immediately.'
            : 'No appointments match these filters.'}
        </EmptyState>
      ) : (
        <div className="bg-surface border border-line overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[56rem]">
            <thead>
              <tr className="border-b border-line">
                <th className="type-label text-ink-3 py-4 px-5">Reference</th>
                <th className="type-label text-ink-3 py-4 px-5">Service</th>
                <th className="type-label text-ink-3 py-4 px-5">Date</th>
                <th className="type-label text-ink-3 py-4 px-5">Location</th>
                <th className="type-label text-ink-3 py-4 px-5">Status</th>
                <th className="type-label text-ink-3 py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map(b => (
                <tr key={b.id} className="border-b border-line last:border-b-0 hover:bg-canvas-sunk transition-colors">
                  <td className="py-4 px-5 align-top">
                    <div className="type-meta text-ink-3 font-mono">{b.referenceNumber}</div>
                    <div className="type-h4 text-ink mt-1">{b.customerName}</div>
                    <div className="type-meta text-ink-3">{b.phone}</div>
                  </td>

                  <td className="py-4 px-5 align-top">
                    <div className="type-small text-ink">{b.serviceName}</div>
                    <div className="type-meta text-ink-3 capitalize">{b.propertyType}</div>
                  </td>

                  <td className="py-4 px-5 align-top">
                    <div className="type-small text-ink">{b.preferredDate}</div>
                    <div className="type-meta text-ink-3">{b.preferredTimeSlot}</div>
                  </td>

                  <td className="py-4 px-5 align-top">
                    <div className="type-small text-ink">{b.address.city}</div>
                    <div className="type-meta text-ink-3">{b.address.street}</div>
                  </td>

                  <td className="py-4 px-5 align-top">
                    <div className="flex flex-col items-start gap-2">
                      <StatusPill tone={STATUS_TONE[b.status]}>{statusLabel(b.status)}</StatusPill>
                      {b.urgency === 'emergency_today' && (
                        <StatusPill tone="urgent">Emergency</StatusPill>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-5 align-top text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => openDetails(b)}
                      title="View & Edit Booking"
                      className="type-label text-ink hover:text-ink-2 transition-colors"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(b.id)}
                      title="Delete Booking"
                      className="type-label text-urgent hover:text-urgent-hover transition-colors ml-4"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail drawer */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-ink/45 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-surface border border-line w-full max-w-2xl my-8">
            <div className="flex items-baseline justify-between gap-4 px-6 sm:px-8 py-5 border-b border-line">
              <div>
                <span className="type-label text-ink-3">{selectedBooking.referenceNumber}</span>
                <h2 className="type-h3 text-ink mt-2">{selectedBooking.customerName}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="type-label text-ink-3 hover:text-ink transition-colors"
              >
                Close
              </button>
            </div>

            <div className="px-6 sm:px-8 py-7 space-y-7">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 border-t border-line">
                {[
                  ['Service', selectedBooking.serviceName],
                  ['Property', selectedBooking.propertyType],
                  ['Requested date', selectedBooking.preferredDate],
                  ['Arrival window', selectedBooking.preferredTimeSlot],
                  ['Phone', selectedBooking.phone],
                  ['Email', selectedBooking.email || '—'],
                  [
                    'Address',
                    `${selectedBooking.address.street}, ${selectedBooking.address.city} ${selectedBooking.address.postalCode}`,
                  ],
                  ['Equipment age', selectedBooking.equipmentAge || '—'],
                ].map(([label, value]) => (
                  <div key={label} className="py-3.5 border-b border-line">
                    <dt className="type-label text-ink-3">{label}</dt>
                    <dd className="type-small text-ink mt-1.5">{value}</dd>
                  </div>
                ))}
              </dl>

              {selectedBooking.issueDescription && (
                <div>
                  <span className="type-label text-ink-3">Reported issue</span>
                  <p className="type-small text-ink-2 mt-2.5">{selectedBooking.issueDescription}</p>
                </div>
              )}

              <div className="space-y-5 pt-2">
                <Field label="Status">
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value as BookingStatus)}
                    className="field"
                  >
                    {STATUSES.map(s => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Assigned technician">
                  <input
                    type="text"
                    value={editAssignedTech}
                    onChange={e => setEditAssignedTech(e.target.value)}
                    placeholder="Jayson (lead craftsman)"
                    className="field"
                  />
                </Field>

                <Field label="Technician notes" hint="Internal only — never shown to the customer.">
                  <textarea
                    rows={4}
                    value={editTechNotes}
                    onChange={e => setEditTechNotes(e.target.value)}
                    placeholder="Parts to bring, access notes, quoted work."
                    className="field"
                  />
                </Field>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-line">
                <Button variant="secondary" size="md" onClick={() => setSelectedBooking(null)}>
                  Close
                </Button>
                <Button variant="primary" size="md" onClick={handleUpdateBooking} disabled={isSaving}>
                  {isSaving ? 'Saving…' : 'Save updates'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-ink/45 flex items-center justify-center p-4">
          <div className="bg-surface border border-line w-full max-w-md p-7">
            <span className="type-label text-ink-3">Confirm</span>
            <h2 className="type-h3 text-ink mt-3">Remove this appointment?</h2>
            <p className="type-small text-ink-2 mt-3">
              The request is deleted permanently. Call the customer first if it has not been resolved.
            </p>

            <div className="flex justify-end gap-3 mt-7">
              <Button variant="secondary" size="md" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </Button>
              <Button variant="urgent" size="md" onClick={() => handleDeleteBooking(deleteConfirmId)}>
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
