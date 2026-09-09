import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ServicesCatalog } from '@/components/services/ServicesCatalog';
import { storage } from '@/lib/storage';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Heating, Cooling & Heat Pump Services | QP HVAC',
  description: 'Comprehensive HVAC solutions for residential homeowners and commercial facilities. Upfront pricing, factory diagnostics, and precision craftsmanship.',
  path: '/services',
});

export default function ServicesPage() {
  const allServices = storage.getServices(true);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
              Professional HVAC Solutions
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Heating & Cooling Services
            </h1>
            <p className="text-sm sm:text-base text-slate-400 mt-3 leading-relaxed">
              Every home and commercial building is unique. We provide honest diagnostics, upfront pricing,
              and precision father-and-son craftsmanship across all major climate control brands.
            </p>
          </div>

          {/* Interactive Catalog with Category Filters */}
          <ServicesCatalog initialServices={allServices} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
