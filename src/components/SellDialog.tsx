import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProducts } from '@/hooks/useProducts';
import { useOperations } from '@/hooks/useOperations';
import { useCash } from '@/hooks/useCash';
import { X, Search, Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';

export function SellDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLanguage();
  const { products, updateProduct } = useProducts();
  const { addOperation } = useOperations();
  const { addLog } = useCash();
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const filtered = useMemo(() => {
    if (!search.trim()) return products.slice(0, 20);
    const q = search.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(q)).slice(0, 20);
  }, [products, search]);

  const selected = products.find(p => p.id === selectedId);

  const handleSell = async () => {
    if (!selected || quantity <= 0) return;
    if (selected.stock < quantity) {
      toast.error('Недостаточно на складе');
      return;
    }
    try {
      await updateProduct(selected.id, { stock: selected.stock - quantity });
      await addOperation({ product_id: selected.id, type: 'sale', quantity: -quantity, note: null });
      await addLog({ type: 'revenue', amount: selected.sell_price * quantity, description: `${selected.name} x${quantity}` });
      toast.success(t('status.success'));
      setSelectedId(null);
      setQuantity(1);
      setSearch('');
      onClose();
    } catch {
      toast.error(t('status.error'));
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end md:items-center justify-center p-4">
      <div className="w-full max-w-md glass-card p-5 space-y-4 animate-slide-up max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">{t('action.sell')}</h3>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground"><X size={18} /></button>
        </div>

        {!selectedId ? (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                autoFocus
                type="text"
                placeholder={t('action.search')}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {filtered.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-secondary/80 transition-colors text-left"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">{p.sell_price?.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{p.stock} шт</p>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : selected ? (
          <>
            <div className="glass-card p-4 text-center">
              <p className="text-lg font-semibold text-foreground">{selected.name}</p>
              <p className="text-2xl font-bold text-primary mt-1">{selected.sell_price?.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('product.stock')}: {selected.stock}</p>
            </div>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 bg-secondary rounded-xl text-foreground hover:bg-secondary/80"
              >
                <Minus size={20} />
              </button>
              <span className="text-3xl font-bold text-foreground w-16 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(selected.stock, quantity + 1))}
                className="p-3 bg-secondary rounded-xl text-foreground hover:bg-secondary/80"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">{t('total')}</p>
              <p className="text-2xl font-bold text-primary">{(selected.sell_price * quantity).toLocaleString()}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedId(null)}
                className="flex-1 py-3 bg-secondary text-secondary-foreground rounded-xl text-sm font-medium"
              >
                {t('action.cancel')}
              </button>
              <button
                onClick={handleSell}
                className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium"
              >
                {t('action.confirm')}
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
