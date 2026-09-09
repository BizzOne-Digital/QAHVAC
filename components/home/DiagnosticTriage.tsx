'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Wrench, AlertCircle, ArrowRight, CheckCircle2, PhoneCall, Sparkles } from 'lucide-react';
import { APP_CONFIG } from '@/lib/config';

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
    <section id="hvac-diagnostic-triage-tool" className="py-20 bg-[#090b12] border-b border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 border border-white/10 text-zinc-300 text-xs font-semibold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            Interactive Climate Diagnostics
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-display tracking-tight">
            What is Your Climate System Experiencing?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-xl mx-auto">
            Select a common symptom below to view honest technical triage, urgency ratings, and craftsman guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Symptoms List */}
          <div className="lg:col-span-6 space-y-3">
            {COMMON_ISSUES.map((issue) => {
              const isSelected = selectedIssue.id === issue.id;
              return (
                <button
                  key={issue.id}
                  type="button"
                  onClick={() => setSelectedIssue(issue)}
                  className={`w-full text-left p-4.5 rounded-xl border transition-all duration-200 ${
                    isSelected
                      ? 'bg-zinc-900 border-white/30 shadow-xl ring-1 ring-white/10'
                      : 'bg-zinc-950/60 border-white/[0.06] hover:border-white/15 hover:bg-zinc-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className={`font-bold text-xs sm:text-sm font-display ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                      {issue.title}
                    </span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider flex-shrink-0 ${
                      issue.urgency.includes('Urgent')
                        ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                        : issue.urgency.includes('Moderate')
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    }`}>
                      {issue.urgency}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-2 line-clamp-1">{issue.symptom}</p>
                </button>
              );
            })}
          </div>

          {/* Detailed Diagnosis & Direct Action Card */}
          <div className="lg:col-span-6 bg-zinc-950 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
              <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider font-display">
                <Wrench className="w-4 h-4" />
                Master Diagnostic Evaluation
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded border uppercase tracking-wider ${
                selectedIssue.urgency.includes('Urgent')
                  ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                  : selectedIssue.urgency.includes('Moderate')
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              }`}>
                {selectedIssue.urgency}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-white font-display mb-2">{selectedIssue.title}</h3>
            <p className="text-xs text-zinc-400 mb-6 italic">&quot;{selectedIssue.symptom}&quot;</p>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-zinc-900/90 border border-white/[0.08]">
                <span className="text-zinc-400 font-bold uppercase tracking-wider block text-[10px] mb-1.5 font-display">
                  Likely Mechanical Cause:
                </span>
                <p className="text-zinc-200 leading-relaxed font-medium">{selectedIssue.diagnosis}</p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.08]">
                <span className="text-sky-400 font-bold uppercase tracking-wider block text-[10px] mb-1.5 font-display">
                  Father & Son Craftsman Recommendation:
                </span>
                <p className="text-zinc-300 leading-relaxed">{selectedIssue.recommendedAction}</p>
              </div>
            </div>

            {/* Direct Booking CTA from Diagnostic */}
            <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href={`/booking?service=${encodeURIComponent(selectedIssue.targetService)}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs shadow-md transition-all active:scale-[0.98]"
              >
                <span>Book Service For This Issue</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-900" />
              </Link>

              <a
                href={`tel:${APP_CONFIG.phone}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-semibold text-xs border border-white/10 hover:border-white/20 transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
                Call Jayson Direct: {APP_CONFIG.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
