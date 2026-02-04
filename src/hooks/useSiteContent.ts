import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { SiteContent } from '../types';

export const useSiteContent = (pageName?: string) => {
  const [content, setContent] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        let query = supabase.from('site_content').select('*');
        
        if (pageName) {
          query = query.eq('page_name', pageName);
        }

        const { data, error } = await query;
        if (error) throw error;
        setContent(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();

    const channel = supabase
      .channel('site_content_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_content' }, () => fetchContent())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pageName]);

  const getContent = (section: string) => {
    return content.find(c => c.section_name === section);
  };

  return { content, getContent, loading, error };
};
