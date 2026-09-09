'use client';

import React, { useEffect, useState } from 'react';
import { LocalImageField } from '@/components/admin/LocalImageField';
import { useToast } from '@/components/admin/Toast';
import { AdminPageHeading, Field, LoadingState, Panel, PanelHeading } from '@/components/admin/ui';
import { Button } from '@/components/ui/Button';
import { formatPhoneDisplay } from '@/lib/site';
import { SiteSettings } from '@/types';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || 'Could not load settings.');

        // phoneDisplay is optional in storage but the input is controlled, so
        // derive it from the dialable number when it has never been set.
        const loaded: SiteSettings = data.data;
        setSettings({
          ...loaded,
          phoneDisplay: loaded.phoneDisplay || formatPhoneDisplay(loaded.phone),
        });
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Could not load settings.');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
    // Runs once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setIsSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Settings could not be saved.');
      }

      setSettings(data.data);
      toast.success('Settings saved. The public site is updated.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Settings could not be saved.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <>
        <AdminPageHeading eyebrow="Configuration" title="Site settings" />
        <LoadingState>Loading settings…</LoadingState>
      </>
    );
  }

  return (
    <>
      <AdminPageHeading
        eyebrow="Configuration"
        title="Site settings"
        description="Business details, opening hours and the copy shown across the public site."
      />

      <form onSubmit={handleSave} className="space-y-6 max-w-[52rem]">
        <Panel>
          <PanelHeading>Business details</PanelHeading>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Business name">
              <input
                type="text"
                required
                value={settings.businessName}
                onChange={e => setSettings({ ...settings, businessName: e.target.value })}
                className="field"
              />
            </Field>

            <Field label="Primary contact">
              <input
                type="text"
                required
                value={settings.contactPerson}
                onChange={e => setSettings({ ...settings, contactPerson: e.target.value })}
                className="field"
              />
            </Field>

            <Field label="Phone (digits only)" hint="Used for tel: links.">
              <input
                type="text"
                required
                value={settings.phone}
                onChange={e => setSettings({ ...settings, phone: e.target.value })}
                className="field"
              />
            </Field>

            <Field label="Phone display format">
              <input
                type="text"
                required
                value={settings.phoneDisplay || ''}
                onChange={e => setSettings({ ...settings, phoneDisplay: e.target.value })}
                className="field"
              />
            </Field>

            <Field label="Email address" className="sm:col-span-2">
              <input
                type="email"
                required
                value={settings.email}
                onChange={e => setSettings({ ...settings, email: e.target.value })}
                className="field"
              />
            </Field>

            <Field label="Service area" className="sm:col-span-2">
              <input
                type="text"
                value={settings.serviceArea}
                onChange={e => setSettings({ ...settings, serviceArea: e.target.value })}
                className="field"
              />
            </Field>
          </div>
        </Panel>

        <Panel>
          <PanelHeading note="Shown in the header on the public site">Brand mark</PanelHeading>
          <LocalImageField
            label="Logo"
            folder="pages"
            value={settings.logoUrl}
            placeholder="Upload a logo"
            hint="Optional. Leave empty to use the built-in wordmark."
            onChange={url => setSettings({ ...settings, logoUrl: url || undefined })}
          />
        </Panel>

        <Panel>
          <PanelHeading>Emergency banner</PanelHeading>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.emergencyBanner.enabled}
              onChange={e =>
                setSettings({
                  ...settings,
                  emergencyBanner: { ...settings.emergencyBanner, enabled: e.target.checked },
                })
              }
              className="w-4 h-4 accent-[#9e2b21]"
            />
            <span className="type-small text-ink">Show the banner on the home page</span>
          </label>

          <div className="grid grid-cols-1 gap-5 mt-5">
            <Field label="Headline">
              <input
                type="text"
                value={settings.emergencyBanner.headline}
                onChange={e =>
                  setSettings({
                    ...settings,
                    emergencyBanner: { ...settings.emergencyBanner, headline: e.target.value },
                  })
                }
                className="field"
              />
            </Field>

            <Field label="Message">
              <textarea
                rows={2}
                value={settings.emergencyBanner.message}
                onChange={e =>
                  setSettings({
                    ...settings,
                    emergencyBanner: { ...settings.emergencyBanner, message: e.target.value },
                  })
                }
                className="field"
              />
            </Field>

            <Field label="Banner phone" hint="Leave blank to use the main business number.">
              <input
                type="text"
                value={settings.emergencyBanner.phone}
                onChange={e =>
                  setSettings({
                    ...settings,
                    emergencyBanner: { ...settings.emergencyBanner, phone: e.target.value },
                  })
                }
                className="field"
              />
            </Field>
          </div>
        </Panel>

        <Panel>
          <PanelHeading>Opening hours</PanelHeading>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Monday – Friday">
              <input
                type="text"
                value={settings.hours.weekdays}
                onChange={e =>
                  setSettings({ ...settings, hours: { ...settings.hours, weekdays: e.target.value } })
                }
                className="field"
              />
            </Field>

            <Field label="Saturday">
              <input
                type="text"
                value={settings.hours.saturday}
                onChange={e =>
                  setSettings({ ...settings, hours: { ...settings.hours, saturday: e.target.value } })
                }
                className="field"
              />
            </Field>

            <Field label="Sunday">
              <input
                type="text"
                value={settings.hours.sunday}
                onChange={e =>
                  setSettings({ ...settings, hours: { ...settings.hours, sunday: e.target.value } })
                }
                className="field"
              />
            </Field>

            <Field label="Emergency availability">
              <input
                type="text"
                value={settings.hours.emergency}
                onChange={e =>
                  setSettings({ ...settings, hours: { ...settings.hours, emergency: e.target.value } })
                }
                className="field"
              />
            </Field>
          </div>
        </Panel>

        <Panel>
          <PanelHeading>Public copy</PanelHeading>

          <div className="space-y-5">
            <Field label="Tagline" hint="Used as the home page statement and in metadata.">
              <textarea
                rows={2}
                value={settings.tagline || ''}
                onChange={e =>
                  setSettings({ ...settings, tagline: e.target.value, heroHeadline: e.target.value })
                }
                className="field"
              />
            </Field>

            <Field label="About the business">
              <textarea
                rows={4}
                value={settings.aboutStory}
                onChange={e => setSettings({ ...settings, aboutStory: e.target.value })}
                className="field"
              />
            </Field>

            <Field label="Father and son philosophy">
              <textarea
                rows={4}
                value={settings.fatherSonPhilosophy}
                onChange={e => setSettings({ ...settings, fatherSonPhilosophy: e.target.value })}
                className="field"
              />
            </Field>
          </div>
        </Panel>

        <Panel>
          <PanelHeading note="Shown as figures on the home page">Statistics</PanelHeading>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Years of experience">
              <input
                type="text"
                value={settings.stats.yearsExperience}
                onChange={e =>
                  setSettings({
                    ...settings,
                    stats: { ...settings.stats, yearsExperience: e.target.value },
                  })
                }
                className="field"
              />
            </Field>

            <Field label="Families served">
              <input
                type="text"
                value={settings.stats.familiesServed}
                onChange={e =>
                  setSettings({
                    ...settings,
                    stats: { ...settings.stats, familiesServed: e.target.value },
                  })
                }
                className="field"
              />
            </Field>

            <Field label="Response time">
              <input
                type="text"
                value={settings.stats.responseRate}
                onChange={e =>
                  setSettings({
                    ...settings,
                    stats: { ...settings.stats, responseRate: e.target.value },
                  })
                }
                className="field"
              />
            </Field>

            <Field label="Satisfaction rate">
              <input
                type="text"
                value={settings.stats.satisfactionRate}
                onChange={e =>
                  setSettings({
                    ...settings,
                    stats: { ...settings.stats, satisfactionRate: e.target.value },
                  })
                }
                className="field"
              />
            </Field>
          </div>
        </Panel>

        <div className="flex justify-end gap-3 border-t border-line pt-6">
          <Button
            type="submit"
            id="admin-save-settings-btn"
            variant="primary"
            size="md"
            disabled={isSaving}
          >
            {isSaving ? 'Saving…' : 'Save settings'}
          </Button>
        </div>
      </form>
    </>
  );
}
