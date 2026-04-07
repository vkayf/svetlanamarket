import { useState, useEffect, useCallback } from 'react';
import { supabase, Credit } from '@/lib/supabase';

export function useCredits() {
  const [credits, setCredits] = useState<Credit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCredits = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('credits')
      .select('*')
      .order('created_at', { ascending: false });
    setCredits(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCredits();
    const channelName = `credits-${Date.now()}-${Math.random()}`;
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'credits' }, () => {
        fetchCredits();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchCredits]);

  const addCredit = async (credit: Omit<Credit, 'id' | 'created_at'>) => {
    const { error } = await supabase.from('credits').insert(credit);
    if (error) throw new Error(error.message);
  };

  const updateCredit = async (id: string, updates: Partial<Credit>) => {
    const { error } = await supabase.from('credits').update(updates).eq('id', id);
    if (error) throw new Error(error.message);
  };

  const totalPending = credits
    .filter(c => c.status === 'pending' || c.status === 'overdue')
    .reduce((sum, c) => sum + c.amount, 0);

  return { credits, loading, addCredit, updateCredit, totalPending, refetch: fetchCredits };
}
