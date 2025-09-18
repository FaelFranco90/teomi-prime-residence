import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LocationData {
  cities: string[];
  neighborhoods: string[];
  condos: string[];
}

// Cache with TTL (Time To Live)
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
let locationCache: { data: LocationData; timestamp: number } | null = null;
let fetchPromise: Promise<LocationData> | null = null;

const fetchLocationData = async (): Promise<LocationData> => {
  // Return cached data if still valid
  if (locationCache && Date.now() - locationCache.timestamp < CACHE_TTL) {
    return locationCache.data;
  }

  // Return existing promise if fetch is in progress
  if (fetchPromise) {
    return fetchPromise;
  }

  fetchPromise = (async () => {
    try {
      const { data, error } = await supabase
        .from('properties_public')
        .select('city, neighborhood, condo_name')
        .eq('is_published', true);
      
      if (error) throw error;

      const locationData: LocationData = {
        cities: Array.from(new Set(
          data?.map((d: any) => d.city).filter(Boolean) || []
        )).sort(),
        neighborhoods: Array.from(new Set(
          data?.map((d: any) => d.neighborhood).filter(Boolean) || []
        )).sort(),
        condos: Array.from(new Set(
          data?.map((d: any) => d.condo_name).filter(Boolean) || []
        )).sort()
      };

      // Update cache
      locationCache = {
        data: locationData,
        timestamp: Date.now()
      };

      return locationData;
    } catch (error) {
      console.error('Error fetching location data:', error);
      return { cities: [], neighborhoods: [], condos: [] };
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
};

export const useLocationCache = () => {
  const [locationData, setLocationData] = useState<LocationData>({
    cities: [],
    neighborhoods: [],
    condos: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchLocationData();
      setLocationData(data);
      setIsLoading(false);
    };

    loadData();
  }, []);

  return useMemo(() => ({
    ...locationData,
    isLoading
  }), [locationData, isLoading]);
};