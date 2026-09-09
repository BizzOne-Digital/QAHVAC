'use client';

import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { APP_CONFIG } from '@/lib/config';

/** Urgency reads through the one reserved colour and through weight — never through a rainbow. */
function urgencyClass(urgency: string) {
  if (urgency.includes('Urgent')) return 'text-urgent';
  if (urgency.includes('Moderate')) return 'text-ink';
  return 'text-ink-3';
}

interface IssueOption {
  id: string;
  title: string;
  category: 'heating' | 'cooling' | 'general';
  symptom: string;
  diagnosis: string;
  urgency: 'Immediate / Urgent' | 'Moderate' | 'Routine';
  urgencyColor: string;
  recommendedAction: string;
  targetService: string;
}

const COMMON_ISSUES: IssueOption[] = [
  {
    id: 'no-heat-furnace',
    title: 'Furnace clicks repeatedly but will not ignite',
    category: 'heating',
    symptom: 'Blower might run blowing room-temperature or cold air, or system clicks and shuts down.',
    diagnosis: 'Commonly a dirty flame sensor, worn hot surface ignitor, or gas pressure safety limit lockout.',
    urgency: 'Immediate / Urgent',
    urgencyColor: 'text-red-400 bg-red-950/70 border-red-800',
    recommendedAction: 'Schedule safety combustion diagnostic. Do not attempt DIY gas valve adjustments.',
    targetService: 'High-Efficiency Furnace & Heating Systems',
  },
  {
    id: 'ac-warm-air',
    title: 'Air conditioning runs but blows lukewarm air',
    category: 'cooling',
    symptom: 'Airflow is normal but temperature is not cold; outdoor condenser fan spins.',
    diagnosis: 'Typically low refrigerant from a micro-leak, weak dual run capacitor, or heavily choked evaporator coil.',
    urgency: 'Moderate',
    urgencyColor: 'text-amber-400 bg-amber-950/70 border-amber-800',
    recommendedAction: 'Turn system to OFF at thermostat to prevent compressor burnout, then schedule diagnosis.',
    targetService: 'Precision Air Conditioning & Central Air',
  },
  {
    id: 'water-leak-furnace',
    title: 'Water pooling around furnace or indoor coil',
    category: 'general',
    symptom: 'Puddle on basement floor near furnace or drain pan overflowing.',
    diagnosis: 'Blocked condensate drain trap, algae buildup in PVC line, or cracked condensate collector box.',
    urgency: 'Moderate',
    urgencyColor: 'text-amber-400 bg-amber-950/70 border-amber-800',
    recommendedAction: 'Clean drain line and test safety float switch to protect flooring and electronic boards.',
    targetService: '21-Point Seasonal HVAC Tune-Up & Safety Audit',
  },
  {
    id: 'strange-humming-noise',
    title: 'Loud buzzing, screeching, or metal rattling',
    category: 'general',
    symptom: 'High-pitched screech or rhythmic vibration through ductwork.',
    diagnosis: 'Worn blower motor bearings, unbalanced squirrel-cage wheel, or loose draft inducer housing.',
    urgency: 'Immediate / Urgent',
    urgencyColor: 'text-red-400 bg-red-950/70 border-red-800',
    recommendedAction: 'Avoid motor seizure by addressing early. Often resolved with affordable motor replacement.',
    targetService: 'High-Efficiency Furnace & Heating Systems',
  },
  {
    id: 'heat-pump-rebate',
    title: 'Planning to replace old oil/gas with a heat pump',
    category: 'heating',
    symptom: 'Looking to lower monthly bills and eliminate fossil fuel volatility.',
    diagnosis: 'Modern cold-climate inverters operate down to -25°C efficiently and qualify for green energy grants.',
    urgency: 'Routine',
    urgencyColor: 'text-emerald-400 bg-emerald-950/70 border-emerald-800',
    recommendedAction: 'Book an in-home load calculation (Manual J) and system rebate estimate.',
    targetService: 'Cold-Climate Heat Pumps & Ductless Mini-Splits',
  },
];

export function DiagnosticTriage() {
  const [selectedIssue, setSelectedIssue] = useState<IssueOption>(COMMON_ISSUES[0]);

  return (
    <Section id="hvac-diagnostic-triage-tool" tone="canvas" divide>
      <Container>
        <SectionHeading
          eyebrow="Symptom triage"
          title="What is your system doing?"
          lead="Choose the symptom that sounds closest to yours for an honest read on the likely cause, how urgent it is, and what we would do next."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 gap-x-16 mt-16 lg:mt-20 items-start">
          {/* Symptom list */}
          <div className="lg:col-span-5">
            <ul className="border-t border-line" role="tablist" aria-label="Common symptoms">
              {COMMON_ISSUES.map((issue) => {
                const isSelected = selectedIssue.id === issue.id;
                return (
                  <li key={issue.id} className="border-b border-line">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => setSelectedIssue(issue)}
                      className={`group w-full text-left py-5 pl-4 -ml-4 border-l-2 transition-colors duration-200 ${
                        isSelected ? 'border-ink' : 'border-transparent hover:border-line-strong'
                      }`}
                    >
                      <span className={`type-h4 block ${isSelected ? 'text-ink' : 'text-ink-2 group-hover:text-ink'}`}>
                        {issue.title}
                      </span>
                      <span className={`type-label block mt-2.5 ${urgencyClass(issue.urgency)}`}>
                        {issue.urgency}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Reading */}
          <div className="lg:col-span-7 lg:sticky lg:top-32">
            <div className="bg-surface border border-line p-8 sm:p-10">
              <div className="flex items-baseline justify-between gap-6 pb-6 border-b border-line">
                <span className="type-label text-ink-3">Diagnostic reading</span>
                <span className={`type-label ${urgencyClass(selectedIssue.urgency)}`}>{selectedIssue.urgency}</span>
              </div>

              <h3 className="type-h2 text-ink mt-8">{selectedIssue.title}</h3>
              <p className="type-body text-ink-3 mt-4 type-italic-serif">{selectedIssue.symptom}</p>

              <dl className="mt-10 space-y-8">
                <div>
                  <dt className="type-label text-ink-3">Likely mechanical cause</dt>
                  <dd className="type-body text-ink mt-3">{selectedIssue.diagnosis}</dd>
                </div>
                <div>
                  <dt className="type-label text-ink-3">What we would do</dt>
                  <dd className="type-body text-ink mt-3">{selectedIssue.recommendedAction}</dd>
                </div>
              </dl>

              <div className="mt-10 pt-8 border-t border-line flex flex-col sm:flex-row sm:items-center gap-3">
                <Button
                  href={`/booking?service=${encodeURIComponent(selectedIssue.targetService)}`}
                  variant="primary"
                  size="md"
                >
                  Book service for this issue
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
                </Button>
                <Button href={`tel:${APP_CONFIG.phone}`} variant="secondary" size="md">
                  Call Jayson · {APP_CONFIG.phoneDisplay}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
