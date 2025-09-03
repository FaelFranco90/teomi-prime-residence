import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export interface OwnerStats {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  document: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  total_properties: number;
  active_properties: number;
  sold_properties: number;
  inactive_properties: number;
  last_property_created_at: string | null;
}

export function useOwnersManagement() {
  const [owners, setOwners] = useState<OwnerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOwners = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('owners_stats')
        .select('*')
        .order('total_properties', { ascending: false });

      if (fetchError) throw fetchError;
      
      setOwners(data as OwnerStats[]);
    } catch (err: any) {
      console.error('Error fetching owners stats:', err);
      setError(err.message || 'Erro ao carregar estatísticas dos proprietários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  return {
    owners,
    loading,
    error,
    refetch: fetchOwners
  };
}