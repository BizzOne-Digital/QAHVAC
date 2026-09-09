'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { APP_CONFIG } from '@/lib/config';
import { Phone, Mail, Clock, MapPin, Send, CheckCircle2, AlertCircle, ShieldCheck, Flame } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyType: 'residential',
    subject: 'Service Inquiry / Diagnostic Request',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!formData.name.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter your name.' });
      return;
    }

    if (!formData.phone.trim() && !formData.email.trim()) {
      setStatusMessage({ type: 'error', text: 'Please provide either a phone number or email address.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit inquiry.');
      }

      setStatusMessage({
        type: 'success',
        text: 'Thank you for reaching out to QP HVAC! Your message has been routed to Jayson. We will get back to you promptly.',
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        propertyType: 'residential',
        subject: 'Service Inquiry / Diagnostic Request',
        message: '',
      });
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'An error occurred. Please call Jayson directly at (226) 926-3032.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-14 lg:py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
              Direct Community Communication
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Contact QP HVAC
            </h1>
            <p className="text-sm sm:text-base text-slate-400 mt-2">
              Speak directly with Jayson. No call center delays, no automated runaround.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left: Contact Info & Emergency Hotline Cards */}
            <div className="lg:col-span-5 space-y-6">
              {/* Emergency Call Box */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-red-950/80 via-slate-900 to-slate-950 border border-red-800/80 shadow-2xl">
                <div className="flex items-center gap-3 text-red-400 mb-3">
                  <Flame className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Urgent Emergency Hotline</span>
                </div>
                <h3 className="text-xl font-black text-white">No Heat or Sudden AC Failure?</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Call our direct mobile dispatch line for prioritized same-day service.
                </p>
                <div className="mt-4 pt-4 border-t border-red-900/60">
                  <a
                    href={`tel:${APP_CONFIG.phone}`}
                    id="contact-page-phone-btn"
                    className="inline-flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-base shadow-lg transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{APP_CONFIG.phoneDisplay}</span>
                  </a>
                </div>
              </div>

              {/* Direct Info Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                <h4 className="text-white font-bold text-sm uppercase tracking-wider">Business Details</h4>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-950 text-blue-400 border border-slate-800">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Direct Telephone</span>
                      <a href={`tel:${APP_CONFIG.phone}`} className="font-bold text-white hover:text-blue-400 text-sm">
                        {APP_CONFIG.phoneDisplay}
                      </a>
                      <span className="text-[10px] text-slate-500 block">Call or Text</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-950 text-blue-400 border border-slate-800">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Direct Email</span>
                      <a href={`mailto:${APP_CONFIG.email}`} className="font-bold text-white hover:text-blue-400 text-sm">
                        {APP_CONFIG.email}
                      </a>
                      <span className="text-[10px] text-slate-500 block">Responses within 2-4 hours</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-950 text-emerald-400 border border-slate-800">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Regular Operating Hours</span>
                      <div className="text-slate-200 font-medium">Mon - Fri: 7:00 AM - 8:00 PM</div>
                      <div className="text-slate-200 font-medium">Saturday: 8:00 AM - 6:00 PM</div>
                      <div className="text-slate-200 font-medium">Sunday: 9:00 AM - 4:00 PM</div>
                      <span className="text-[10px] text-red-400 font-bold block mt-1">24/7 Urgent Dispatch Available</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-950 text-red-400 border border-slate-800">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Service Area</span>
                      <div className="text-slate-200 font-medium">Greater Region & Surrounding Communities</div>
                      <span className="text-[10px] text-slate-500 block">Residential homes & commercial facilities</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Father & Son Assurance */}
              <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
                <ShieldCheck className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Personal Touch:</strong> When you send a message, Jayson reviews it directly. We do not sell your contact details or send automated spam.
                </p>
              </div>
            </div>

            {/* Right: Message / Inquiry Form */}
            <div className="lg:col-span-7">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
                <div className="border-b border-slate-800 pb-4 mb-6">
                  <h3 className="text-xl font-bold text-white">Send a Message or Request a Quote</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Fill out the details below and we will contact you promptly.
                  </p>
                </div>

                {statusMessage && (
                  <div
                    className={`p-4 rounded-xl mb-6 text-xs flex items-center gap-3 border ${
                      statusMessage.type === 'success'
                        ? 'bg-emerald-950/70 border-emerald-800 text-emerald-200'
                        : 'bg-red-950/70 border-red-800 text-red-200'
                    }`}
                  >
                    {statusMessage.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    )}
                    <span>{statusMessage.text}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Marcus Vance"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="226-555-0142"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        Property Type
                      </label>
                      <select
                        value={formData.propertyType}
                        onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="residential">Residential Home</option>
                        <option value="commercial">Commercial / Facility</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Furnace tune-up or Heat pump quote"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      How Can We Help Your Heating or Cooling System? *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Please let us know your system issue, equipment brand or what service you are looking for..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      id="contact-submit-btn"
                      className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl active:scale-[0.99] transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Sending to Jayson...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Message Directly</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
