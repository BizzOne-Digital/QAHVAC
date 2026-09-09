import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export function Testimonials() {
  const reviews = [
    {
      name: 'Marcus Vance',
      role: 'Homeowner, Heritage District',
      comment: 'Our furnace died on a Friday night in -15°C weather. Called QP HVAC and Jayson answered right away. He was at our door within an hour, diagnosed a failed draft inducer, had the replacement part in his van, and our heat was back on before midnight. Honest, fair pricing and genuine craftsmanship.',
      stars: 5,
      system: 'Furnace Emergency Repair',
    },
    {
      name: 'Elena Rostova',
      role: 'Commercial Cafe Owner',
      comment: 'Our rooftop AC unit started leaking into our dining room during a hot July lunch rush. Father and son arrived quietly, fixed the clogged condensate trap and checked all refrigerant pressures without disturbing our guests. They are now our permanent HVAC contractor.',
      stars: 5,
      system: 'Commercial RTU & Cooling',
    },
    {
      name: 'David Chen',
      role: 'Homeowner',
      comment: 'Replaced an ancient oil furnace with a cold-climate heat pump. Jayson walked us through the entire rebate application process which saved us thousands. The installation was impeccably clean with neat wiring and sheet metal work. Highly recommend this family team.',
      stars: 5,
      system: 'Heat Pump Conversion',
    },
  ];

  return (
    <section id="community-reviews" className="py-20 bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            Verified Community Feedback
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            What Our Neighbors Say About QP HVAC
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Every review represents a home kept warm, a business kept cool, and a customer treated like family.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative shadow-xl hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(rev.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-slate-800" />
                </div>

                <p className="text-slate-300 text-xs leading-relaxed italic mb-6">
                  &quot;{rev.comment}&quot;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <h4 className="text-white font-bold text-sm flex items-center gap-1.5">
                    {rev.name}
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  </h4>
                  <span className="text-[11px] text-slate-400">{rev.role}</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                  {rev.system}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
