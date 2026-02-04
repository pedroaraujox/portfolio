import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Project } from '../types';

export const useProjects = (isAdmin: boolean = false) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        let query = supabase
          .from('projects')
          .select('*')
          .order('display_order', { ascending: true });

        if (!isAdmin) {
          query = query.eq('is_active', true);
        }

        const { data, error } = await query;

        if (error) throw error;

        setProjects(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();

    const channel = supabase
      .channel('projects_db_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
        },
        () => {
          fetchProjects();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  return { projects, loading, error };
};
