import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, PhoneCall, ShieldCheck, Flame, Snowflake, Star, CheckCircle, ArrowRight, Activity, Gauge } from 'lucide-react';
import { APP_CONFIG } from '@/lib/config';

export function Hero() {
  return (
    <section id="hero-section" className="relative overflow-hidden bg-[#07090e] text-white pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-white/[0.08]">
      {/* Precision Ambient Atmosphere (restrained, deep obsidian and subtle thermal glow) */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[350px] bg-sky-950/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[500px] h-[300px] bg-rose-950/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Subtle architectural grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Brand Manifesto, Headline, and CTAs */}
          <div className="lg:col-span-7 space-y-7">
            {/* Architectural Heritage Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-white/10 text-xs font-medium text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20 animate-pulse" />
              <span className="text-white font-bold tracking-wider font-display">QP HVAC</span>
              <span className="text-zinc-600">/</span>
              <span className="text-zinc-300 tracking-wide text-[11px] uppercase font-semibold">Master Family Craftsmanship</span>
            </div>

            {/* Headline with High-Contrast Editorial Hierarchy (NO generic gradient text) */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-[3.4rem] font-black tracking-tight text-white font-display leading-[1.08]">
                Family Values, Professional Comfort.
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl font-light text-zinc-400 font-display tracking-tight leading-snug">
                Father and Son keeping your home&apos;s heating and cooling running at its best.
              </p>
            </div>

            {/* Authentic Narrative Statement */}
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl font-normal">
              We are dedicated to providing our community with honest pricing, reliable service, and professional
              craftsmanship you can count on. For us, every service call is personal, and we treat your home&apos;s
              comfort exactly like we would our own.
            </p>

            {/* Action Group: Luminous Primary + Tactile Secondary */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                href="/booking"
                id="hero-book-appointment-btn"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-sm tracking-tight shadow-[0_4px_20px_rgba(255,255,255,0.12)] transition-all active:scale-[0.98]"
              >
                <Calendar className="w-4 h-4 text-zinc-900" />
                <span>Book Service Appointment</span>
                <ArrowRight className="w-4 h-4 ml-0.5 text-zinc-700" />
              </Link>

              <a
                href={`tel:${APP_CONFIG.phone}`}
                id="hero-call-jayson-btn"
                className="inline-flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-white font-medium text-sm border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <PhoneCall className="w-3.5 h-3.5" />
                </div>
                <div className="text-left leading-none">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-semibold">Speak Directly With Jayson</span>
                  <span className="font-bold text-xs sm:text-sm text-white tracking-tight mt-0.5">{APP_CONFIG.phoneDisplay}</span>
                </div>
              </a>
            </div>

            {/* Precision Standards Guarantee */}
            <div className="pt-6 border-t border-white/[0.08] grid grid-cols-3 gap-3 text-xs text-zinc-300">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-white font-semibold text-xs">
                  <CheckCircle className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                  <span>No Commissions</span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-tight">We fix before we replace</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-white font-semibold text-xs">
                  <CheckCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                  <span>Binding Upfront Quotes</span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-tight">Zero surprise diagnostic fees</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-white font-semibold text-xs">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Gas & Ref. Certified</span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-tight">Father & son master licensed</p>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Photography & Mechanical Telemetry Card */}
          <div className="lg:col-span-5 relative">
            {/* Technical Frame with Corner Precision Marks */}
            <div className="relative rounded-2xl p-2 bg-gradient-to-b from-white/10 to-white/[0.02] border border-white/10 shadow-2xl">
              {/* Corner crosshairs */}
              <div className="absolute -top-1.5 -left-1.5 text-zinc-600 text-xs font-mono select-none">+</div>
              <div className="absolute -top-1.5 -right-1.5 text-zinc-600 text-xs font-mono select-none">+</div>
              <div className="absolute -bottom-1.5 -left-1.5 text-zinc-600 text-xs font-mono select-none">+</div>
              <div className="absolute -bottom-1.5 -right-1.5 text-zinc-600 text-xs font-mono select-none">+</div>

              <div className="relative rounded-xl overflow-hidden aspect-[4/3] sm:aspect-[16/11] bg-zinc-950">
                <Image
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200&auto=format&fit=crop"
                  alt="QP HVAC Master Technician Precision Inspection"
                  fill
                  priority
                  referrerPolicy="no-referrer"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-black/20" />

                {/* Top Corner Discrete Engineering Badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-zinc-950/80 border border-white/10 text-[10px] font-semibold text-zinc-300 flex items-center gap-1.5 backdrop-blur-md">
                  <Flame className="w-3 h-3 text-rose-400" />
                  <span>Heating</span>
                  <span className="text-zinc-600">•</span>
                  <Snowflake className="w-3 h-3 text-sky-400" />
                  <span>Cooling</span>
                </div>
              </div>

              {/* Architectural Telemetry Box */}
              <div className="mt-2 p-3.5 rounded-xl bg-zinc-950/90 border border-white/[0.08] backdrop-blur-md flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-sky-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      Direct Technician Access
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">Jayson coordinates every dispatch personally</div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-0.5 text-amber-400 justify-end">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Verified 5.0 Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Engineering Performance Strip */}
        <div className="mt-14 pt-8 border-t border-white/[0.08] grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-white font-display">100%</div>
            <div className="text-xs font-semibold text-zinc-300">Family Dispatch</div>
            <div className="text-[11px] text-zinc-500">Zero anonymous subcontractors</div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-white font-display">±0.5°F</div>
            <div className="text-xs font-semibold text-zinc-300">Thermal Calibration</div>
            <div className="text-[11px] text-zinc-500">Scientific airflow & refrigerant balancing</div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-white font-display">$0</div>
            <div className="text-xs font-semibold text-zinc-300">Hidden Fees</div>
            <div className="text-[11px] text-zinc-500">Transparent upfront pricing before tool touches equipment</div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-white font-display">24/7</div>
            <div className="text-xs font-semibold text-zinc-300">Emergency Readiness</div>
            <div className="text-[11px] text-zinc-500">Fully-stocked mobile diagnostic vans on call</div>
          </div>
        </div>
      </div>
    </section>
  );
}
