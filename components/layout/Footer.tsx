import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, ShieldCheck, Wrench, Clock, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { APP_CONFIG } from '@/lib/config';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="site-footer" className="bg-slate-950 text-slate-400 border-t border-slate-800/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Feature Proof Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 mb-12 border-b border-slate-800">
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <div className="p-2.5 rounded-lg bg-blue-950/60 text-blue-400 border border-blue-900/50">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Father & Son Family Values</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Every service call is personal. We treat your home comfort exactly like our own.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <div className="p-2.5 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-900/50">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Honest Upfront Pricing</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                No high-pressure sales, no surprise hidden fees. Transparent diagnostics before work begins.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <div className="p-2.5 rounded-lg bg-red-950/60 text-red-400 border border-red-900/50">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Precision Craftsmanship</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Gas certified, refrigerant licensed, and dedicated to flawless safety & airflow balancing.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Company Brand Column */}
          <div className="space-y-4">
            <BrandLogo variant="light" />
            <p className="text-xs leading-relaxed text-slate-300">
              Dedicated to providing our community with honest pricing, dependable service, and genuine craftsmanship.
              Keeping your heating and cooling running at its peak efficiency.
            </p>
            <div className="pt-2 text-xs text-slate-400 flex flex-col gap-1.5">
              <span className="flex items-center gap-2 text-white font-medium">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                Co-Founder: Jayson
              </span>
              <span className="flex items-center gap-2 text-white font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Residential & Commercial Heating & Cooling
              </span>
            </div>
          </div>

          {/* Core Services Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Heating & Cooling</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/services/furnace-heating-repair-installation" className="hover:text-blue-400 transition-colors">
                  High-Efficiency Furnace Installation
                </Link>
              </li>
              <li>
                <Link href="/services/air-conditioning-cooling" className="hover:text-blue-400 transition-colors">
                  Central Air Conditioning & AC Repairs
                </Link>
              </li>
              <li>
                <Link href="/services/cold-climate-heat-pumps" className="hover:text-blue-400 transition-colors">
                  Cold-Climate Heat Pumps & Mini-Splits
                </Link>
              </li>
              <li>
                <Link href="/services/emergency-24-7-repair" className="hover:text-red-400 transition-colors text-red-300 font-semibold">
                  24/7 Urgent Emergency Heating & AC Dispatch
                </Link>
              </li>
              <li>
                <Link href="/services/seasonal-tuneup-maintenance" className="hover:text-blue-400 transition-colors">
                  21-Point Seasonal Tune-Up & Safety Audit
                </Link>
              </li>
              <li>
                <Link href="/services/commercial-hvac-services" className="hover:text-blue-400 transition-colors">
                  Commercial HVAC & Rooftop RTU Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Pages */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Navigation</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Our Story & Father-and-Son Team
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Complete Service Directory
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-blue-400 font-semibold text-white transition-colors">
                  Book Service Appointment
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact & Emergency Hotline
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-slate-500 hover:text-slate-400 transition-colors">
                  Technician Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Contact */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Contact Directly</h3>
            <div className="space-y-3 text-xs">
              <a
                href={`tel:${APP_CONFIG.phone}`}
                className="flex items-start gap-3 text-slate-200 hover:text-blue-400 transition-colors group"
              >
                <Phone className="w-4 h-4 text-blue-400 mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-slate-400 text-[11px]">Direct Phone (Call or Text)</div>
                  <div className="font-bold text-white text-sm">{APP_CONFIG.phoneDisplay}</div>
                </div>
              </a>

              <a
                href={`mailto:${APP_CONFIG.email}`}
                className="flex items-start gap-3 text-slate-200 hover:text-blue-400 transition-colors group"
              >
                <Mail className="w-4 h-4 text-blue-400 mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-slate-400 text-[11px]">Direct Email</div>
                  <div className="font-medium text-white">{APP_CONFIG.email}</div>
                </div>
              </a>

              <div className="flex items-start gap-3 text-slate-300">
                <MapPin className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-slate-400 text-[11px]">Service Region</div>
                  <div>Residential & Commercial Dispatch Throughout Community</div>
                </div>
              </div>

              <div className="flex items-start gap-3 text-slate-300">
                <Clock className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-slate-400 text-[11px]">Regular Hours</div>
                  <div>Mon-Fri: 7am-8pm | Sat: 8am-6pm | Sun: 9am-4pm</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 mt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-xs text-slate-300 gap-4">
          <p>© {currentYear} QP HVAC. All rights reserved. Owned and operated by Jayson & Family.</p>
          <div className="flex items-center gap-6">
            <span>Licensed Gas & Refrigeration Technicians</span>
            <span>•</span>
            <Link href="/booking" className="text-blue-400 hover:underline">
              Schedule Service
            </Link>
            <span>•</span>
            <Link href="/admin/login" className="text-slate-300 hover:text-white">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
