import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProducts } from '@/hooks/useProducts';
import { useOperations } from '@/hooks/useOperations';
import { X, Search, Minus, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function StockInDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLanguage();
  const { products, updateProduct } = useProducts();
  const { addOperation } = useOperations();
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [costPrice, setCostPrice] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return products.slice(0, 20);
    const q = search.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(q)).slice(0, 20);
  }, [products, search]);

  const selected = products.find(p => p.id === selectedId);

  const handleStockIn = async () => {
    if (!selected || quantity <= 0) return;
    try {
      await updateProduct(selected.id, { stock: selected.stock + quantity });
      await addOperation({ product_id: selected.id, type: 'stock_in', quantity, note: null });
      // Add batch
      await supabase.from('batches').insert({
        product_id: selected.id,
        quantity,
        cost_price: costPrice ? Number(costPrice) : selected.cost_price,
        date: new Date().toISOString().slice(0, 10),
      });
      toast.success(t('status.success'));
      setSelectedId(null);
      setQuantity(1);
      setCostPrice('');
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
          <h3 className="text-lg font-bold text-foreground">{t('action.stock_in')}</h3>
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
                  onClick={() => { setSelectedId(p.id); setCostPrice(String(p.cost_price || '')); }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-secondary/80 transition-colors text-left"
                >
                  <span className="text-sm font-medium text-foreground">{p.name}</span>
                  <span className="text-xs text-muted-foreground">{p.stock} шт</span>
                </button>
              ))}
            </div>
          </>
        ) : selected ? (
          <>
            <div className="glass-card p-4 text-center">
              <p className="text-lg font-semibold text-foreground">{selected.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('product.stock')}: {selected.stock}</p>
            </div>
            <div className="flex items-center justify-center gap-4">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 bg-secondary rounded-xl text-foreground">
                <Minus size={20} />
              </button>
              <span className="text-3xl font-bold text-foreground w-16 text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-3 bg-secondary rounded-xl text-foreground">
                <Plus size={20} />
              </button>
            </div>
            <input
              type="number"
              placeholder={t('product.cost_price')}
              value={costPrice}
              onChange={e => setCostPrice(e.target.value)}
              className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground"
            />
            <div className="flex gap-2">
              <button onClick={() => setSelectedId(null)} className="flex-1 py-3 bg-secondary text-secondary-foreground rounded-xl text-sm font-medium">
                {t('action.cancel')}
              </button>
              <button onClick={handleStockIn} className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium">
                {t('action.confirm')}
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
