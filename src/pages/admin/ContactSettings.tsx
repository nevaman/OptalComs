import { useState, useEffect } from 'react';
import { Save, Mail, Phone, MessageCircle, Send, MapPin } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

interface ContactInfo {
  email: string;
  phone: string;
  whatsapp: string;
  telegram: string;
  location: string;
}

export function ContactSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<ContactInfo>({
    email: '',
    phone: '',
    whatsapp: '',
    telegram: '',
    location: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setIsLoading(true);
    const { data } = await supabase
      .from('global_settings')
      .select('*')
      .eq('key', 'contact_info')
      .maybeSingle();

    if (data?.value) {
      setSettings(data.value as ContactInfo);
    }
    setIsLoading(false);
  }

  async function handleSave() {
    setIsSaving(true);

    const { data: existing } = await supabase
      .from('global_settings')
      .select('id')
      .eq('key', 'contact_info')
      .maybeSingle();

    if (existing) {
      await supabase
        .from('global_settings')
        .update({ value: settings, updated_at: new Date().toISOString() })
        .eq('key', 'contact_info');
    } else {
      await supabase.from('global_settings').insert([
        {
          key: 'contact_info',
          value: settings,
        },
      ]);
    }

    setIsSaving(false);
    alert('Contact information saved successfully');
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold">Contact Information</h1>
          <p className="text-neutral-mid mt-1">
            Update contact details shown on the website
          </p>
        </div>
        <Button onClick={handleSave} isLoading={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="space-y-6">
        <div className="bg-surface rounded-lg border border-neutral-light p-6">
          <h2 className="font-display font-semibold mb-6">Primary Contact</h2>

          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Mail className="w-4 h-4 text-neutral-mid" />
                Email Address
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="hello@optal.co"
                className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
              />
              <p className="text-xs text-neutral-mid mt-1">
                Used in contact forms, footer, and mailto links
              </p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Phone className="w-4 h-4 text-neutral-mid" />
                Phone Number (Display Format)
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="+251 91 234 5678"
                className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
              />
              <p className="text-xs text-neutral-mid mt-1">
                How the phone number appears on the website (with spaces)
              </p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <MapPin className="w-4 h-4 text-neutral-mid" />
                Location
              </label>
              <input
                type="text"
                value={settings.location}
                onChange={(e) => setSettings((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="Addis Ababa, Ethiopia"
                className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-lg border border-neutral-light p-6">
          <h2 className="font-display font-semibold mb-6">Messaging Platforms</h2>

          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <MessageCircle className="w-4 h-4 text-neutral-mid" />
                WhatsApp Number
              </label>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={(e) => setSettings((prev) => ({ ...prev, whatsapp: e.target.value }))}
                placeholder="251912345678"
                className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
              />
              <p className="text-xs text-neutral-mid mt-1">
                Phone number without spaces or + (e.g., 251912345678)
              </p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Send className="w-4 h-4 text-neutral-mid" />
                Telegram Username
              </label>
              <input
                type="text"
                value={settings.telegram}
                onChange={(e) => setSettings((prev) => ({ ...prev, telegram: e.target.value }))}
                placeholder="optalcomms"
                className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
              />
              <p className="text-xs text-neutral-mid mt-1">
                Username without @ symbol
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Preview</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>
              <strong>Email:</strong> {settings.email || 'Not set'}
            </p>
            <p>
              <strong>Phone:</strong> {settings.phone || 'Not set'}
            </p>
            <p>
              <strong>WhatsApp:</strong> https://wa.me/{settings.whatsapp || 'Not set'}
            </p>
            <p>
              <strong>Telegram:</strong> https://t.me/{settings.telegram || 'Not set'}
            </p>
            <p>
              <strong>Location:</strong> {settings.location || 'Not set'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
