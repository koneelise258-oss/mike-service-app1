import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Brand, PhoneModel } from '@/types';

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data && mounted) {
        setBrands(data as Brand[]);
      }
      if (mounted) setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return { brands, loading };
}

export function usePhoneModels(brandSlug?: string) {
  const [models, setModels] = useState<PhoneModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      let query = supabase
        .from('phone_models')
        .select('*, brand:brands(*)')
        .order('display_order', { ascending: true });

      if (brandSlug) {
        query = query.eq('brand_id', `(
          SELECT id FROM brands WHERE slug = '${brandSlug}'
        )`);
      }

      const { data, error } = await query;

      if (!error && data && mounted) {
        setModels(data as PhoneModel[]);
      }
      if (mounted) setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [brandSlug]);

  return { models, loading };
}

export function usePhoneModel(brandSlug: string, modelSlug: string) {
  const [model, setModel] = useState<PhoneModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data, error } = await supabase
        .from('phone_models')
        .select('*, brand:brands(*)')
        .eq('slug', modelSlug)
        .filter('brand.slug', 'eq', brandSlug)
        .maybeSingle();

      if (!error && data && mounted) {
        setModel(data as PhoneModel);
      }
      if (mounted) setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [brandSlug, modelSlug]);

  return { model, loading };
}
