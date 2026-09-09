import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { storage } from '@/lib/storage';
import { APP_CONFIG } from '@/lib/config';
import { ShieldCheck, HeartHandshake, CheckCircle2, Award, Wrench, PhoneCall, Calendar, Flame, Snowflake } from 'lucide-react';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'About Us | Father & Son HVAC Craftsmanship',
  description: 'Learn about QP HVAC. Dedicated to providing our community with honest pricing, reliable service, and professional craftsmanship you can count on.',
  path: '/about',
});

export default function AboutPage() {
  const settings = storage.getSettings();

  const brandNames = [
    'Carrier',
    'Trane',
    'Lennox',
    'Daikin',
    'Mitsubishi Electric',
    'Rheem',
    'Goodman',
    'Keeprite',
    'Napoleon',
    'York',
    'Bosch',
    'Fujitsu',
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
              <HeartHandshake className="w-3.5 h-3.5" />
              Our Family Story & Philosophy
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Father & Son Keeping Your Home&apos;s Comfort Running at Its Best
            </h1>
            <p className="text-base text-slate-300 mt-4 leading-relaxed">
              {settings.aboutStory}
            </p>
          </div>

          {/* Main Story Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                For Us, Every Service Call Is Personal
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {settings.fatherSonPhilosophy}
              </p>
              <p className="text-sm text-slate-400 leading-relaxed">
                Whether diagnosing an intermittent furnace flame failure during a blizzard, tuning a central air conditioning unit before summer arrives, or calculating the precise heat loss of a two-story home for a modern cold-climate heat pump, we take the time to do the job properly.
              </p>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <h3 className="text-white font-bold text-sm">The 4 Core Promises of QP HVAC:</h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Honest Diagnostic Pricing:</strong> You will know the exact cost before we touch a tool. No surprises.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Repair First, Replace Second:</strong> We never push unneeded replacements to hit sales quotas.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Clean Jobsite Respect:</strong> Shoe covers, protective drop cloths, and spotless cleanup in every mechanical room.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Direct Accountability:</strong> Jayson is always one direct phone call away.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 aspect-[4/3]">
                <Image
                  src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=1200&auto=format&fit=crop"
                  alt="HVAC technicians working together with precision tools"
                  fill
                  priority
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-blue-400 uppercase font-bold tracking-wider block">Lead Craftsman</span>
                    <span className="text-white font-bold text-sm">Jayson & Family Team</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-300 bg-slate-900 px-3 py-1 rounded border border-slate-800">
                    Licensed & Insured
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Credentials and Certifications Strip */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-10 mb-20">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-white">Professional Licenses & Certifications</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Strict safety compliance, gas licensing, and technical standards you can depend on.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="w-10 h-10 rounded-lg bg-blue-950 text-blue-400 flex items-center justify-center mx-auto mb-3">
                  <Flame className="w-5 h-5 text-red-400" />
                </div>
                <h4 className="text-white font-bold text-sm">Gas Technician Certified</h4>
                <p className="text-[11px] text-slate-400 mt-1">Licensed for natural gas & propane heating appliances and safety venting.</p>
              </div>

              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="w-10 h-10 rounded-lg bg-blue-950 text-blue-400 flex items-center justify-center mx-auto mb-3">
                  <Snowflake className="w-5 h-5 text-blue-400" />
                </div>
                <h4 className="text-white font-bold text-sm">Refrigerant Handling</h4>
                <p className="text-[11px] text-slate-400 mt-1">ODP / EPA certified for eco-friendly refrigerant leak checks and system charging.</p>
              </div>

              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="w-10 h-10 rounded-lg bg-blue-950 text-blue-400 flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <h4 className="text-white font-bold text-sm">Comprehensive Liability</h4>
                <p className="text-[11px] text-slate-400 mt-1">Full commercial and residential liability insurance covering your property 100%.</p>
              </div>

              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="w-10 h-10 rounded-lg bg-blue-950 text-blue-400 flex items-center justify-center mx-auto mb-3">
                  <Award className="w-5 h-5 text-amber-400" />
                </div>
                <h4 className="text-white font-bold text-sm">Factory Authorized</h4>
                <p className="text-[11px] text-slate-400 mt-1">Trained on warranty maintenance protocols for all major manufacturer platforms.</p>
              </div>
            </div>
          </div>

          {/* Brands Serviced */}
          <div className="mb-20 text-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
              Major Heating & Cooling Equipment Brands We Service & Install
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
              {brandNames.map((brand) => (
                <span
                  key={brand}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-xs hover:border-slate-700 transition-colors"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>

          {/* CTA Banner */}
          <div className="text-center bg-gradient-to-r from-blue-950 via-slate-900 to-red-950 border border-slate-800 rounded-3xl p-10 sm:p-14 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-black text-white">Experience Honest Craftsmanship Today</h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-lg mx-auto">
              Book your seasonal tune-up, diagnostic service, or new system quote online, or speak directly with Jayson.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/booking"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Service Appointment</span>
              </Link>
              <a
                href={`tel:${APP_CONFIG.phone}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700 transition-all"
              >
                <PhoneCall className="w-4 h-4 text-red-400" />
                <span>Call Jayson: {APP_CONFIG.phoneDisplay}</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
