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
import { ContactSubmission, InquiryStatus } from '@/types';

const STATUSES: { value: InquiryStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'archived', label: 'Archived' },
];

const STATUS_TONE: Record<InquiryStatus, 'active' | 'neutral' | 'muted'> = {
  new: 'active',
  contacted: 'neutral',
  resolved: 'muted',
  archived: 'muted',
};

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const toast = useToast();

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/inquiries');
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Could not load inquiries.');
      setInquiries(data.data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not load inquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
    // Runs once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: InquiryStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'The inquiry could not be updated.');
      }

      setInquiries(prev => prev.map(i => (i.id === id ? data.data : i)));
      toast.success(`Marked ${newStatus}.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'The inquiry could not be updated.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'The inquiry could not be removed.');
      }

      setInquiries(prev => prev.filter(i => i.id !== id));
      toast.success('Inquiry removed.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'The inquiry could not be removed.');
    } finally {
      setDeleteId(null);
    }
  };

  const filteredInquiries = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return inquiries.filter(inq => {
      const matchesSearch =
        !query ||
        inq.name.toLowerCase().includes(query) ||
        inq.message.toLowerCase().includes(query) ||
        (inq.phone || '').includes(searchQuery) ||
        (inq.email || '').toLowerCase().includes(query) ||
        (inq.subject || '').toLowerCase().includes(query);

      const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [inquiries, searchQuery, statusFilter]);

  return (
    <>
      <AdminPageHeading
        eyebrow="Messages"
        title="Inquiries"
        description="Everything submitted through the contact form, newest first."
        actions={
          <Button variant="secondary" size="sm" onClick={fetchInquiries} disabled={loading}>
            {loading ? 'Refreshing…' : 'Refresh'}
          </Button>
        }
      />

      <Panel>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <Field label="Search" className="md:col-span-8">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Name, subject, message, phone or email"
              className="field"
            />
          </Field>

          <Field label="Status" className="md:col-span-4">
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
        </div>
      </Panel>

      {loading ? (
        <LoadingState>Loading inquiries…</LoadingState>
      ) : filteredInquiries.length === 0 ? (
        <EmptyState>
          {inquiries.length === 0
            ? 'No messages yet. Contact form submissions appear here immediately.'
            : 'No inquiries match these filters.'}
        </EmptyState>
      ) : (
        <ul className="space-y-5">
          {filteredInquiries.map(inq => (
            <li key={inq.id} className="bg-surface border border-line p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <StatusPill tone={STATUS_TONE[inq.status]}>{inq.status}</StatusPill>
                    <span className="type-meta text-ink-3">{formatDate(inq.createdAt)}</span>
                  </div>

                  <h2 className="type-h4 text-ink mt-3">{inq.name}</h2>
                  <p className="type-meta text-ink-3 mt-1">
                    {inq.propertyType}
                    {inq.subject ? ` · ${inq.subject}` : ''}
                  </p>
                </div>

                <div className="flex flex-col sm:items-end gap-1 flex-shrink-0">
                  {inq.phone && (
                    <a
                      href={`tel:${inq.phone}`}
                      className="type-small text-ink hover:text-ink-2 transition-colors"
                    >
                      {inq.phone}
                    </a>
                  )}
                  {inq.email && (
                    <a
                      href={`mailto:${inq.email}`}
                      className="type-meta text-ink-2 hover:text-ink transition-colors truncate"
                    >
                      {inq.email}
                    </a>
                  )}
                </div>
              </div>

              <p className="type-small text-ink-2 mt-5 pt-5 border-t border-line">{inq.message}</p>

              {inq.adminNotes && (
                <p className="type-meta text-ink-3 mt-4 border-l-2 border-line-strong pl-4">
                  Internal note: {inq.adminNotes}
                </p>
              )}

              <div className="mt-5 pt-4 border-t border-line flex flex-wrap items-center gap-5">
                {inq.status !== 'contacted' && (
                  <button
                    type="button"
                    title="Mark Contacted"
                    onClick={() => handleStatusUpdate(inq.id, 'contacted')}
                    disabled={updatingId === inq.id}
                    className="type-label text-ink hover:text-ink-2 transition-colors disabled:opacity-45"
                  >
                    Mark contacted
                  </button>
                )}

                {inq.status !== 'resolved' && (
                  <button
                    type="button"
                    title="Mark Resolved"
                    onClick={() => handleStatusUpdate(inq.id, 'resolved')}
                    disabled={updatingId === inq.id}
                    className="type-label text-ink hover:text-ink-2 transition-colors disabled:opacity-45"
                  >
                    Mark resolved
                  </button>
                )}

                {inq.status !== 'archived' && (
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate(inq.id, 'archived')}
                    disabled={updatingId === inq.id}
                    className="type-label text-ink-2 hover:text-ink transition-colors disabled:opacity-45"
                  >
                    Archive
                  </button>
                )}

                <button
                  type="button"
                  title="Delete Message"
                  onClick={() => setDeleteId(inq.id)}
                  className="type-label text-urgent hover:text-urgent-hover transition-colors ml-auto"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 bg-ink/45 flex items-center justify-center p-4">
          <div className="bg-surface border border-line w-full max-w-md p-7">
            <span className="type-label text-ink-3">Confirm</span>
            <h2 className="type-h3 text-ink mt-3">Remove this message?</h2>
            <p className="type-small text-ink-2 mt-3">
              The inquiry is deleted permanently. Archive it instead if you may need it later.
            </p>

            <div className="flex justify-end gap-3 mt-7">
              <Button variant="secondary" size="md" onClick={() => setDeleteId(null)}>
                Cancel
              </Button>
              <Button variant="urgent" size="md" onClick={() => handleDelete(deleteId)}>
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
