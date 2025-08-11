
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PropertyType {
  id: string;
  key: string;
  label: string;
  prefix: string;
  active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export const usePropertyTypes = () => {
  const [types, setTypes] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('property_types')
      .select('*')
      .order('order_index', { ascending: true })
      .order('label', { ascending: true });

    if (error) {
      console.error('Error fetching property_types:', error);
      setError(error.message);
      setTypes([]);
    } else {
      setTypes(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTypes();
  }, [fetchTypes]);

  const createType = async (payload: Pick<PropertyType, 'key' | 'label' | 'prefix'> & Partial<Pick<PropertyType, 'active' | 'order_index'>>) => {
    const { error } = await supabase.from('property_types').insert({
      key: payload.key.toLowerCase().trim(),
      label: payload.label.trim(),
      prefix: payload.prefix.toUpperCase().trim(),
      active: payload.active ?? true,
      order_index: payload.order_index ?? 0,
    });
    if (error) throw error;
    await fetchTypes();
  };

  const updateType = async (id: string, patch: Partial<Pick<PropertyType, 'key' | 'label' | 'prefix' | 'active' | 'order_index'>>) => {
    const payload: any = {};
    if (patch.key !== undefined) payload.key = patch.key.toLowerCase().trim();
    if (patch.label !== undefined) payload.label = patch.label.trim();
    if (patch.prefix !== undefined) payload.prefix = patch.prefix.toUpperCase().trim();
    if (patch.active !== undefined) payload.active = patch.active;
    if (patch.order_index !== undefined) payload.order_index = patch.order_index;

    const { error } = await supabase.from('property_types').update(payload).eq('id', id);
    if (error) throw error;
    await fetchTypes();
  };

  const deleteType = async (id: string) => {
    const { error } = await supabase.from('property_types').delete().eq('id', id);
    if (error) throw error;
    await fetchTypes();
  };

  return { types, loading, error, refetch: fetchTypes, createType, updateType, deleteType };
};
