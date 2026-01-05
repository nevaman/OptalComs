import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface ContactSettings {
  email: string;
  phone: string;
  whatsapp: string;
  telegram: string;
  location: string;
}

interface ContactSettingsContextType {
  settings: ContactSettings;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: ContactSettings = {
  email: 'hello@optal.co',
  phone: '+251 91 234 5678',
  whatsapp: '+251912345678',
  telegram: 'optalcomms',
  location: 'Addis Ababa, Ethiopia',
};

const ContactSettingsContext = createContext<ContactSettingsContextType>({
  settings: defaultSettings,
  isLoading: false,
  refreshSettings: async () => {},
});

export function ContactSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ContactSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchSettings() {
    setIsLoading(true);
    const { data } = await supabase
      .from('global_settings')
      .select('*')
      .eq('key', 'contact_info')
      .maybeSingle();

    if (data?.value) {
      setSettings({ ...defaultSettings, ...(data.value as Partial<ContactSettings>) });
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <ContactSettingsContext.Provider value={{ settings, isLoading, refreshSettings: fetchSettings }}>
      {children}
    </ContactSettingsContext.Provider>
  );
}

export function useContactSettings() {
  return useContext(ContactSettingsContext);
}
