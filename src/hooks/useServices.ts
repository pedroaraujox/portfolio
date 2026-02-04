import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Service } from '../types';

export const useServices = (isAdmin: boolean = false) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        let query = supabase
          .from('services')
          .select('*')
          .order('display_order', { ascending: true });

        if (!isAdmin) {
          query = query.eq('is_active', true);
        }

        const { data, error } = await query;

        if (error) throw error;

        setServices(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();

    const channel = supabase
      .channel('services_db_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'services',
        },
        () => {
          fetchServices();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  return { services, loading, error };
};
