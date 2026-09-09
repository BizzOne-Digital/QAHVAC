import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Flame, Snowflake, Sparkles, AlertCircle, Wrench, Building2, CheckCircle2, ArrowRight, Calendar } from 'lucide-react';
import { ServiceItem } from '@/types';

interface ServiceCardProps {
  service: ServiceItem;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const getCategoryIcon = (category: ServiceItem['category']) => {
    switch (category) {
      case 'heating':
        return <Flame className="w-3.5 h-3.5 text-rose-400" />;
      case 'cooling':
        return <Snowflake className="w-3.5 h-3.5 text-sky-400" />;
      case 'heat-pumps':
        return <Sparkles className="w-3.5 h-3.5 text-emerald-400" />;
      case 'emergency':
        return <AlertCircle className="w-3.5 h-3.5 text-rose-400" />;
      case 'maintenance':
        return <Wrench className="w-3.5 h-3.5 text-amber-400" />;
      case 'commercial':
        return <Building2 className="w-3.5 h-3.5 text-zinc-300" />;
      default:
        return <Wrench className="w-3.5 h-3.5 text-sky-400" />;
    }
  };

  const getCategoryBadgeClass = (category: ServiceItem['category']) => {
    switch (category) {
      case 'heating':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/20';
      case 'cooling':
        return 'bg-sky-500/10 text-sky-300 border-sky-500/20';
      case 'emergency':
        return 'bg-rose-500/20 text-rose-200 border-rose-500/40 font-bold';
      case 'heat-pumps':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
      default:
        return 'bg-zinc-900 text-zinc-300 border-white/10';
    }
  };

  return (
    <div
      id={`service-card-${service.slug}`}
      className="bg-zinc-950/60 border border-white/[0.08] hover:border-white/20 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between group hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
    >
      {/* Top Image & Badge */}
      <div>
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950">
          <Image
            src={service.image}
            alt={service.title}
            fill
            referrerPolicy="no-referrer"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-black/30" />

          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${getCategoryBadgeClass(service.category)}`}>
              {getCategoryIcon(service.category)}
              {service.category.replace('-', ' ')}
            </span>
          </div>

          {service.emergencyAvailable && (
            <div className="absolute top-3 right-3">
              <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[9px] font-black uppercase tracking-widest shadow-md">
                24/7 Dispatch
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6">
          <h3 className="text-base sm:text-lg font-bold text-white font-display group-hover:text-sky-300 transition-colors line-clamp-1">
            {service.title}
          </h3>

          <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
            {service.shortDesc}
          </p>

          {/* Key Features List */}
          <ul className="mt-4 space-y-2 text-xs text-zinc-300">
            {service.features.slice(0, 3).map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-1 text-zinc-300">{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer / Pricing & Actions */}
      <div className="p-6 pt-0 border-t border-white/[0.06] mt-2">
        <div className="flex items-center justify-between py-3 text-xs">
          <span className="text-zinc-500 font-medium">Estimated Range:</span>
          <span className="text-white font-bold font-display">{service.priceEstimate}</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <Link
            href={`/services/${service.slug}`}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-200 border border-white/10 hover:border-white/20 font-medium text-xs transition-colors"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3 text-zinc-400" />
          </Link>

          <Link
            href={`/booking?service=${encodeURIComponent(service.title)}`}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs shadow-sm transition-all"
          >
            <Calendar className="w-3 h-3 text-zinc-950" />
            <span>Book Now</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
