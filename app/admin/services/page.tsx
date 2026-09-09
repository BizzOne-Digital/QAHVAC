'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Wrench,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  X,
  Save,
  Flame,
  Snowflake,
  Sparkles,
  DollarSign,
  Clock,
  Eye
} from 'lucide-react';
import { ServiceItem } from '@/types';

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Partial<ServiceItem> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [featuresInput, setFeaturesInput] = useState('');

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      if (data.success) {
        setServices(data.data);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateModal = () => {
    setIsCreating(true);
    setFeaturesInput('Factory diagnostic\nSafety test\nUpfront quote');
    setEditingService({
      title: '',
      slug: '',
      category: 'heating',
      shortDesc: '',
      fullDesc: '',
      priceEstimate: '$129 Flat Diagnostic',
      durationEstimate: '1 - 2 Hours',
      features: ['Factory diagnostic', 'Safety test', 'Upfront quote'],
      image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=1200&auto=format&fit=crop',
      active: true,
      emergencyAvailable: false,
    });
  };

  const openEditModal = (svc: ServiceItem) => {
    setIsCreating(false);
    setEditingService({ ...svc });
    setFeaturesInput(svc.features.join('\n'));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editingService.title) return;

    setIsSaving(true);
    try {
      const features = featuresInput
        .split('\n')
        .map(f => f.trim())
        .filter(Boolean);

      const payload = {
        ...editingService,
        features,
      };

      if (isCreating) {
        const res = await fetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setServices(prev => [...prev, data.data]);
          setEditingService(null);
        }
      } else if (editingService.id) {
        const res = await fetch(`/api/services/${editingService.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setServices(prev => prev.map(s => (s.id === editingService.id ? data.data : s)));
          setEditingService(null);
        }
      }
    } catch (err) {
      console.error('Error saving service:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setServices(prev => prev.filter(s => s.id !== id));
      }
    } catch (err) {
      console.error('Error deleting service:', err);
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            HVAC Services Catalog
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage public heating, cooling, heat pumps, and maintenance offerings.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          id="admin-add-service-btn"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((svc) => (
          <div
            key={svc.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/9] w-full bg-slate-950">
                <Image
                  src={svc.image}
                  alt={svc.title}
                  fill
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-950/90 text-white border border-slate-700">
                    {svc.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    svc.active ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {svc.active ? 'Active' : 'Draft'}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-base font-bold text-white">{svc.title}</h3>
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">{svc.shortDesc}</p>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Price Guide:</span>
                  <span className="text-slate-200 font-bold">{svc.priceEstimate}</span>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-slate-800/60 mt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">/{svc.slug}</span>

              <div className="flex items-center gap-2 pt-3">
                <button
                  onClick={() => openEditModal(svc)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => setDeleteId(svc.id)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400"
                  title="Delete Service"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto my-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {isCreating ? 'Create New HVAC Service' : `Edit: ${editingService.title}`}
              </h3>
              <button
                onClick={() => setEditingService(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={editingService.title || ''}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  placeholder="e.g. Furnace Emergency Diagnostic & Repair"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category</label>
                  <select
                    value={editingService.category || 'heating'}
                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value as ServiceItem['category'] })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="heating">Heating & Furnaces</option>
                    <option value="cooling">Air Conditioning</option>
                    <option value="heat-pumps">Heat Pumps</option>
                    <option value="emergency">Emergency Repair</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={editingService.slug || ''}
                    onChange={(e) => setEditingService({ ...editingService, slug: e.target.value })}
                    placeholder="e.g. furnace-repair"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Short Description (Summary Card)</label>
                <textarea
                  rows={2}
                  required
                  value={editingService.shortDesc || ''}
                  onChange={(e) => setEditingService({ ...editingService, shortDesc: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Full Service Description (Detail Page)</label>
                <textarea
                  rows={4}
                  required
                  value={editingService.fullDesc || ''}
                  onChange={(e) => setEditingService({ ...editingService, fullDesc: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Price Guide / Estimate</label>
                  <input
                    type="text"
                    value={editingService.priceEstimate || ''}
                    onChange={(e) => setEditingService({ ...editingService, priceEstimate: e.target.value })}
                    placeholder="e.g. $129 Diagnostic / $189 Tune-Up"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Duration Estimate</label>
                  <input
                    type="text"
                    value={editingService.durationEstimate || ''}
                    onChange={(e) => setEditingService({ ...editingService, durationEstimate: e.target.value })}
                    placeholder="e.g. 1 - 2 Hours"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Features & Checklist (One per line)
                </label>
                <textarea
                  rows={3}
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  placeholder="Flame sensor cleaning&#10;Heat exchanger crack inspection&#10;Combustion efficiency test"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={editingService.image || ''}
                  onChange={(e) => setEditingService({ ...editingService, image: e.target.value })}
                  placeholder="https://... or /api/uploads/services/..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingService.active ?? true}
                    onChange={(e) => setEditingService({ ...editingService, active: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-800 text-blue-600 bg-slate-950"
                  />
                  <span className="text-slate-200 font-semibold">Active on Public Website</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingService.emergencyAvailable ?? false}
                    onChange={(e) => setEditingService({ ...editingService, emergencyAvailable: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-800 text-red-600 bg-slate-950"
                  />
                  <span className="text-slate-200 font-semibold">24/7 Emergency Available</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Save Service'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="font-bold text-white text-base">Delete Service?</h3>
            </div>
            <p className="text-xs text-slate-300">
              Are you sure you want to remove this service from the catalog?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
