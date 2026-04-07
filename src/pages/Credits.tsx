import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCredits } from '@/hooks/useCredits';
import { Plus, Check, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const Credits = () => {
  const { t } = useLanguage();
  const { credits, loading, addCredit, updateCredit, totalPending } = useCredits();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !amount || Number(amount) <= 0) return;
    try {
      await addCredit({
        customer_name: name.trim(),
        amount: Number(amount),
        status: 'pending',
        date: new Date().toISOString().slice(0, 10),
      });
      setName('');
      setAmount('');
      setShowForm(false);
      toast.success(t('status.success'));
    } catch {
      toast.error(t('status.error'));
    }
  };

  const markPaid = async (id: string) => {
    try {
      await updateCredit(id, { status: 'paid' });
      toast.success(t('status.success'));
    } catch {
      toast.error(t('status.error'));
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">{t('status.loading')}</div>;
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">{t('nav.credits')}</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
        >
          <Plus size={16} /> {t('action.add')}
        </button>
      </div>

      <div className="glass-card p-4">
        <p className="text-xs text-muted-foreground">{t('total')} {t('credit.pending').toLowerCase()}</p>
        <p className="text-2xl font-bold text-destructive">{totalPending.toLocaleString()}</p>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card p-4 space-y-3 animate-slide-up">
          <input
            type="text"
            placeholder={t('credit.customer')}
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground"
          />
          <input
            type="number"
            placeholder={t('credit.amount')}
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground"
            min="0"
          />
          <button type="submit" className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
            {t('action.save')}
          </button>
        </form>
      )}

      <div className="space-y-2">
        {credits.map(c => (
          <div key={c.id} className="glass-card p-4 flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{c.customer_name}</p>
              <p className="text-xs text-muted-foreground">{new Date(c.date).toLocaleDateString('ru-RU')}</p>
            </div>
            <p className="text-sm font-mono font-bold text-foreground">{c.amount.toLocaleString()}</p>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              c.status === 'paid' ? 'bg-primary/10 text-primary' :
              c.status === 'overdue' ? 'bg-destructive/10 text-destructive' :
              'bg-warning/10 text-warning'
            }`}>
              {t(`credit.${c.status}`)}
            </span>
            {c.status !== 'paid' && (
              <button onClick={() => markPaid(c.id)} className="p-2 text-muted-foreground hover:text-primary transition-colors">
                <Check size={16} />
              </button>
            )}
          </div>
        ))}
        {credits.length === 0 && (
          <p className="text-center py-8 text-muted-foreground">{t('status.empty')}</p>
        )}
      </div>
    </div>
  );
};

export default Credits;
