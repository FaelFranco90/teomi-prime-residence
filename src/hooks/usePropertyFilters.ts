import { useState, useMemo } from 'react';

export interface PropertyFilters {
  propertyType: string;
  city: string;
  neighborhood: string;
  condoName: string;
  location: string; // Keep for legacy compatibility
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
  city?: string;
  neighborhood?: string;
  condoName?: string;
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
  city: '',
  neighborhood: '',
  condoName: '',
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

      // City Filter
      if (filters.city && (!property.city || !property.city.toLowerCase().includes(filters.city.toLowerCase()))) {
        return false;
      }

      // Neighborhood Filter
      if (filters.neighborhood && (!property.neighborhood || !property.neighborhood.toLowerCase().includes(filters.neighborhood.toLowerCase()))) {
        return false;
      }

      // Condo Name Filter
      if (filters.condoName && (!property.condoName || !property.condoName.toLowerCase().includes(filters.condoName.toLowerCase()))) {
        return false;
      }

      // Legacy Location Filter (searches across all location fields)
      if (filters.location) {
        const searchTerm = filters.location.toLowerCase();
        const matchesLocation = property.location.toLowerCase().includes(searchTerm) ||
          (property.city && property.city.toLowerCase().includes(searchTerm)) ||
          (property.neighborhood && property.neighborhood.toLowerCase().includes(searchTerm)) ||
          (property.condoName && property.condoName.toLowerCase().includes(searchTerm));
        if (!matchesLocation) {
          return false;
        }
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