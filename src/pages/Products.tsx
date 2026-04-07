import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProducts } from '@/hooks/useProducts';
import { Plus, Search, Edit2, Trash2, Send } from 'lucide-react';
import { ProductFormDialog } from '@/components/ProductFormDialog';
import { Product } from '@/lib/supabase';
import { getCategories } from '@/lib/i18n';
import { toast } from 'sonner';

const Products = () => {
  const { t, lang } = useLanguage();
  const { products, loading, deleteProduct } = useProducts();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const categories = getCategories(lang);
  const uniqueCategories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return Array.from(cats);
  }, [products]);

  const filtered = useMemo(() => {
    let items = products;
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(p => p.name.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q));
    }
    if (category) {
      items = items.filter(p => p.category === category);
    }
    return items;
  }, [products, search, category]);

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      toast.success(t('status.success'));
    } catch {
      toast.error(t('status.error'));
    }
  };

  const generateTelegramOrder = (product: Product) => {
    const text = `📦 Заказ:\n${product.name}\nОстаток: ${product.stock}\nНужно: ${product.min_stock * 2}\n\nПожалуйста, уточните наличие и цену.`;
    navigator.clipboard.writeText(text);
    toast.success(t('telegram.copy'));
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">{t('status.loading')}</div>;
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">{t('nav.products')} ({products.length})</h2>
        <button
          onClick={() => { setEditProduct(null); setFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> {t('action.add')}
        </button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            placeholder={t('action.search')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="px-3 py-2.5 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">{t('product.all')}</option>
          {uniqueCategories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        {filtered.map(p => (
          <div key={p.id} className="glass-card-hover p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.category}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-foreground">{p.sell_price?.toLocaleString()}</p>
              <p className={`text-xs ${p.stock <= p.min_stock ? 'text-destructive font-semibold' : 'text-muted-foreground'}`}>
                {t('product.stock')}: {p.stock}
              </p>
            </div>
            <div className="flex gap-1 shrink-0">
              {p.supplier_telegram && (
                <button onClick={() => generateTelegramOrder(p)} className="p-2 text-muted-foreground hover:text-primary transition-colors" title="Telegram">
                  <Send size={14} />
                </button>
              )}
              <button onClick={() => { setEditProduct(p); setFormOpen(true); }} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                <Edit2 size={14} />
              </button>
              <button onClick={() => handleDelete(p.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center py-8 text-muted-foreground">{t('status.empty')}</p>
        )}
      </div>

      <ProductFormDialog 
        open={formOpen} 
        onClose={() => { setFormOpen(false); setEditProduct(null); }} 
        product={editProduct} 
      />
    </div>
  );
};

export default Products;
