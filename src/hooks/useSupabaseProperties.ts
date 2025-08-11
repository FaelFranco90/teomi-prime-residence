import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { resolveImageUrl } from '@/lib/assetResolver';

export interface PropertyImage {
  id: string;
  property_id: string;
  image_url: string;
  is_primary: boolean;
  order_index: number;
}

export interface SupabaseProperty {
  id: string;
  code: string;
  title: string;
  location: string;
  price: string;
  price_number: number;
  area: string;
  area_number: number;
  bedrooms: number;
  bathrooms: number;
  suites: number;
  parking: number;
  property_type?: string;
  is_featured: boolean;
  is_exclusive: boolean;
  has_virtual_tour: boolean;
  is_gated_community: boolean;
  is_new: boolean;
  description?: string;
  youtube_video_url?: string;
  created_at: string;
  updated_at: string;
  property_images: PropertyImage[];
}

// Adapter to convert SupabaseProperty to legacy Property format
export interface Property {
  id: string;
  code: string;
  title: string;
  location: string;
  price: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  suites: number;
  parking: number;
  images: string[];
  featured?: boolean;
  exclusive?: boolean;
  virtualTour?: boolean;
  gatedCommunity?: boolean;
  isNew?: boolean;
  propertyType?: string;
  youtubeVideoUrl?: string;
  priceNumber: number;
  areaNumber: number;
  createdAt: string;
}

export const convertSupabasePropertyToProperty = (supabaseProperty: SupabaseProperty): Property => {
  try {
    const createdAt = supabaseProperty.created_at ? new Date(supabaseProperty.created_at) : new Date();
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
    const isNew = Date.now() - createdAt.getTime() <= THIRTY_DAYS_MS;

    // Process images with defensive checks
    let images: string[] = [];
    if (Array.isArray(supabaseProperty.property_images)) {
      images = supabaseProperty.property_images
        .filter(img => img && typeof img === 'object' && img.image_url) // Filter out invalid entries
        .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
        .map(img => resolveImageUrl(img.image_url))
        .filter(url => url && url !== '/placeholder.svg'); // Remove failed resolutions
    }

    // Ensure at least one placeholder if no valid images
    if (images.length === 0) {
      images = ['/placeholder.svg'];
    }

    return {
      id: supabaseProperty.id || '',
      code: supabaseProperty.code || 'N/A',
      title: supabaseProperty.title || 'Imóvel sem título',
      location: supabaseProperty.location || 'Localização não informada',
      price: supabaseProperty.price || 'Preço sob consulta',
      area: supabaseProperty.area || 'N/A',
      bedrooms: supabaseProperty.bedrooms || 0,
      bathrooms: supabaseProperty.bathrooms || 0,
      suites: supabaseProperty.suites || 0,
      parking: supabaseProperty.parking || 0,
      images,
      featured: supabaseProperty.is_featured || false,
      exclusive: supabaseProperty.is_exclusive || false,
      virtualTour: supabaseProperty.has_virtual_tour || false,
      gatedCommunity: supabaseProperty.is_gated_community || false,
      isNew,
      propertyType: supabaseProperty.property_type || undefined,
      youtubeVideoUrl: supabaseProperty.youtube_video_url || undefined,
      priceNumber: supabaseProperty.price_number || 0,
      areaNumber: supabaseProperty.area_number || 0,
      createdAt: supabaseProperty.created_at || '',
    };
  } catch (error) {
    console.error('Error converting Supabase property:', error, 'property:', supabaseProperty);
    // Return a safe fallback object
    return {
      id: supabaseProperty?.id || '',
      code: supabaseProperty?.code || 'N/A',
      title: 'Erro ao carregar imóvel',
      location: 'Localização indisponível',
      price: 'Preço indisponível',
      area: 'N/A',
      bedrooms: 0,
      bathrooms: 0,
      suites: 0,
      parking: 0,
      images: ['/placeholder.svg'],
      featured: false,
      exclusive: false,
      virtualTour: false,
      gatedCommunity: false,
      isNew: false,
      propertyType: undefined,
      youtubeVideoUrl: undefined,
      priceNumber: 0,
      areaNumber: 0,
      createdAt: '',
    };
  }
};

export const useSupabaseProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
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
            order_index
          )
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const convertedProperties = data?.map(convertSupabasePropertyToProperty) || [];
      setProperties(convertedProperties);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err instanceof Error ? err.message : 'Falha ao buscar imóveis');
    } finally {
      setLoading(false);
    }
  };

  const getPropertyById = useCallback(async (id: string): Promise<Property | null> => {
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
            order_index
          )
        `)
        .eq('id', id)
        .eq('is_published', true)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data ? convertSupabasePropertyToProperty(data) : null;
    } catch (err) {
      console.error('Error fetching property:', err);
      return null;
    }
  }, []);

  const getPropertyByCode = useCallback(async (code: string): Promise<Property | null> => {
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
            order_index
          )
        `)
        .eq('code', code)
        .eq('is_published', true)
        .maybeSingle();

      if (error) {
        throw error;
      }

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