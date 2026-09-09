import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { storage } from '@/lib/storage';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BookingWizard } from '@/components/booking/BookingWizard';
import { APP_CONFIG } from '@/lib/config';
import { ArrowLeft, CheckCircle2, ShieldCheck, Clock, DollarSign, Wrench, PhoneCall, AlertTriangle } from 'lucide-react';
import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const service = storage.getServiceBySlug(slug);

  if (!service) {
    return buildMetadata({ title: 'Service Details', noIndex: true });
  }

  return buildMetadata({
    title: service.title,
    description: service.shortDesc,
    path: `/services/${service.slug}`,
    image: service.image,
  });
}

export default async function ServiceDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const service = storage.getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Back Link */}
          <div className="mb-8">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to All Services
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Service Details */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 rounded-full bg-blue-950 border border-blue-800 text-blue-400 text-xs font-bold uppercase tracking-wider">
                    {service.category.replace('-', ' ')}
                  </span>
                  {service.emergencyAvailable && (
                    <span className="px-3 py-1 rounded-full bg-red-950 border border-red-800 text-red-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      24/7 Rapid Response
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  {service.title}
                </h1>
                <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
                  {service.fullDesc}
                </p>
              </div>

              {/* Service Hero Image */}
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  priority
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              </div>

              {/* Specs & Features Checklist */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-blue-400" />
                  What Our Craftsman Service Includes
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-slate-300">
                  {service.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Upfront Pricing Transparency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    Upfront Pricing Guide
                  </div>
                  <div className="text-white font-black text-base">{service.priceEstimate}</div>
                  <p className="text-[11px] text-slate-400 mt-1">Exact quote provided prior to performing work.</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
                    <Clock className="w-4 h-4 text-blue-400" />
                    Estimated Duration
                  </div>
                  <div className="text-white font-black text-base">{service.durationEstimate}</div>
                  <p className="text-[11px] text-slate-400 mt-1">We call 30 minutes before arrival.</p>
                </div>
              </div>

              {/* Father & Son Guarantee Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-blue-900/50 flex items-start gap-4">
                <ShieldCheck className="w-8 h-8 text-blue-400 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-bold text-sm">Personal Father & Son Warranty</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    We stand behind all repair parts and replacement units with manufacturer warranty protection plus our 100% craftsmanship guarantee. If something isn&apos;t running right, Jayson will personally return and make it right.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Direct Appointment Booking Scheduler */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 space-y-6">
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl">
                  <div className="border-b border-slate-800 pb-4 mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Instant Dispatch Scheduling</span>
                    <h3 className="text-xl font-bold text-white mt-1">Schedule This Service</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Quick booking directly with Jayson.</p>
                  </div>

                  {/* Pre-fill with this service name */}
                  <BookingWizard initialService={service.title} />
                </div>

                {/* Direct Call Fallback */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Prefer to talk directly?</span>
                    <span className="text-white font-bold text-sm">Call Jayson anytime</span>
                  </div>
                  <a
                    href={`tel:${APP_CONFIG.phone}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    {APP_CONFIG.phoneDisplay}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
