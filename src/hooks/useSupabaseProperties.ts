import { useState, useEffect } from 'react';
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

const convertSupabasePropertyToProperty = (supabaseProperty: SupabaseProperty): Property => {
  const createdAt = new Date(supabaseProperty.created_at);
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
  const isNew = Date.now() - createdAt.getTime() <= THIRTY_DAYS_MS;

  return {
    id: supabaseProperty.id,
    code: supabaseProperty.code,
    title: supabaseProperty.title,
    location: supabaseProperty.location,
    price: supabaseProperty.price,
    area: supabaseProperty.area,
    bedrooms: supabaseProperty.bedrooms,
    bathrooms: supabaseProperty.bathrooms,
    suites: supabaseProperty.suites,
    parking: supabaseProperty.parking,
    images: supabaseProperty.property_images
      .sort((a, b) => a.order_index - b.order_index)
      .map(img => resolveImageUrl(img.image_url)),
    featured: supabaseProperty.is_featured,
    exclusive: supabaseProperty.is_exclusive,
    virtualTour: supabaseProperty.has_virtual_tour,
    gatedCommunity: supabaseProperty.is_gated_community,
    isNew,
    propertyType: supabaseProperty.property_type,
    youtubeVideoUrl: supabaseProperty.youtube_video_url,
    priceNumber: supabaseProperty.price_number,
    areaNumber: supabaseProperty.area_number,
    createdAt: supabaseProperty.created_at,
  };
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

  const getPropertyById = async (id: string): Promise<Property | null> => {
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
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data ? convertSupabasePropertyToProperty(data) : null;
    } catch (err) {
      console.error('Error fetching property:', err);
      return null;
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return {
    properties,
    loading,
    error,
    refetch: fetchProperties,
    getPropertyById,
  };
};