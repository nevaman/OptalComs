import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { supabase, GlobalSetting } from '../../lib/supabase';
import { Input, Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

type SiteSettings = {
  studio_name: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  social_linkedin: string;
  social_twitter: string;
  social_instagram: string;
  social_behance: string;
  footer_text: string;
};

const defaultSettings: SiteSettings = {
  studio_name: 'Optal Communications',
  tagline: 'Ethiopian creatives, global clients',
  email: 'hello@optal.co',
  phone: '+251 91 234 5678',
  address: 'Addis Ababa, Ethiopia',
  social_linkedin: 'https://linkedin.com',
  social_twitter: 'https://twitter.com',
  social_instagram: 'https://instagram.com',
  social_behance: 'https://behance.net',
  footer_text: 'Ethiopian creatives serving global clients. We craft distinctive brand identities and digital experiences.',
};

export function Settings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    const { data } = await supabase
      .from('global_settings')
      .select('*')
      .eq('key', 'site_settings')
      .maybeSingle();

    if (data) {
      setSettings({ ...defaultSettings, ...(data.value as Partial<SiteSettings>) });
    }
    setIsLoading(false);
  }

  async function handleSave() {
    setIsSaving(true);

    const { data: existing } = await supabase
      .from('global_settings')
      .select('id')
      .eq('key', 'site_settings')
      .maybeSingle();

    if (existing) {
      await supabase
        .from('global_settings')
        .update({ value: settings })
        .eq('key', 'site_settings');
    } else {
      await supabase
        .from('global_settings')
        .insert([{ key: 'site_settings', value: settings }]);
    }

    setIsSaving(false);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  }

  function updateSetting(key: keyof SiteSettings, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto animate-pulse">
        <div className="h-8 bg-neutral-light w-48 mb-8" />
        <div className="space-y-4">
          <div className="h-12 bg-neutral-light" />
          <div className="h-12 bg-neutral-light" />
          <div className="h-32 bg-neutral-light" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-semibold">Settings</h1>
          <p className="text-neutral-mid mt-1">Manage global site settings</p>
        </div>
        <div className="flex items-center gap-3">
          {savedMessage && (
            <span className="text-sm text-green-600">Settings saved!</span>
          )}
          <Button onClick={handleSave} variant="primary" isLoading={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-surface p-6 rounded border border-neutral-light space-y-6">
          <h2 className="font-display font-semibold">Studio Information</h2>

          <Input
            label="Studio Name"
            value={settings.studio_name}
            onChange={(e) => updateSetting('studio_name', e.target.value)}
            placeholder="Your studio name"
          />

          <Input
            label="Tagline"
            value={settings.tagline}
            onChange={(e) => updateSetting('tagline', e.target.value)}
            placeholder="A short tagline"
          />

          <Textarea
            label="Footer Text"
            value={settings.footer_text}
            onChange={(e) => updateSetting('footer_text', e.target.value)}
            placeholder="Text for the footer area"
            rows={3}
          />
        </div>

        <div className="bg-surface p-6 rounded border border-neutral-light space-y-6">
          <h2 className="font-display font-semibold">Contact Information</h2>

          <Input
            label="Email"
            type="email"
            value={settings.email}
            onChange={(e) => updateSetting('email', e.target.value)}
            placeholder="hello@example.com"
          />

          <Input
            label="Phone"
            value={settings.phone}
            onChange={(e) => updateSetting('phone', e.target.value)}
            placeholder="+1 234 567 890"
          />

          <Input
            label="Address"
            value={settings.address}
            onChange={(e) => updateSetting('address', e.target.value)}
            placeholder="City, Country"
          />
        </div>

        <div className="bg-surface p-6 rounded border border-neutral-light space-y-6">
          <h2 className="font-display font-semibold">Social Links</h2>

          <Input
            label="LinkedIn"
            value={settings.social_linkedin}
            onChange={(e) => updateSetting('social_linkedin', e.target.value)}
            placeholder="https://linkedin.com/company/..."
          />

          <Input
            label="Twitter"
            value={settings.social_twitter}
            onChange={(e) => updateSetting('social_twitter', e.target.value)}
            placeholder="https://twitter.com/..."
          />

          <Input
            label="Instagram"
            value={settings.social_instagram}
            onChange={(e) => updateSetting('social_instagram', e.target.value)}
            placeholder="https://instagram.com/..."
          />

          <Input
            label="Behance"
            value={settings.social_behance}
            onChange={(e) => updateSetting('social_behance', e.target.value)}
            placeholder="https://behance.net/..."
          />
        </div>
      </div>
    </div>
  );
}
