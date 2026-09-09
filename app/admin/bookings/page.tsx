'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Search,
  Filter,
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Flame,
  Trash2,
  Eye,
  X,
  UserCheck,
  Save,
  Wrench,
  AlertTriangle
} from 'lucide-react';
import { Booking } from '@/types';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editStatus, setEditStatus] = useState<Booking['status']>('pending');
  const [editTechNotes, setEditTechNotes] = useState('');
  const [editAssignedTech, setEditAssignedTech] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (data.success) {
        setBookings(data.data);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const openDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditStatus(booking.status);
    setEditTechNotes(booking.technicianNotes || '');
    setEditAssignedTech(booking.assignedTechnician || 'Jayson (Lead Craftsman)');
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
      if (data.success) {
        setBookings(prev => prev.map(b => (b.id === selectedBooking.id ? data.data : b)));
        setSelectedBooking(data.data);
      }
    } catch (err) {
      console.error('Error updating booking:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setBookings(prev => prev.filter(b => b.id !== id));
        if (selectedBooking?.id === id) setSelectedBooking(null);
      }
    } catch (err) {
      console.error('Error deleting booking:', err);
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.includes(searchQuery) ||
      b.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesUrgency = urgencyFilter === 'all' || b.urgency === urgencyFilter;

    return matchesSearch && matchesStatus && matchesUrgency;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Appointments & Dispatch Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review service calls, confirm dispatch slots, and manage technician assignments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Total Bookings:</span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono font-bold text-xs">
            {bookings.length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4">
        {/* Search Input */}
        <div className="relative w-full md:flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by customer name, phone, ref#, service, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Urgency Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">Urgency:</span>
          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="w-full md:w-auto bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Urgencies</option>
            <option value="emergency_today">Emergency / Today</option>
            <option value="within_48_hours">Within 48 Hours</option>
            <option value="flexible">Flexible / Routine</option>
          </select>
        </div>
      </div>

      {/* Bookings Table / List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Ref & Customer</th>
                <th className="py-3.5 px-4">Service Requested</th>
                <th className="py-3.5 px-4">Date & Window</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Status / Urgency</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No appointments match the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-[11px] font-bold text-blue-400">
                        {b.referenceNumber}
                      </div>
                      <div className="font-bold text-white text-sm">{b.customerName}</div>
                      <div className="text-slate-400 text-[11px]">{b.phone}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-200 block">{b.serviceName}</span>
                      <span className="text-[11px] text-slate-400 capitalize">{b.propertyType}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-200 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {b.preferredDate}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {b.preferredTimeSlot}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-300 font-medium">{b.address.city}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">{b.address.street}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          b.status === 'confirmed'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : b.status === 'pending'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : b.status === 'completed'
                            ? 'bg-blue-950 text-blue-400 border border-blue-800'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {b.status}
                        </span>

                        {b.urgency === 'emergency_today' && (
                          <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-400 text-[10px] font-bold border border-red-800 flex items-center gap-1">
                            <Flame className="w-3 h-3 text-red-400" /> Emergency
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openDetails(b)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                          title="View & Edit Booking"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(b.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400"
                          title="Delete Booking"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="font-bold text-white text-base">Delete Appointment?</h3>
            </div>
            <p className="text-xs text-slate-300">
              Are you sure you want to delete this booking record? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteBooking(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details / Edit Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto my-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="font-mono text-xs font-bold text-blue-400">
                  {selectedBooking.referenceNumber}
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  {selectedBooking.customerName}
                </h3>
                <p className="text-xs text-slate-400">
                  Booked on {new Date(selectedBooking.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Location Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-slate-400 uppercase tracking-wider block">Customer Contact</span>
                <div className="flex items-center gap-2 text-white font-medium">
                  <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
                  <a href={`tel:${selectedBooking.phone}`} className="hover:underline">{selectedBooking.phone}</a>
                </div>
                {selectedBooking.email && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    <span>{selectedBooking.email}</span>
                  </div>
                )}
                <div className="text-slate-400">
                  Property: <span className="text-white capitalize font-semibold">{selectedBooking.propertyType}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-slate-400 uppercase tracking-wider block">Dispatch Address</span>
                <div className="flex items-start gap-2 text-white font-medium">
                  <MapPin className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>
                    {selectedBooking.address.street}
                    <br />
                    {selectedBooking.address.city}, {selectedBooking.address.postalCode}
                  </span>
                </div>
              </div>
            </div>

            {/* Service & Equipment Description */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider block">Service & Issue Details</span>
              <div className="text-sm font-bold text-white">{selectedBooking.serviceName}</div>
              <div className="text-slate-300">
                <strong>Equipment:</strong> {selectedBooking.equipmentBrand || 'Not specified'} • <strong>Age:</strong> {selectedBooking.equipmentAge || 'Not specified'}
              </div>
              <div className="text-slate-300 mt-2 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                <strong>Symptoms / Issue:</strong>
                <p className="mt-1 text-slate-200">{selectedBooking.issueDescription || 'None described'}</p>
              </div>
            </div>

            {/* Technician Dispatch Controls */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Dispatch & Technician Controls</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Appointment Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as Booking['status'])}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Assigned Technician</label>
                  <input
                    type="text"
                    value={editAssignedTech}
                    onChange={(e) => setEditAssignedTech(e.target.value)}
                    placeholder="e.g. Jayson (Lead Craftsman)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Technician Notes & Parts Dispatched</label>
                <textarea
                  rows={3}
                  value={editTechNotes}
                  onChange={(e) => setEditTechNotes(e.target.value)}
                  placeholder="e.g. Customer reported flame sensor error. Bringing universal hot surface ignitor and draft inducer..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
                >
                  Close
                </button>
                <button
                  onClick={handleUpdateBooking}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow transition-all disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Save Updates'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
