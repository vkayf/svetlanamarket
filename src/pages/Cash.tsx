import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCash } from '@/hooks/useCash';
import { Plus, TrendingUp, TrendingDown, ArrowDownCircle } from 'lucide-react';
import { toast } from 'sonner';

const Cash = () => {
  const { t } = useLanguage();
  const { logs, loading, addLog, totals } = useCash();
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<'revenue' | 'expense' | 'withdrawal'>('revenue');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    try {
      await addLog({ type, amount: Number(amount), description: description || null });
      setAmount('');
      setDescription('');
      setShowForm(false);
      toast.success(t('status.success'));
    } catch {
      toast.error(t('status.error'));
    }
  };

  const balance = totals.revenue - totals.expenses - totals.withdrawals;

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">{t('status.loading')}</div>;
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">{t('nav.cash')}</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
        >
          <Plus size={16} /> {t('action.add')}
        </button>
      </div>

      {/* Balance cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground mb-1">{t('cash.balance')}</p>
          <p className={`text-xl font-bold ${balance >= 0 ? 'text-primary' : 'text-destructive'}`}>
            {balance.toLocaleString()}
          </p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-1 mb-1">
            <TrendingUp size={12} className="text-primary" />
            <p className="text-xs text-muted-foreground">{t('cash.revenue')}</p>
          </div>
          <p className="text-lg font-bold text-foreground">{totals.revenue.toLocaleString()}</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-1 mb-1">
            <TrendingDown size={12} className="text-destructive" />
            <p className="text-xs text-muted-foreground">{t('cash.expense')}</p>
          </div>
          <p className="text-lg font-bold text-foreground">{totals.expenses.toLocaleString()}</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-1 mb-1">
            <ArrowDownCircle size={12} className="text-warning" />
            <p className="text-xs text-muted-foreground">{t('cash.withdrawal')}</p>
          </div>
          <p className="text-lg font-bold text-foreground">{totals.withdrawals.toLocaleString()}</p>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card p-4 space-y-3 animate-slide-up">
          <div className="flex gap-2">
            {(['revenue', 'expense', 'withdrawal'] as const).map(t2 => (
              <button
                key={t2}
                type="button"
                onClick={() => setType(t2)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                  type === t2 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {t(`cash.${t2}`)}
              </button>
            ))}
          </div>
          <input
            type="number"
            placeholder={t('credit.amount')}
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground"
            min="0"
            step="100"
          />
          <input
            type="text"
            placeholder={t('cash.description')}
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground"
          />
          <button type="submit" className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
            {t('action.save')}
          </button>
        </form>
      )}

      {/* Log list */}
      <div className="space-y-2">
        {logs.map(log => (
          <div key={log.id} className="glass-card p-3 flex items-center justify-between">
            <div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                log.type === 'revenue' ? 'bg-primary/10 text-primary' :
                log.type === 'expense' ? 'bg-destructive/10 text-destructive' :
                'bg-warning/10 text-warning'
              }`}>{t(`cash.${log.type}`)}</span>
              {log.description && <p className="text-xs text-muted-foreground mt-1">{log.description}</p>}
            </div>
            <div className="text-right">
              <p className={`text-sm font-mono font-semibold ${log.type === 'revenue' ? 'text-primary' : 'text-foreground'}`}>
                {log.type === 'revenue' ? '+' : '-'}{log.amount.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(log.created_at).toLocaleDateString('ru-RU')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cash;
