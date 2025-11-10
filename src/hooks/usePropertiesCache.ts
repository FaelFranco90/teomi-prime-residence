import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { resolveImageUrl } from '@/lib/assetResolver';
import { Property, SupabaseProperty, convertSupabasePropertyToProperty } from './useSupabaseProperties';

// Cache implementation with TTL
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let propertiesCache: { data: Property[]; timestamp: number } | null = null;
let fetchPromise: Promise<Property[]> | null = null;

const fetchPropertiesFromDB = async (): Promise<Property[]> => {
  // Return cached data if still valid
  if (propertiesCache && Date.now() - propertiesCache.timestamp < CACHE_TTL) {
    return propertiesCache.data;
  }

  // Return existing promise if fetch is in progress
  if (fetchPromise) {
    return fetchPromise;
  }

  fetchPromise = (async () => {
    try {
      const { data, error } = await supabase
        .from('properties_public')
        .select(`
          *,
          property_images (
            id,
            property_id,
            image_url,
            is_primary,
            is_public,
            order_index
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const convertedProperties = data?.map(convertSupabasePropertyToProperty) || [];
      
      // Update cache
      propertiesCache = {
        data: convertedProperties,
        timestamp: Date.now()
      };

      return convertedProperties;
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
};

export const usePropertiesCache = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPropertiesFromDB();
      setProperties(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao buscar imóveis');
    } finally {
      setLoading(false);
    }
  };

  const getPropertyById = useCallback(async (id: string): Promise<Property | null> => {
    try {
      // Try cache first
      if (propertiesCache) {
        const cached = propertiesCache.data.find(p => p.id === id);
        if (cached) return cached;
      }

      const { data, error } = await supabase
        .from('properties_public')
        .select(`
          *,
          property_images (
            id,
            property_id,
            image_url,
            is_primary,
            is_public,
            order_index
          )
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data ? convertSupabasePropertyToProperty(data) : null;
    } catch (err) {
      console.error('Error fetching property:', err);
      return null;
    }
  }, []);

  const getPropertyByCode = useCallback(async (code: string): Promise<Property | null> => {
    try {
      // Try cache first
      if (propertiesCache) {
        const cached = propertiesCache.data.find(p => p.code === code);
        if (cached) return cached;
      }

      const { data, error } = await supabase
        .from('properties_public')
        .select(`
          *,
          property_images (
            id,
            property_id,
            image_url,
            is_primary,
            is_public,
            order_index
          )
        `)
        .eq('code', code)
        .maybeSingle();

      if (error) throw error;
      return data ? convertSupabasePropertyToProperty(data) : null;
    } catch (err) {
      console.error('Error fetching property by code:', err);
      return null;
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, []);

  return useMemo(() => ({
    properties,
    loading,
    error,
    refetch: fetchProperties,
    getPropertyById,
    getPropertyByCode,
  }), [properties, loading, error, getPropertyById, getPropertyByCode]);
};