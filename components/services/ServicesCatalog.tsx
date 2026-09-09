'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ServiceCard } from '@/components/services/ServiceCard';
import { ServiceItem } from '@/types';
import { Flame, Snowflake, Sparkles, AlertCircle, Wrench, Building2, Calendar, PhoneCall } from 'lucide-react';
import { APP_CONFIG } from '@/lib/config';

interface ServicesCatalogProps {
  initialServices: ServiceItem[];
}

export function ServicesCatalog({ initialServices }: ServicesCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Services', icon: Wrench },
    { id: 'heating', label: 'Heating & Furnaces', icon: Flame },
    { id: 'cooling', label: 'Air Conditioning', icon: Snowflake },
    { id: 'heat-pumps', label: 'Cold-Climate Heat Pumps', icon: Sparkles },
    { id: 'emergency', label: '24/7 Emergency', icon: AlertCircle },
    { id: 'maintenance', label: 'Seasonal Maintenance', icon: Wrench },
    { id: 'commercial', label: 'Commercial HVAC', icon: Building2 },
  ];

  const filteredServices = selectedCategory === 'all'
    ? initialServices
    : initialServices.filter(s => s.category === selectedCategory);

  return (
    <div>
      {/* Category Filter Pills */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {filteredServices.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {/* Consultation / Direct Call Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">Need a Custom Evaluation or Rebate Assessment?</h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Unsure if your system needs a quick repair or a modern high-efficiency upgrade? Jayson is ready to answer questions honestly.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <a
            href={`tel:${APP_CONFIG.phone}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all"
          >
            <PhoneCall className="w-4 h-4 text-red-400" />
            Call {APP_CONFIG.phoneDisplay}
          </a>
          <Link
            href="/booking"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all"
          >
            <Calendar className="w-4 h-4" />
            Book An Appointment
          </Link>
        </div>
      </div>
    </div>
  );
}
