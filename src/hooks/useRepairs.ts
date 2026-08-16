import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { RepairService, RepairOption, Accessory } from '@/types';

export function useRepairServices() {
  const [services, setServices] = useState<RepairService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data, error } = await supabase
        .from('repair_services')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data && mounted) {
        setServices(data as RepairService[]);
      }
      if (mounted) setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return { services, loading };
}

export function useRepairOptions(phoneModelId: string | undefined) {
  const [options, setOptions] = useState<RepairOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!phoneModelId) {
      setLoading(false);
      return;
    }
    let mounted = true;

    (async () => {
      const { data, error } = await supabase
        .from('repair_options')
        .select('*, repair_service:repair_services(*)')
        .eq('phone_model_id', phoneModelId)
        .order('display_order', { ascending: true });

      if (!error && data && mounted) {
        setOptions(data as RepairOption[]);
      }
      if (mounted) setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [phoneModelId]);

  return { options, loading };
}

export function useAccessories(category?: string) {
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      let query = supabase
        .from('accessories')
        .select('*')
        .order('display_order', { ascending: true });

      if (category && category !== 'Tous') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (!error && data && mounted) {
        setAccessories(data as Accessory[]);
      }
      if (mounted) setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [category]);

  return { accessories, loading };
  }
      
