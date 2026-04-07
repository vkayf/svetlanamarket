import { useState, useEffect, useCallback } from 'react';
import { supabase, CashLog } from '@/lib/supabase';

export function useCash() {
  const [logs, setLogs] = useState<CashLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('cash_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    setLogs(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLogs();
    const channelName = `cash-${Date.now()}-${Math.random()}`;
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cash_logs' }, () => {
        fetchLogs();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchLogs]);

  const addLog = async (log: Omit<CashLog, 'id' | 'created_at'>) => {
    const { error } = await supabase.from('cash_logs').insert(log);
    if (error) throw new Error(error.message);
  };

  const totals = logs.reduce(
    (acc, log) => {
      if (log.type === 'revenue') acc.revenue += log.amount;
      if (log.type === 'expense') acc.expenses += log.amount;
      if (log.type === 'withdrawal') acc.withdrawals += log.amount;
      return acc;
    },
    { revenue: 0, expenses: 0, withdrawals: 0 }
  );

  return { logs, loading, addLog, totals, refetch: fetchLogs };
}
