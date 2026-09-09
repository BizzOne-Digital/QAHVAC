import React from 'react';
import Link from 'next/link';
import { Hero } from '@/components/home/Hero';
import { DiagnosticTriage } from '@/components/home/DiagnosticTriage';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { Testimonials } from '@/components/home/Testimonials';
import { ServiceCard } from '@/components/services/ServiceCard';
import { BookingWizard } from '@/components/booking/BookingWizard';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { EmergencyBanner } from '@/components/layout/EmergencyBanner';
import { storage } from '@/lib/storage';
import { APP_CONFIG } from '@/lib/config';
import { ArrowRight, PhoneCall, Calendar, ShieldCheck, Flame, Snowflake, Wrench } from 'lucide-react';
import { generateHvacBusinessSchema } from '@/lib/seo';

export default function HomePage() {
  const services = storage.getServices(true);
  const settings = storage.getSettings();
  const jsonLd = generateHvacBusinessSchema();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Emergency Dispatch Banner */}
      {settings.emergencyBanner.enabled && (
        <EmergencyBanner headline={settings.emergencyBanner.headline} />
      )}

      {/* Navigation */}
      <Navbar />

      <main className="flex-1">
        {/* Hero with headline from user brief */}
        <Hero />

        {/* Featured Services Grid */}
        <section id="services-preview-section" className="py-20 bg-slate-950 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Wrench className="w-3.5 h-3.5" />
                  Heating, Cooling & Airflow Solutions
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                  Comprehensive HVAC Services
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl">
                  From emergency furnace diagnostic calls to whisper-quiet central cooling installations and eco-friendly heat pumps.
                </p>
              </div>

              <Link
                href="/services"
                id="view-all-services-link"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs border border-slate-700 transition-all self-start md:self-auto"
              >
                <span>View Full Service Catalog</span>
                <ArrowRight className="w-4 h-4 text-blue-400" />
              </Link>
            </div>

            {/* Service Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Symptom Diagnostic Tool */}
        <DiagnosticTriage />

        {/* Father & Son Values / Why Choose Us */}
        <WhyChooseUs />

        {/* Dedicated Fast Booking Section */}
        <section id="fast-booking-section" className="py-20 bg-slate-950 border-b border-slate-800 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950 border border-blue-800 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
                <Calendar className="w-3.5 h-3.5" />
                Easy Online Scheduling
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                Schedule Your Service Appointment
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                Select your service, choose a convenient arrival window, and Jayson will personally confirm your dispatch.
              </p>
            </div>

            {/* Multi-Step Wizard Embedded */}
            <BookingWizard />
          </div>
        </section>

        {/* Community Reviews & Testimonials */}
        <Testimonials />

        {/* Emergency Call-Out Strip */}
        <section className="bg-gradient-to-r from-slate-950 via-red-950 to-slate-950 text-white py-14 border-b border-red-900/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-red-400">Immediate Assistance</span>
              <h2 className="text-2xl sm:text-3xl font-black mt-1">Freezing Winter Night or Extreme Heatwave?</h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Don&apos;t wait until morning with vulnerable children or elderly family members. Our father-and-son team is equipped for emergency same-day dispatch.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a
                href={`tel:${APP_CONFIG.phone}`}
                id="emergency-strip-call-btn"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-base shadow-xl transition-all"
              >
                <PhoneCall className="w-5 h-5" />
                <span>Call Jayson: {APP_CONFIG.phoneDisplay}</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
