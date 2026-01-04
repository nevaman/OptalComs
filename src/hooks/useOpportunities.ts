import { useCallback, useEffect, useState } from 'react';
import { Opportunity, supabase } from '../lib/supabase';

export function useOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOpportunities = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setOpportunities(data || []);
      setError(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchOpportunities();

    const channel = supabase
      .channel('public:opportunities')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'opportunities' },
        () => fetchOpportunities()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOpportunities]);

  return { opportunities, isLoading, error, refresh: fetchOpportunities };
}
