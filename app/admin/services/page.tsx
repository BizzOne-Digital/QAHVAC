'use client';

import React, { useEffect, useState } from 'react';
import { AdminImage } from '@/components/admin/AdminImage';
import { LocalImageField } from '@/components/admin/LocalImageField';
import { useToast } from '@/components/admin/Toast';
import {
  AdminPageHeading,
  EmptyState,
  Field,
  LoadingState,
  StatusPill,
} from '@/components/admin/ui';
import { Button } from '@/components/ui/Button';
import { deleteServiceImage } from '@/lib/uploads/client';
import { ServiceItem } from '@/types';

const CATEGORIES: { value: ServiceItem['category']; label: string }[] = [
  { value: 'heating', label: 'Heating & furnaces' },
  { value: 'cooling', label: 'Air conditioning' },
  { value: 'heat-pumps', label: 'Heat pumps' },
  { value: 'emergency', label: 'Emergency repair' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'commercial', label: 'Commercial' },
];

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Partial<ServiceItem> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [featuresInput, setFeaturesInput] = useState('');
  const toast = useToast();

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Could not load services.');
      setServices(data.data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not load services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    // Runs once on mount; the toast context is stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      durationEstimate: '1 – 2 hours',
      features: [],
      image: '',
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
      const payload = {
        ...editingService,
        features: featuresInput
          .split('\n')
          .map(f => f.trim())
          .filter(Boolean),
      };

      const res = await fetch(
        isCreating ? '/api/services' : `/api/services/${editingService.id}`,
        {
          method: isCreating ? 'POST' : 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'The service could not be saved.');
      }

      setServices(prev =>
        isCreating ? [...prev, data.data] : prev.map(s => (s.id === data.data.id ? data.data : s))
      );
      setEditingService(null);
      toast.success(isCreating ? 'Service created.' : 'Service updated.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'The service could not be saved.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const service = services.find(s => s.id === id);
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'The service could not be removed.');
      }

      setServices(prev => prev.filter(s => s.id !== id));
      toast.success('Service removed.');

      // The record is gone, so its stored image is now orphaned. Cleanup
      // failures are logged rather than surfaced — the delete itself succeeded.
      await deleteServiceImage(service?.image);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'The service could not be removed.');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <>
      <AdminPageHeading
        eyebrow="Catalogue"
        title="Services"
        description="What the public site lists, in the order shown. Inactive services stay saved but are hidden."
        actions={
          <Button variant="primary" size="sm" onClick={openCreateModal} id="admin-add-service-btn">
            Add service
          </Button>
        }
      />

      {loading ? (
        <LoadingState>Loading services…</LoadingState>
      ) : services.length === 0 ? (
        <EmptyState>No services yet. Add the first one to populate the public catalogue.</EmptyState>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {services.map(svc => (
            <li key={svc.id} className="bg-surface border border-line flex flex-col">
              <div className="relative aspect-[16/9] w-full bg-canvas-sunk border-b border-line">
                <AdminImage
                  src={svc.image}
                  alt={svc.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 360px"
                  className="object-cover"
                />
                <span className="absolute top-3 left-3 bg-surface/95 border border-line type-label text-ink-2 px-2 py-1">
                  {svc.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="type-h4 text-ink">{svc.title}</h3>
                  <StatusPill tone={svc.active ? 'active' : 'muted'}>
                    {svc.active ? 'Live' : 'Draft'}
                  </StatusPill>
                </div>

                <p className="type-meta text-ink-2 mt-2.5 line-clamp-2">{svc.shortDesc}</p>

                <dl className="mt-4 pt-4 border-t border-line space-y-1.5">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="type-meta text-ink-3">URL</dt>
                    <dd className="type-meta text-ink-2 text-right truncate">/{svc.slug}</dd>
                  </div>
                </dl>

                <div className="mt-auto pt-4 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => openEditModal(svc)}
                    className="type-label text-ink hover:text-ink-2 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteId(svc.id)}
                    className="type-label text-urgent hover:text-urgent-hover transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Create / edit */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-ink/45 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-surface border border-line w-full max-w-2xl my-8">
            <div className="flex items-baseline justify-between gap-4 px-6 sm:px-8 py-5 border-b border-line">
              <div>
                <span className="type-label text-ink-3">{isCreating ? 'New' : 'Editing'}</span>
                <h2 className="type-h3 text-ink mt-2">
                  {isCreating ? 'Add a service' : editingService.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="type-label text-ink-3 hover:text-ink transition-colors"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSave} className="px-6 sm:px-8 py-7 space-y-6">
              <Field label="Service title">
                <input
                  type="text"
                  required
                  value={editingService.title || ''}
                  onChange={e => setEditingService({ ...editingService, title: e.target.value })}
                  placeholder="Furnace diagnostic and repair"
                  className="field"
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Category">
                  <select
                    value={editingService.category || 'heating'}
                    onChange={e =>
                      setEditingService({
                        ...editingService,
                        category: e.target.value as ServiceItem['category'],
                      })
                    }
                    className="field"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="URL slug" hint="Leave blank to generate one from the title.">
                  <input
                    type="text"
                    value={editingService.slug || ''}
                    onChange={e => setEditingService({ ...editingService, slug: e.target.value })}
                    placeholder="furnace-repair"
                    className="field"
                  />
                </Field>
              </div>

              <Field label="Short description" hint="Shown on the catalogue card.">
                <textarea
                  rows={2}
                  required
                  value={editingService.shortDesc || ''}
                  onChange={e => setEditingService({ ...editingService, shortDesc: e.target.value })}
                  className="field"
                />
              </Field>

              <Field label="Full description" hint="Shown on the service detail page.">
                <textarea
                  rows={4}
                  required
                  value={editingService.fullDesc || ''}
                  onChange={e => setEditingService({ ...editingService, fullDesc: e.target.value })}
                  className="field"
                />
              </Field>

              <Field label="Duration estimate">
                <input
                  type="text"
                  value={editingService.durationEstimate || ''}
                  onChange={e =>
                    setEditingService({ ...editingService, durationEstimate: e.target.value })
                  }
                  placeholder="1 – 2 hours"
                  className="field"
                />
              </Field>

              <Field label="Features" hint="One per line.">
                <textarea
                  rows={4}
                  value={featuresInput}
                  onChange={e => setFeaturesInput(e.target.value)}
                  className="field"
                />
              </Field>

              <LocalImageField
                label="Cover image"
                folder="products"
                value={editingService.image}
                placeholder="Upload service image"
                hint="Stored in the database and served from /api/uploads, so it survives redeployments."
                onChange={url => setEditingService({ ...editingService, image: url || '' })}
              />

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingService.active ?? true}
                    onChange={e => setEditingService({ ...editingService, active: e.target.checked })}
                    className="w-4 h-4 accent-[#14161a]"
                  />
                  <span className="type-small text-ink">Show on the public site</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingService.emergencyAvailable ?? false}
                    onChange={e =>
                      setEditingService({ ...editingService, emergencyAvailable: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#9e2b21]"
                  />
                  <span className="type-small text-ink">Available for emergency dispatch</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-line">
                <Button variant="secondary" size="md" onClick={() => setEditingService(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md" disabled={isSaving}>
                  {isSaving ? 'Saving…' : 'Save service'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-ink/45 flex items-center justify-center p-4">
          <div className="bg-surface border border-line w-full max-w-md p-7">
            <span className="type-label text-ink-3">Confirm</span>
            <h2 className="type-h3 text-ink mt-3">Remove this service?</h2>
            <p className="type-small text-ink-2 mt-3">
              It will disappear from the public catalogue and its detail page immediately. Bookings
              already taken against it are not affected.
            </p>

            <div className="flex justify-end gap-3 mt-7">
              <Button variant="secondary" size="md" onClick={() => setDeleteId(null)}>
                Cancel
              </Button>
              <Button variant="urgent" size="md" onClick={() => handleDelete(deleteId)}>
                Remove service
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
