import React, { Suspense } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BookingWizard } from '@/components/booking/BookingWizard';
import { APP_CONFIG } from '@/lib/config';
import { Calendar, PhoneCall, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Book an Appointment | Father & Son HVAC Scheduling',
  description: 'Book your heating, air conditioning, heat pump, or emergency service appointment online with QP HVAC. Direct scheduling with Jayson.',
  path: '/booking',
});

function BookingContent() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950 border border-blue-800 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Calendar className="w-3.5 h-3.5" />
              Online Dispatch Booking
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Schedule Your HVAC Service Call
            </h1>
            <p className="text-sm sm:text-base text-slate-400 mt-2">
              Reserve your preferred arrival window. Jayson will review the details and confirm directly.
            </p>
          </div>

          {/* Quick Perks Bar */}
          <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span>30-Min Arrival Call-Ahead</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Flat-Rate Diagnostic Guarantee</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>Stocked Van for Same-Day Repair</span>
            </div>
          </div>

          {/* Interactive Multi-step Wizard */}
          <BookingWizard />

          {/* Direct Urgent Call Box */}
          <div className="max-w-3xl mx-auto mt-10 p-6 rounded-2xl bg-red-950/40 border border-red-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-400">Complete Climate Failure?</span>
              <h4 className="text-base font-bold text-white mt-0.5">Need immediate emergency dispatch today?</h4>
              <p className="text-xs text-slate-300 mt-0.5">Call Jayson immediately on our direct mobile dispatch line.</p>
            </div>
            <a
              href={`tel:${APP_CONFIG.phone}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-lg transition-all flex-shrink-0"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call {APP_CONFIG.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Scheduler...</div>}>
      <BookingContent />
    </Suspense>
  );
}
