import { useState, useMemo } from 'react';

export interface PropertyFilters {
  propertyType: string;
  location: string;
  bedrooms: string;
  suites: string;
  parking: string;
  minArea: string;
  maxArea: string;
  minPrice: string;
  maxPrice: string;
  code: string;
}

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
  priceNumber?: number;
  areaNumber?: number;
  createdAt?: string;
}

const initialFilters: PropertyFilters = {
  propertyType: '',
  location: '',
  bedrooms: '',
  suites: '',
  parking: '',
  minArea: '',
  maxArea: '',
  minPrice: '',
  maxPrice: '',
  code: '',
};

export function usePropertyFilters(properties: Property[]) {
  const [filters, setFilters] = useState<PropertyFilters>(initialFilters);

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      // Property Type Filter
      if (filters.propertyType && property.propertyType !== filters.propertyType) {
        return false;
      }

      // Location Filter
      if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      // Bedrooms Filter
      if (filters.bedrooms) {
        const bedroomFilter = parseInt(filters.bedrooms);
        if (bedroomFilter === 5 && property.bedrooms < 5) return false;
        if (bedroomFilter !== 5 && property.bedrooms !== bedroomFilter) return false;
      }

      // Suites Filter
      if (filters.suites) {
        const suiteFilter = parseInt(filters.suites);
        if (suiteFilter === 4 && property.suites < 4) return false;
        if (suiteFilter !== 4 && property.suites !== suiteFilter) return false;
      }

      // Parking Filter
      if (filters.parking) {
        const parkingFilter = parseInt(filters.parking);
        if (parkingFilter === 5 && property.parking < 5) return false;
        if (parkingFilter !== 5 && property.parking !== parkingFilter) return false;
      }

      // Area Filter
      if (filters.minArea && property.areaNumber && property.areaNumber < parseInt(filters.minArea)) {
        return false;
      }
      if (filters.maxArea && property.areaNumber && property.areaNumber > parseInt(filters.maxArea)) {
        return false;
      }

      // Price Filter
      if (filters.minPrice && property.priceNumber && property.priceNumber < parseInt(filters.minPrice)) {
        return false;
      }
      if (filters.maxPrice && property.priceNumber && property.priceNumber > parseInt(filters.maxPrice)) {
        return false;
      }

      // Code Filter
      if (filters.code && !property.code.toLowerCase().includes(filters.code.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [properties, filters]);

  const updateFilter = (key: keyof PropertyFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return {
    filters,
    filteredProperties,
    updateFilter,
    clearFilters,
    hasActiveFilters,
  };
}