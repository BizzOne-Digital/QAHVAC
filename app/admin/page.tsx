'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  Flame,
  Snowflake,
  MessageSquare,
  Wrench,
  ArrowRight,
  RefreshCw,
  UserCheck,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Booking, ContactSubmission, ServiceItem, SiteSettings } from '@/types';
import { APP_CONFIG } from '@/lib/config';

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inquiries, setInquiries] = useState<ContactSubmission[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
      if (data.success) {
        setBookings(prev => prev.map(b => (b.id === id ? { ...b, status: newStatus } : b)));
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const emergencyBookings = bookings.filter(b => b.urgency === 'emergency_today');
  const newInquiries = inquiries.filter(i => i.status === 'new');

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Executive Dispatch Dashboard
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[11px] font-bold border border-emerald-800">
              Live System
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time appointment schedule, customer inquiries, and equipment maintenance operations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-800 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link
            href="/admin/bookings"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Manage All Bookings</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Bookings */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Needs Confirmation</span>
            <div className="p-2 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-800/80">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-white">{pendingBookings.length}</span>
            <span className="text-xs text-amber-400 font-semibold ml-2">Pending Calls</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Awaiting technician arrival verification</p>
        </div>

        {/* Confirmed Dispatch */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Confirmed Jobs</span>
            <div className="p-2 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-white">{confirmedBookings.length}</span>
            <span className="text-xs text-emerald-400 font-semibold ml-2">Scheduled</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Slotted on master dispatch calendar</p>
        </div>

        {/* Urgent Emergency Requests */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Urgent Callouts</span>
            <div className="p-2 rounded-xl bg-red-950/80 text-red-400 border border-red-800/80">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-white">{emergencyBookings.length}</span>
            <span className="text-xs text-red-400 font-semibold ml-2">Emergency / Today</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">No-heat or AC down priority</p>
        </div>

        {/* Customer Inquiries */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">New Inquiries</span>
            <div className="p-2 rounded-xl bg-blue-950/80 text-blue-400 border border-blue-800/80">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-white">{newInquiries.length}</span>
            <span className="text-xs text-blue-400 font-semibold ml-2">Unread Messages</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Direct contact submissions</p>
        </div>
      </div>

      {/* Main Two-Column View: Priority Bookings & Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Bookings Queue */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-base text-white">Recent Service Requests</h3>
              <p className="text-xs text-slate-400">Incoming appointment bookings needing scheduling or dispatch action.</p>
            </div>
            <Link
              href="/admin/bookings"
              className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No appointments recorded yet. New requests from the website will appear here immediately.
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 5).map((bkg) => (
                <div
                  key={bkg.id}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-400">{bkg.referenceNumber}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        bkg.status === 'confirmed'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : bkg.status === 'pending'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : bkg.status === 'completed'
                          ? 'bg-blue-950 text-blue-400 border border-blue-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {bkg.status}
                      </span>
                      {bkg.urgency === 'emergency_today' && (
                        <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 text-[10px] font-bold border border-red-800 flex items-center gap-1">
                          <Flame className="w-3 h-3 text-red-400" />
                          URGENT
                        </span>
                      )}
                    </div>

                    <div className="font-bold text-sm text-white flex items-center gap-2">
                      <span>{bkg.customerName}</span>
                      <span className="text-slate-500 text-xs font-normal">({bkg.propertyType})</span>
                    </div>

                    <p className="text-xs text-slate-300 font-medium">{bkg.serviceName}</p>

                    <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-3 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {bkg.preferredDate} ({bkg.preferredTimeSlot})
                      </span>
                      <span>•</span>
                      <span>{bkg.address.city}, {bkg.address.street}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-2 flex-shrink-0">
                    <a
                      href={`tel:${bkg.phone}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-200 border border-slate-700"
                    >
                      <PhoneCall className="w-3 h-3 text-blue-400" />
                      <span>{bkg.phone}</span>
                    </a>

                    <div className="flex items-center gap-1.5">
                      {bkg.status === 'pending' && (
                        <button
                          onClick={() => handleQuickStatusChange(bkg.id, 'confirmed')}
                          disabled={updatingId === bkg.id}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all disabled:opacity-50"
                        >
                          Confirm
                        </button>
                      )}
                      {bkg.status === 'confirmed' && (
                        <button
                          onClick={() => handleQuickStatusChange(bkg.id, 'completed')}
                          disabled={updatingId === bkg.id}
                          className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition-all disabled:opacity-50"
                        >
                          Mark Completed
                        </button>
                      )}
                      <Link
                        href={`/admin/bookings`}
                        className="p-1 rounded text-slate-400 hover:text-white"
                        title="View Full Details"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Inquiries & Emergency Controls */}
        <div className="lg:col-span-4 space-y-6">
          {/* Emergency Alert Status Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                Emergency Banner Status
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                settings?.emergencyBanner.enabled ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-slate-800 text-slate-400'
              }`}>
                {settings?.emergencyBanner.enabled ? 'Active on Public Site' : 'Disabled'}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Hotline Banner currently routes urgent calls directly to Jayson: <strong className="text-white">{APP_CONFIG.phoneDisplay}</strong>
            </p>
            <Link
              href="/admin/settings"
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:underline pt-1"
            >
              <span>Edit Emergency Broadcast Settings</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Recent Inquiries List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">Recent Customer Messages</h3>
              <Link href="/admin/inquiries" className="text-xs text-blue-400 font-bold hover:underline">
                View All
              </Link>
            </div>

            {inquiries.length === 0 ? (
              <div className="py-6 text-center text-slate-500 text-xs">No inquiries yet.</div>
            ) : (
              <div className="space-y-3">
                {inquiries.slice(0, 3).map((inq) => (
                  <div key={inq.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">{inq.name}</span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{inq.message}</p>
                    <div className="pt-1 flex items-center justify-between text-[10px]">
                      <span className="text-slate-500">{inq.phone || inq.email}</span>
                      <Link href="/admin/inquiries" className="text-blue-400 font-semibold hover:underline">
                        Reply
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
