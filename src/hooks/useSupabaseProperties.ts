import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  priceNumber: number;
  areaNumber: number;
}

const convertSupabasePropertyToProperty = (supabaseProperty: SupabaseProperty): Property => {
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
      .map(img => img.image_url),
    featured: supabaseProperty.is_featured,
    exclusive: supabaseProperty.is_exclusive,
    virtualTour: supabaseProperty.has_virtual_tour,
    gatedCommunity: supabaseProperty.is_gated_community,
    isNew: supabaseProperty.is_new,
    propertyType: supabaseProperty.property_type,
    priceNumber: supabaseProperty.price_number,
    areaNumber: supabaseProperty.area_number,
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
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
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
        .single();

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