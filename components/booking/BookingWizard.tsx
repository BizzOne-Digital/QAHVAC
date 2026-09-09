'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Home,
  Building2,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Flame,
  Snowflake,
  ShieldCheck,
  PhoneCall,
  Wrench,
  Sparkles
} from 'lucide-react';
import { PropertyType, BookingUrgency } from '@/types';
import { APP_CONFIG } from '@/lib/config';

interface BookingWizardProps {
  initialService?: string;
  onSuccess?: (referenceNumber: string) => void;
}

export function BookingWizard({ initialService = 'High-Efficiency Furnace & Heating Systems' }: BookingWizardProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<{
    referenceNumber: string;
    customerName: string;
    preferredDate: string;
    preferredTimeSlot: string;
    serviceName: string;
  } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    propertyType: 'residential' as PropertyType,
    serviceName: initialService,
    urgency: 'standard' as BookingUrgency,
    equipmentAge: '5-10 years',
    issueDescription: '',
    preferredDate: '',
    preferredTimeSlot: 'Morning (8:00 AM - 12:00 PM)',
    customerName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
  });

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    setFormData(prev => (prev.preferredDate ? prev : { ...prev, preferredDate: dateStr }));
  }, []);

  const availableServices = [
    {
      name: 'High-Efficiency Furnace & Heating Systems',
      category: 'heating',
      icon: Flame,
      color: 'text-red-500',
      badge: 'Winter Warmth',
      desc: 'No-heat diagnosis, burner repair, safety inspection & replacements',
    },
    {
      name: 'Precision Air Conditioning & Central Air',
      category: 'cooling',
      icon: Snowflake,
      color: 'text-blue-500',
      badge: 'Summer Cooling',
      desc: 'Refrigerant leak detection, coil cleaning, condenser replacement',
    },
    {
      name: 'Cold-Climate Heat Pumps & Ductless Mini-Splits',
      category: 'heat-pump',
      icon: Sparkles,
      color: 'text-emerald-500',
      badge: 'High Rebate Eligible',
      desc: 'Year-round dual climate, cold-climate inverter installations',
    },
    {
      name: '24/7 Rapid Emergency Heating & Cooling Dispatch',
      category: 'emergency',
      icon: AlertCircle,
      color: 'text-red-600',
      badge: 'Urgent Same-Day',
      desc: 'Immediate emergency restoration for complete climate failures',
    },
    {
      name: '21-Point Seasonal HVAC Tune-Up & Safety Audit',
      category: 'maintenance',
      icon: Wrench,
      color: 'text-amber-500',
      badge: '$129 Special',
      desc: 'Prevent sudden breakdowns, clean electrical contacts, optimize airflow',
    },
    {
      name: 'Commercial HVAC & Light Industrial Solutions',
      category: 'commercial',
      icon: Building2,
      color: 'text-slate-400',
      badge: 'Business Priority',
      desc: 'Rooftop RTU package units, commercial maintenance agreements',
    },
  ];

  const timeSlots = [
    'Morning (8:00 AM - 12:00 PM)',
    'Early Afternoon (12:00 PM - 3:00 PM)',
    'Late Afternoon (3:00 PM - 6:00 PM)',
    'Evening Urgent Callout (6:00 PM - 9:00 PM)',
  ];

  const handleNext = () => {
    setErrorMessage(null);
    if (step === 1) {
      if (!formData.serviceName) {
        setErrorMessage('Please select an HVAC service.');
        return;
      }
    } else if (step === 2) {
      if (!formData.issueDescription.trim()) {
        setErrorMessage('Please provide a brief description of what your system is doing or what service you need.');
        return;
      }
    } else if (step === 3) {
      if (!formData.preferredDate) {
        setErrorMessage('Please select your preferred date.');
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setErrorMessage(null);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Final validation
    if (!formData.customerName.trim()) {
      setErrorMessage('Please provide your full name.');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('Please provide your direct phone number.');
      return;
    }
    if (!formData.street.trim() || !formData.city.trim()) {
      setErrorMessage('Please provide your service street address and city.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customerName: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        propertyType: formData.propertyType,
        serviceName: formData.serviceName,
        serviceId: 'srv-' + formData.serviceName.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 15),
        preferredDate: formData.preferredDate,
        preferredTimeSlot: formData.preferredTimeSlot,
        urgency: formData.urgency,
        address: {
          street: formData.street,
          city: formData.city,
          postalCode: formData.postalCode,
        },
        equipmentAge: formData.equipmentAge,
        issueDescription: formData.issueDescription,
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit appointment request.');
      }

      setBookingSuccess({
        referenceNumber: data.data.referenceNumber,
        customerName: data.data.customerName,
        preferredDate: data.data.preferredDate,
        preferredTimeSlot: data.data.preferredTimeSlot,
        serviceName: data.data.serviceName,
      });
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'An error occurred while booking. Please call Jayson directly at (226) 926-3032.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success Confirmation Screen
  if (bookingSuccess) {
    return (
      <div id="booking-success-card" className="bg-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-10 shadow-2xl text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
          Request Confirmed & Dispatched
        </span>

        <h3 className="text-2xl sm:text-3xl font-black text-white mt-4 tracking-tight">
          Thank You, {bookingSuccess.customerName}
        </h3>

        <p className="text-slate-300 text-sm mt-2 max-w-md mx-auto">
          Your appointment request has been securely logged in our dispatch schedule. Jayson or our team will review the details and reach out to confirm arrival time.
        </p>

        {/* Reference summary box */}
        <div className="bg-slate-950 rounded-xl p-5 my-6 border border-slate-800 text-left grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-500 font-medium uppercase tracking-wider block text-[10px]">Reference Number</span>
            <span className="text-blue-400 font-mono font-bold text-base">{bookingSuccess.referenceNumber}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium uppercase tracking-wider block text-[10px]">Requested Date</span>
            <span className="text-white font-semibold text-sm">{bookingSuccess.preferredDate}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium uppercase tracking-wider block text-[10px]">Window</span>
            <span className="text-slate-200 font-medium">{bookingSuccess.preferredTimeSlot}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium uppercase tracking-wider block text-[10px]">Service</span>
            <span className="text-slate-200 font-medium truncate block">{bookingSuccess.serviceName}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <a
            href={`tel:${APP_CONFIG.phone}`}
            id="success-call-jayson-btn"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition-all"
          >
            <PhoneCall className="w-4 h-4" />
            Speak Directly with Jayson: {APP_CONFIG.phoneDisplay}
          </a>
          <button
            onClick={() => {
              setBookingSuccess(null);
              setStep(1);
            }}
            id="book-another-appointment-btn"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all"
          >
            Book Another Visit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="booking-appointment-wizard" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl max-w-3xl mx-auto">
      {/* Step Indicator Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-3">
          <span className="text-blue-400 uppercase tracking-wider">Step {step} of 4</span>
          <span className="text-slate-300">
            {step === 1 && 'Select HVAC Service'}
            {step === 2 && 'System & Issue Details'}
            {step === 3 && 'Schedule Date & Time'}
            {step === 4 && 'Contact & Service Location'}
          </span>
        </div>
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-red-600 transition-all duration-300 ease-out"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 1: Select Service */}
      {step === 1 && (
        <div className="space-y-5">
          <div className="text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">What HVAC service do you need?</h3>
            <p className="text-xs text-slate-400 mt-1">
              Select your primary heating, cooling, or emergency maintenance requirement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {availableServices.map((svc) => {
              const Icon = svc.icon;
              const isSelected = formData.serviceName === svc.name;
              return (
                <button
                  type="button"
                  key={svc.name}
                  onClick={() => setFormData({ ...formData, serviceName: svc.name })}
                  className={`text-left p-4 rounded-xl border transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-950/50 border-blue-500 shadow-lg ring-1 ring-blue-500'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg bg-slate-900 border border-slate-800 ${svc.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {svc.badge}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-white">{svc.name}</h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{svc.desc}</p>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-800/60">
                    <span className="text-[11px] text-slate-500 font-medium">Select Service</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-700'}`}>
                      {isSelected && <CheckCircle2 className="w-3 h-3" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={handleNext}
              id="wizard-step1-next-btn"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all"
            >
              Continue to Details
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Property & Issue Details */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">System & Property Details</h3>
            <p className="text-xs text-slate-400 mt-1">
              Help Jayson prepare the right diagnostic tools and replacement parts before arrival.
            </p>
          </div>

          {/* Property Type Radio */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Property Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, propertyType: 'residential' })}
                className={`p-3.5 rounded-xl border flex items-center justify-center gap-2.5 font-bold text-sm transition-all ${
                  formData.propertyType === 'residential'
                    ? 'bg-blue-950/60 border-blue-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Home className="w-4 h-4 text-blue-400" />
                Residential Home
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, propertyType: 'commercial' })}
                className={`p-3.5 rounded-xl border flex items-center justify-center gap-2.5 font-bold text-sm transition-all ${
                  formData.propertyType === 'commercial'
                    ? 'bg-blue-950/60 border-blue-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4 text-slate-300" />
                Commercial / Facility
              </button>
            </div>
          </div>

          {/* Equipment Age */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Approximate Age of Current Heating/Cooling Equipment
            </label>
            <select
              value={formData.equipmentAge}
              onChange={(e) => setFormData({ ...formData, equipmentAge: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Under 5 years (Modern system)">Under 5 years (Modern system)</option>
              <option value="5-10 years">5-10 years</option>
              <option value="10-15 years (Aging system)">10-15 years (Aging system)</option>
              <option value="15+ years (Near end of lifecycle)">15+ years (Near end of lifecycle)</option>
              <option value="Unsure / Brand New Installation Needed">Unsure / Brand New Installation Needed</option>
            </select>
          </div>

          {/* Urgency selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Urgency Level
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'standard', label: 'Standard Schedule', desc: 'Upcoming scheduled visit' },
                { id: 'emergency_today', label: 'Urgent / Same-Day', desc: 'No heat / AC failure emergency' },
                { id: 'flexible', label: 'Flexible / Quote', desc: 'Within next 1-2 weeks' },
              ].map((urg) => (
                <button
                  type="button"
                  key={urg.id}
                  onClick={() => setFormData({ ...formData, urgency: urg.id as BookingUrgency })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    formData.urgency === urg.id
                      ? urg.id === 'emergency_today'
                        ? 'bg-red-950/60 border-red-500 text-white'
                        : 'bg-blue-950/60 border-blue-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-xs">{urg.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{urg.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Issue Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Describe the problem or request *
            </label>
            <textarea
              required
              rows={3}
              value={formData.issueDescription}
              onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
              placeholder="e.g. Furnace blower makes loud screeching noise; upstairs isn't heating properly; need quote to convert old oil furnace to heat pump..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              id="wizard-step2-next-btn"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all"
            >
              Continue to Schedule
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Schedule Date & Time */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">Preferred Date & Arrival Window</h3>
            <p className="text-xs text-slate-400 mt-1">
              Select your desired appointment slot. We provide a 30-minute arrival call-ahead.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Preferred Service Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 [color-scheme:dark]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Preferred Window *
              </label>
              <div className="space-y-2">
                {timeSlots.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setFormData({ ...formData, preferredTimeSlot: slot })}
                    className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ${
                      formData.preferredTimeSlot === slot
                        ? 'bg-blue-950/60 border-blue-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      {slot}
                    </span>
                    {formData.preferredTimeSlot === slot && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Father & Son Arrival Promise</span>
              We respect your time. Jayson calls 30 minutes before arrival so you never have to wait around wondering when your technician will arrive.
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              id="wizard-step3-next-btn"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all"
            >
              Continue to Location
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Contact & Service Location */}
      {step === 4 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">Your Contact & Service Location</h3>
            <p className="text-xs text-slate-400 mt-1">
              Final step: Where should our service truck be dispatched?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Marcus Vance"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Direct Phone Number *
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 226-555-0142"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address (Optional, for confirmation receipt)
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Street Address *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 45 Heritage Court"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                City / Community *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. London / Area"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Postal Code
              </label>
              <input
                type="text"
                placeholder="e.g. N6G 2T4"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              id="wizard-submit-booking-btn"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-extrabold text-sm shadow-xl hover:shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Logging Schedule...</span>
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  <span>Confirm & Book Appointment</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
