import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOperations } from '@/hooks/useOperations';
import { useProducts } from '@/hooks/useProducts';

const Operations = () => {
  const { t } = useLanguage();
  const { operations, loading } = useOperations();
  const { products } = useProducts();
  const [filter, setFilter] = useState('');

  const productMap = useMemo(() => {
    return Object.fromEntries(products.map(p => [p.id, p.name]));
  }, [products]);

  const filtered = useMemo(() => {
    if (!filter) return operations;
    return operations.filter(o => o.type === filter);
  }, [operations, filter]);

  const typeColor = (type: string) => {
    switch (type) {
      case 'sale': return 'bg-primary/10 text-primary';
      case 'stock_in': return 'bg-success/10 text-success';
      case 'stock_out': return 'bg-warning/10 text-warning';
      case 'correction': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">{t('status.loading')}</div>;
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-xl font-bold text-foreground">{t('nav.operations')}</h2>

      <div className="flex gap-2 overflow-x-auto">
        {['', 'sale', 'stock_in', 'stock_out', 'correction'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              filter === f ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {f ? t(`action.${f === 'sale' ? 'sell' : f}`) : t('product.all')}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map(op => (
          <div key={op.id} className="glass-card p-4 flex items-center gap-4">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${typeColor(op.type)}`}>
              {t(`action.${op.type === 'sale' ? 'sell' : op.type}`)}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate">{productMap[op.product_id] || op.product_id}</p>
              {op.note && <p className="text-xs text-muted-foreground truncate">{op.note}</p>}
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-mono font-semibold text-foreground">{op.quantity > 0 ? '+' : ''}{op.quantity}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(op.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center py-8 text-muted-foreground">{t('status.empty')}</p>
        )}
      </div>
    </div>
  );
};

export default Operations;
