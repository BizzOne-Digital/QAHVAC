import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, HeartHandshake, Wrench, CheckCircle, Clock, Award, ArrowRight } from 'lucide-react';

export function WhyChooseUs() {
  return (
    <section id="why-choose-qp-hvac" className="py-20 bg-slate-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Image with craftsmanship overlay */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 aspect-[4/5]">
              <Image
                src="https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=1200&auto=format&fit=crop"
                alt="HVAC craftsman working on precision climate equipment"
                fill
                referrerPolicy="no-referrer"
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-red-950 text-red-400 border border-red-900/60">
                    <HeartHandshake className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-black text-sm">Father & Son Direct Care</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Every service call is personal.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Values & Differentiators */}
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              The QP HVAC Difference
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              Why Homeowners & Businesses Trust Our Family Over Corporate Franchises
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              When you call QP HVAC, you speak directly with Jayson. You won&apos;t be routed to an overseas call center
              or pressured by commissioned salespeople pushing equipment you don&apos;t need.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-blue-950 text-blue-400 flex items-center justify-center mb-3">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-white">Honest Upfront Pricing</h4>
                <p className="text-xs text-slate-400 mt-1">
                  We provide flat diagnostic pricing before we begin work. No hidden trip surcharges or surprise billing.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center mb-3">
                  <Wrench className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-white">Repair First Philosophy</h4>
                <p className="text-xs text-slate-400 mt-1">
                  If a furnace or AC can be repaired reliably and safely, we fix it. We only recommend replacements when mathematically sensible.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-red-950 text-red-400 flex items-center justify-center mb-3">
                  <Clock className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-white">24/7 Rapid Emergency Care</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Severe freezes or summer heatwaves don&apos;t follow 9-to-5 hours. Our service truck is stocked for same-day recovery.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-amber-950 text-amber-400 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-white">Workmanship Guarantee</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Our family name is on the line with every install, pipe connection, and wire crimp. We stand behind our work 100%.
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
              >
                <span>Read our full father and son story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
