'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { APP_CONFIG } from '@/lib/config';
import { HERO_ART } from '@/lib/images';


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
        text: 'Thank you for reaching out. Your message has been routed to Jayson and we will get back to you promptly.',
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

  const art = HERO_ART.contact;

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col">
      <Navbar />

      <main className="flex-1">
        <PageHero
          eyebrow="Contact"
          title="Speak directly with Jayson."
          lead="No call centre, no automated queue, no message that disappears into a system. Call, text or write."
          imageSrc={art.src}
          imageAlt={art.alt}
          imagePosition={art.position}
          align={art.align}
          scrim={art.scrim}
        />

        <Section tone="canvas">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-16 gap-x-16 items-start">
              {/* Details */}
              <div className="lg:col-span-5 lg:sticky lg:top-32">
                <div className="pb-8 border-b border-line">
                  <Eyebrow tone="urgent" rule={false}>
                    Emergency line
                  </Eyebrow>
                  <p className="type-h2 text-ink mt-4">
                    <a href={`tel:${APP_CONFIG.phone}`} id="contact-page-phone-btn" className="hover:text-urgent transition-colors">
                      {APP_CONFIG.phoneDisplay}
                    </a>
                  </p>
                  <p className="type-small text-ink-2 mt-3">
                    No heat or a sudden cooling failure? Call for prioritised same-day service.
                  </p>
                </div>

                <dl className="mt-2">
                  <div className="py-6 border-b border-line">
                    <dt className="type-label text-ink-3">Email</dt>
                    <dd className="type-h4 mt-2">
                      <a href={`mailto:${APP_CONFIG.email}`} className="text-ink hover:text-accent transition-colors">
                        {APP_CONFIG.email}
                      </a>
                    </dd>
                    <p className="type-meta text-ink-3 mt-1.5">Replies within two to four hours</p>
                  </div>

                  <div className="py-6 border-b border-line">
                    <dt className="type-label text-ink-3">Hours</dt>
                    <dd className="type-small text-ink mt-2.5 space-y-1">
                      <span className="block">Monday – Friday · 7:00am – 8:00pm</span>
                      <span className="block">Saturday · 8:00am – 6:00pm</span>
                      <span className="block">Sunday · 9:00am – 4:00pm</span>
                    </dd>
                    <p className="type-meta text-urgent font-semibold mt-2">24/7 urgent dispatch available</p>
                  </div>

                  <div className="py-6 border-b border-line">
                    <dt className="type-label text-ink-3">Service area</dt>
                    <dd className="type-small text-ink mt-2.5">
                      Greater region and surrounding communities
                    </dd>
                    <p className="type-meta text-ink-3 mt-1.5">Residential homes and commercial facilities</p>
                  </div>
                </dl>

                <p className="type-small text-ink-2 mt-8 border-l-2 border-line-strong pl-4">
                  <span className="font-semibold text-ink">A personal note.</span> Jayson reads every message
                  himself. We do not sell contact details and we do not send automated marketing.
                </p>
              </div>

              {/* Form */}
              <div className="lg:col-span-7">
                <div className="bg-surface border border-line p-6 sm:p-10">
                  <h2 className="type-h3 text-ink">Send a message or request a quote</h2>
                  <p className="type-small text-ink-2 mt-2">
                    Tell us what the system is doing and we will come back to you with next steps.
                  </p>

                  {statusMessage && (
                    <p
                      role="status"
                      className={`type-small mt-8 border-l-2 pl-4 ${
                        statusMessage.type === 'success'
                          ? 'border-accent text-ink'
                          : 'border-urgent text-urgent'
                      }`}
                    >
                      {statusMessage.text}
                    </p>
                  )}

                  <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="contact-name" className="field-label">
                          Full name <span className="text-ink-3">(required)</span>
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          placeholder="Marcus Vance"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="field"
                        />
                      </div>

                      <div>
                        <label htmlFor="contact-phone" className="field-label">
                          Phone number <span className="text-ink-3">(required)</span>
                        </label>
                        <input
                          id="contact-phone"
                          type="tel"
                          required
                          placeholder="226-555-0142"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="field"
                        />
                      </div>

                      <div>
                        <label htmlFor="contact-email" className="field-label">
                          Email address
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          placeholder="name@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="field"
                        />
                      </div>

                      <div>
                        <label htmlFor="contact-property" className="field-label">
                          Property type
                        </label>
                        <select
                          id="contact-property"
                          value={formData.propertyType}
                          onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                          className="field"
                        >
                          <option value="residential">Residential home</option>
                          <option value="commercial">Commercial / facility</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-subject" className="field-label">
                        Subject
                      </label>
                      <input
                        id="contact-subject"
                        type="text"
                        placeholder="Furnace tune-up, or a heat pump quote"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="field"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-message" className="field-label">
                        How can we help? <span className="text-ink-3">(required)</span>
                      </label>
                      <textarea
                        id="contact-message"
                        required
                        rows={5}
                        placeholder="Let us know the system issue, the equipment brand, or the service you are looking for."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="field"
                      />
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        id="contact-submit-btn"
                        variant="primary"
                        size="lg"
                        fullWidth
                      >
                        {isSubmitting ? 'Sending…' : 'Send message'}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
