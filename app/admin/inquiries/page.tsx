'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  PhoneCall,
  Mail,
  CheckCircle2,
  Trash2,
  Clock,
  Archive,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { ContactSubmission } from '@/types';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/inquiries');
      const data = await res.json();
      if (data.success) {
        setInquiries(data.data);
      }
    } catch (err) {
      console.error('Error fetching inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: ContactSubmission['status']) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setInquiries(prev => prev.map(i => (i.id === id ? { ...i, status: newStatus } : i)));
      }
    } catch (err) {
      console.error('Error updating inquiry status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setInquiries(prev => prev.filter(i => i.id !== id));
      }
    } catch (err) {
      console.error('Error deleting inquiry:', err);
    } finally {
      setDeleteId(null);
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.phone?.includes(searchQuery) ||
      inq.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.subject?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Customer Inquiries & Messages
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            General inquiries, quote requests, and diagnostic questions submitted via the website.
          </p>
        </div>

        <button
          onClick={fetchInquiries}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-800 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search inquiries by name, message content, phone, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Inquiries</option>
            <option value="new">New / Unread</option>
            <option value="contacted">Contacted</option>
            <option value="resolved">Resolved</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Inquiries Cards Feed */}
      <div className="space-y-4">
        {filteredInquiries.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-xs">
            No customer inquiries found.
          </div>
        ) : (
          filteredInquiries.map((inq) => (
            <div
              key={inq.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-white">{inq.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    inq.status === 'new'
                      ? 'bg-blue-950 text-blue-400 border border-blue-800'
                      : inq.status === 'contacted'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : inq.status === 'resolved'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {inq.status}
                  </span>
                  {inq.propertyType && (
                    <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 capitalize">
                      {inq.propertyType}
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(inq.createdAt).toLocaleString()}
                </div>
              </div>

              {/* Subject & Body */}
              <div>
                {inq.subject && (
                  <h4 className="text-xs font-bold text-slate-200 mb-1">
                    Subject: {inq.subject}
                  </h4>
                )}
                <p className="text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800/80 leading-relaxed whitespace-pre-wrap">
                  {inq.message}
                </p>
              </div>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  {inq.phone && (
                    <a
                      href={`tel:${inq.phone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
                      <span>{inq.phone}</span>
                    </a>
                  )}

                  {inq.email && (
                    <a
                      href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.subject || 'QP HVAC Inquiry')}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
                    >
                      <Mail className="w-3.5 h-3.5 text-blue-400" />
                      <span>{inq.email}</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {inq.status !== 'contacted' && (
                    <button
                      onClick={() => handleStatusUpdate(inq.id, 'contacted')}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900 text-amber-300 text-xs font-bold border border-amber-800/80"
                    >
                      Mark Contacted
                    </button>
                  )}

                  {inq.status !== 'resolved' && (
                    <button
                      onClick={() => handleStatusUpdate(inq.id, 'resolved')}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-xs font-bold border border-emerald-800/80"
                    >
                      Mark Resolved
                    </button>
                  )}

                  <button
                    onClick={() => setDeleteId(inq.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400"
                    title="Delete Message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="font-bold text-white text-base">Delete Message?</h3>
            </div>
            <p className="text-xs text-slate-300">
              Are you sure you want to remove this inquiry? This cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
