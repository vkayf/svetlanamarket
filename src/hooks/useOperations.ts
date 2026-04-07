import { useState, useEffect, useCallback } from 'react';
import { supabase, Operation } from '@/lib/supabase';

export function useOperations() {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOperations = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('operations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    setOperations(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOperations();
    const channelName = `operations-${Date.now()}-${Math.random()}`;
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'operations' }, () => {
        fetchOperations();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchOperations]);

  const addOperation = async (op: Omit<Operation, 'id' | 'created_at'>) => {
    const { error } = await supabase.from('operations').insert(op);
    if (error) throw new Error(error.message);
  };

  return { operations, loading, addOperation, refetch: fetchOperations };
}
