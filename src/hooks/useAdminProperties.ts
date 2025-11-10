import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SupabaseProperty, Property, convertSupabasePropertyToProperty } from './useSupabaseProperties';

// Extended interface for admin properties that includes publish status
export interface AdminProperty extends Property {
  isPublished: boolean;
  status: 'active' | 'sold' | 'inactive';
  primaryImageUrl?: string;
}

// Convert SupabaseProperty to AdminProperty
const convertSupabasePropertyToAdminProperty = (supabaseProperty: SupabaseProperty & { is_published: boolean; status: 'active' | 'sold' | 'inactive' }): AdminProperty => {
  const baseProperty = convertSupabasePropertyToProperty(supabaseProperty);
  
  // Find primary image or first image for thumbnail
  const primaryImageUrl = supabaseProperty.property_images?.find(img => img.is_primary)?.image_url 
    || supabaseProperty.property_images?.[0]?.image_url;
  
  return {
    ...baseProperty,
    isPublished: supabaseProperty.is_published || false,
    status: supabaseProperty.status || 'active',
    primaryImageUrl,
  };
};

export const useAdminProperties = () => {
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('properties')
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

      if (error) {
        throw error;
      }

      const convertedProperties = data?.map(convertSupabasePropertyToAdminProperty) || [];
      setProperties(convertedProperties);
    } catch (err) {
      console.error('Error fetching admin properties:', err);
      setError(err instanceof Error ? err.message : 'Falha ao buscar imóveis');
    } finally {
      setLoading(false);
    }
  };

  const getPropertyById = useCallback(async (id: string): Promise<AdminProperty | null> => {
    try {
      const { data, error } = await supabase
        .from('properties')
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

      if (error) {
        throw error;
      }

      return data ? convertSupabasePropertyToAdminProperty(data) : null;
    } catch (err) {
      console.error('Error fetching property:', err);
      return null;
    }
  }, []);

  const getPropertyByCode = useCallback(async (code: string): Promise<AdminProperty | null> => {
    try {
      const { data, error } = await supabase
        .from('properties')
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

      if (error) {
        throw error;
      }

      return data ? convertSupabasePropertyToAdminProperty(data) : null;
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