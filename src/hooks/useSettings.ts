import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Settings } from '@/types';

let cachedSettings: Settings | null = null;

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(cachedSettings);
  const [loading, setLoading] = useState(!cachedSettings);

  useEffect(() => {
    if (cachedSettings) return;
    let mounted = true;

    (async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (!error && data && mounted) {
        cachedSettings = data as Settings;
        setSettings(data as Settings);
      }
      if (mounted) setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return { settings, loading };
}
