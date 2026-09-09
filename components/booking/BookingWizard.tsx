'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { PropertyType, BookingUrgency, ServiceItem } from '@/types';
import { APP_CONFIG } from '@/lib/config';
import { Button } from '@/components/ui/Button';

interface BookingWizardProps {
  /** Slug, id or title of the service to preselect. Defaults to the first published service. */
  initialService?: string;
  onSuccess?: (referenceNumber: string) => void;
  /** Drops the surrounding panel when the page already provides one, e.g. a sidebar. */
  frameless?: boolean;
}

const STEP_TITLES = [
  'Select service',
  'System details',
  'Date & window',
  'Contact & location',
];

export function BookingWizard({
  initialService = '',
  frameless = false,
}: BookingWizardProps) {
  const frame = frameless ? '' : 'bg-surface border border-line p-6 sm:p-10 lg:p-12 max-w-[52rem] mx-auto';
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState<string | null>(null);
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
    serviceId: '',
    serviceName: '',
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

  useEffect(() => {
    let cancelled = false;

    const loadServices = async () => {
      setServicesLoading(true);
      setServicesError(null);
      try {
        const res = await fetch('/api/services?active=true');
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Unable to load the service list.');
        }
        if (cancelled) return;

        const list: ServiceItem[] = data.data;
        setServices(list);

        // Preselect whatever the page asked for, matching by slug, id or title.
        const preselected =
          list.find((svc) => svc.slug === initialService) ||
          list.find((svc) => svc.id === initialService) ||
          list.find((svc) => svc.title === initialService) ||
          list[0];

        if (preselected) {
          setFormData((prev) => ({
            ...prev,
            serviceId: preselected.id,
            serviceName: preselected.title,
          }));
        }
      } catch (err) {
        if (!cancelled) {
          setServicesError(err instanceof Error ? err.message : 'Unable to load the service list.');
        }
      } finally {
        if (!cancelled) setServicesLoading(false);
      }
    };

    loadServices();
    return () => {
      cancelled = true;
    };
  }, [initialService]);

  const timeSlots = [
    'Morning (8:00 AM - 12:00 PM)',
    'Early Afternoon (12:00 PM - 3:00 PM)',
    'Late Afternoon (3:00 PM - 6:00 PM)',
    'Evening Urgent Callout (6:00 PM - 9:00 PM)',
  ];

  const handleNext = () => {
    setErrorMessage(null);
    if (step === 1) {
      if (!formData.serviceId || !formData.serviceName) {
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
        serviceId: formData.serviceId,
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

  /* ---------------------------------------------------------------- Success */

  if (bookingSuccess) {
    return (
      <div
        id="booking-success-card"
        className={frameless ? '' : 'bg-surface border border-line p-8 sm:p-12 max-w-[52rem] mx-auto'}
      >
        <span className="type-label text-ink-3">Request received</span>

        <h3 className="type-h2 text-ink mt-5">Thank you, {bookingSuccess.customerName}.</h3>

        <p className="type-body text-ink-2 mt-5 max-w-[36rem]">
          Your appointment request is logged in our dispatch schedule. Jayson will review the details and
          call you to confirm the arrival time.
        </p>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 mt-10 border-t border-line">
          <div className="py-5 border-b border-line">
            <dt className="type-label text-ink-3">Reference</dt>
            <dd className="type-h4 text-ink mt-2 font-mono tracking-tight">{bookingSuccess.referenceNumber}</dd>
          </div>
          <div className="py-5 border-b border-line">
            <dt className="type-label text-ink-3">Requested date</dt>
            <dd className="type-h4 text-ink mt-2">{bookingSuccess.preferredDate}</dd>
          </div>
          <div className="py-5 border-b border-line">
            <dt className="type-label text-ink-3">Arrival window</dt>
            <dd className="type-small text-ink mt-2">{bookingSuccess.preferredTimeSlot}</dd>
          </div>
          <div className="py-5 border-b border-line">
            <dt className="type-label text-ink-3">Service</dt>
            <dd className="type-small text-ink mt-2">{bookingSuccess.serviceName}</dd>
          </div>
        </dl>

        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <Button
            href={`tel:${APP_CONFIG.phone}`}
            id="success-call-jayson-btn"
            variant="primary"
            size="md"
          >
            Call Jayson · {APP_CONFIG.phoneDisplay}
          </Button>
          <Button
            id="book-another-appointment-btn"
            variant="secondary"
            size="md"
            onClick={() => {
              setBookingSuccess(null);
              setStep(1);
            }}
          >
            Book another visit
          </Button>
        </div>
      </div>
    );
  }

  /* ----------------------------------------------------------------- Wizard */

  return (
    <div
      id="booking-appointment-wizard"
      className={frame}
    >
      {/* Progress — four hairline segments, no gradient bar. */}
      <div className="flex items-baseline justify-between gap-6">
        <span className="type-label text-ink-3">
          Step {step} of 4
        </span>
        <span className="type-label text-ink">{STEP_TITLES[step - 1]}</span>
      </div>

      <div className="grid grid-cols-4 gap-1.5 mt-4" aria-hidden>
        {[1, 2, 3, 4].map((n) => (
          <span key={n} className={`h-[2px] ${n <= step ? 'bg-ink' : 'bg-line'}`} />
        ))}
      </div>

      {errorMessage && (
        <p
          role="alert"
          className="type-small text-urgent border-l-2 border-urgent pl-4 mt-8"
        >
          {errorMessage}
        </p>
      )}

      {/* STEP 1: Select Service */}
      {step === 1 && (
        <div className="mt-10">
          <h3 className="type-h3 text-ink">Which service do you need?</h3>
          <p className="type-small text-ink-2 mt-2">
            Select your primary heating, cooling or maintenance requirement.
          </p>

          {servicesLoading && (
            <p className="type-small text-ink-3 mt-8 border-t border-line pt-6">
              Loading available services...
            </p>
          )}

          {!servicesLoading && servicesError && (
            <p role="alert" className="type-small text-urgent mt-8 border-l-2 border-urgent pl-4">
              {servicesError} Please refresh, or call Jayson directly at {APP_CONFIG.phoneDisplay}.
            </p>
          )}

          {!servicesLoading && !servicesError && services.length === 0 && (
            <p className="type-small text-ink-3 mt-8 border-t border-line pt-6">
              No services are published right now. Please call Jayson at {APP_CONFIG.phoneDisplay} and we will
              book you in directly.
            </p>
          )}

          {!servicesLoading && services.length > 0 && (
            <ul className="mt-8 border-t border-line">
              {services.map((svc) => {
                const isSelected = formData.serviceId === svc.id;
                return (
                  <li key={svc.id} className="border-b border-line">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, serviceId: svc.id, serviceName: svc.title })}
                      aria-pressed={isSelected}
                      className="group w-full text-left py-5 flex items-start gap-4 transition-colors"
                    >
                      <span
                        className={`mt-1 w-4 h-4 flex-shrink-0 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected ? 'border-ink bg-ink text-white' : 'border-line-strong group-hover:border-ink-3'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5" strokeWidth={3} />}
                      </span>

                      <span className="flex-1">
                        <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                          <span className={`type-h4 ${isSelected ? 'text-ink' : 'text-ink-2 group-hover:text-ink'}`}>
                            {svc.title}
                          </span>
                          <span className="type-label text-ink-3">
                            {svc.emergencyAvailable ? 'Emergency available' : svc.durationEstimate}
                          </span>
                        </span>
                        <span className="type-meta text-ink-3 block mt-1.5">{svc.shortDesc}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="flex justify-end mt-10">
            <Button type="button" onClick={handleNext} id="wizard-step1-next-btn" variant="primary" size="md">
              Continue
              <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: Property & Issue Details */}
      {step === 2 && (
        <div className="mt-10 space-y-10">
          <div>
            <h3 className="type-h3 text-ink">System and property details</h3>
            <p className="type-small text-ink-2 mt-2">
              This helps Jayson bring the right diagnostic tools and parts on the first visit.
            </p>
          </div>

          <fieldset>
            <legend className="field-label">Property type</legend>
            <div className="grid grid-cols-2 gap-3">
              {([
                { id: 'residential', label: 'Residential home' },
                { id: 'commercial', label: 'Commercial / facility' },
              ] as const).map((option) => (
                <button
                  type="button"
                  key={option.id}
                  onClick={() => setFormData({ ...formData, propertyType: option.id })}
                  aria-pressed={formData.propertyType === option.id}
                  className={`px-4 py-3 rounded-sm border text-sm font-medium transition-colors ${
                    formData.propertyType === option.id
                      ? 'border-ink bg-ink text-canvas'
                      : 'border-line-strong text-ink-2 hover:border-ink hover:text-ink'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="booking-equipment-age" className="field-label">
              Approximate age of the current equipment
            </label>
            <select
              id="booking-equipment-age"
              value={formData.equipmentAge}
              onChange={(e) => setFormData({ ...formData, equipmentAge: e.target.value })}
              className="field"
            >
              <option value="Under 5 years (Modern system)">Under 5 years (modern system)</option>
              <option value="5-10 years">5–10 years</option>
              <option value="10-15 years (Aging system)">10–15 years (ageing system)</option>
              <option value="15+ years (Near end of lifecycle)">15+ years (near end of life)</option>
              <option value="Unsure / Brand New Installation Needed">Unsure / new installation needed</option>
            </select>
          </div>

          <fieldset>
            <legend className="field-label">Urgency</legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'standard', label: 'Standard', desc: 'Upcoming scheduled visit' },
                { id: 'emergency_today', label: 'Same day', desc: 'No heat or cooling now' },
                { id: 'flexible', label: 'Flexible', desc: 'Within one to two weeks' },
              ].map((urg) => {
                const isSelected = formData.urgency === urg.id;
                const isEmergency = urg.id === 'emergency_today';
                return (
                  <button
                    type="button"
                    key={urg.id}
                    onClick={() => setFormData({ ...formData, urgency: urg.id as BookingUrgency })}
                    aria-pressed={isSelected}
                    className={`p-4 rounded-sm border text-left transition-colors ${
                      isSelected
                        ? isEmergency
                          ? 'border-urgent bg-urgent text-white'
                          : 'border-ink bg-ink text-canvas'
                        : 'border-line-strong hover:border-ink'
                    }`}
                  >
                    <span className={`type-h4 block ${isSelected ? '' : 'text-ink'}`}>{urg.label}</span>
                    <span className={`type-meta block mt-1 ${isSelected ? 'opacity-70' : 'text-ink-3'}`}>
                      {urg.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div>
            <label htmlFor="booking-issue" className="field-label">
              Describe the problem or request <span className="text-ink-3">(required)</span>
            </label>
            <textarea
              id="booking-issue"
              required
              rows={4}
              value={formData.issueDescription}
              onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
              placeholder="For example: the furnace blower makes a loud screeching noise, or the upstairs is not heating properly."
              className="field"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button type="button" onClick={handleBack} variant="quiet" size="md">
              <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
              Back
            </Button>
            <Button type="button" onClick={handleNext} id="wizard-step2-next-btn" variant="primary" size="md">
              Continue
              <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Schedule Date & Time */}
      {step === 3 && (
        <div className="mt-10 space-y-10">
          <div>
            <h3 className="type-h3 text-ink">Preferred date and arrival window</h3>
            <p className="type-small text-ink-2 mt-2">
              We call thirty minutes before arrival, so you are never left waiting.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <label htmlFor="booking-date" className="field-label">
                Service date <span className="text-ink-3">(required)</span>
              </label>
              <input
                id="booking-date"
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={formData.preferredDate}
                onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                className="field"
              />
            </div>

            <fieldset>
              <legend className="field-label">
                Arrival window <span className="text-ink-3">(required)</span>
              </legend>
              <ul className="border-t border-line">
                {timeSlots.map((slot) => {
                  const isSelected = formData.preferredTimeSlot === slot;
                  return (
                    <li key={slot} className="border-b border-line">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, preferredTimeSlot: slot })}
                        aria-pressed={isSelected}
                        className="group w-full flex items-center gap-3 py-3 text-left"
                      >
                        <span
                          className={`w-4 h-4 flex-shrink-0 rounded-full border flex items-center justify-center transition-colors ${
                            isSelected ? 'border-ink bg-ink text-white' : 'border-line-strong group-hover:border-ink-3'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5" strokeWidth={3} />}
                        </span>
                        <span className={`type-small ${isSelected ? 'text-ink font-medium' : 'text-ink-2 group-hover:text-ink'}`}>
                          {slot}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </fieldset>
          </div>

          <p className="type-small text-ink-2 border-l-2 border-line-strong pl-4">
            <span className="font-semibold text-ink">Our arrival promise.</span> Jayson calls thirty minutes
            ahead so you never have to keep an eye on the driveway.
          </p>

          <div className="flex items-center justify-between pt-2">
            <Button type="button" onClick={handleBack} variant="quiet" size="md">
              <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
              Back
            </Button>
            <Button type="button" onClick={handleNext} id="wizard-step3-next-btn" variant="primary" size="md">
              Continue
              <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: Contact & Service Location */}
      {step === 4 && (
        <form onSubmit={handleSubmit} className="mt-10 space-y-10">
          <div>
            <h3 className="type-h3 text-ink">Contact and service location</h3>
            <p className="type-small text-ink-2 mt-2">Where should the service van be dispatched?</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="booking-name" className="field-label">
                Full name <span className="text-ink-3">(required)</span>
              </label>
              <input
                id="booking-name"
                type="text"
                required
                placeholder="Marcus Vance"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="field"
              />
            </div>

            <div>
              <label htmlFor="booking-phone" className="field-label">
                Phone number <span className="text-ink-3">(required)</span>
              </label>
              <input
                id="booking-phone"
                type="tel"
                required
                placeholder="226-555-0142"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="field"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="booking-email" className="field-label">
                Email address <span className="text-ink-3">(optional, for a confirmation receipt)</span>
              </label>
              <input
                id="booking-email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="field"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="booking-street" className="field-label">
                Street address <span className="text-ink-3">(required)</span>
              </label>
              <input
                id="booking-street"
                type="text"
                required
                placeholder="45 Heritage Court"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className="field"
              />
            </div>

            <div>
              <label htmlFor="booking-city" className="field-label">
                City or community <span className="text-ink-3">(required)</span>
              </label>
              <input
                id="booking-city"
                type="text"
                required
                placeholder="London"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="field"
              />
            </div>

            <div>
              <label htmlFor="booking-postal" className="field-label">
                Postal code
              </label>
              <input
                id="booking-postal"
                type="text"
                placeholder="N6G 2T4"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="field"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button type="button" onClick={handleBack} disabled={isSubmitting} variant="quiet" size="md">
              <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
              Back
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              id="wizard-submit-booking-btn"
              variant="primary"
              size="lg"
            >
              {isSubmitting ? 'Sending request…' : 'Confirm appointment'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
