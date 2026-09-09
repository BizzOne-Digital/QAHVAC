'use client';

import React, { useState } from 'react';
import { ServiceCard } from '@/components/services/ServiceCard';
import { ServiceItem } from '@/types';

interface ServicesCatalogProps {
  initialServices: ServiceItem[];
}

const CATEGORIES = [
  { id: 'all', label: 'All services' },
  { id: 'heating', label: 'Heating' },
  { id: 'cooling', label: 'Cooling' },
  { id: 'heat-pumps', label: 'Heat pumps' },
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'emergency', label: 'Emergency' },
];

export function ServicesCatalog({ initialServices }: ServicesCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredServices =
    selectedCategory === 'all'
      ? initialServices
      : initialServices.filter((s) => s.category === selectedCategory);

  return (
    <div>
      {/* Filters as a typographic tab rule, not a row of coloured pills. */}
      <div className="border-b border-line overflow-x-auto no-scrollbar">
        <div role="tablist" aria-label="Filter services by category" className="flex items-center gap-8 min-w-max">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedCategory(cat.id)}
                className={`relative pb-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  isSelected ? 'text-ink' : 'text-ink-3 hover:text-ink'
                }`}
              >
                {cat.label}
                {isSelected && <span aria-hidden className="absolute -bottom-px left-0 right-0 h-[2px] bg-ink" />}
              </button>
            );
          })}
        </div>
      </div>

      <p className="type-meta text-ink-3 mt-6">
        {filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line mt-8">
        {filteredServices.map((service, index) => (
          <ServiceCard key={service.id} service={service} priority={index < 3} />
        ))}
      </div>
    </div>
  );
}
