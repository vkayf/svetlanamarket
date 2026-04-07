import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProducts } from '@/hooks/useProducts';
import { X } from 'lucide-react';
import { Product } from '@/lib/supabase';
import { getCategories } from '@/lib/i18n';
import { toast } from 'sonner';

type Props = {
  open: boolean;
  onClose: () => void;
  product: Product | null;
};

export function ProductFormDialog({ open, onClose, product }: Props) {
  const { t, lang } = useLanguage();
  const { addProduct, updateProduct } = useProducts();
  const categories = getCategories(lang);

  const [form, setForm] = useState({
    name: '', category: categories[0] || '', cost_price: '', sell_price: '',
    stock: '', min_stock: '5', supplier_name: '', supplier_telegram: '',
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name, category: product.category, cost_price: String(product.cost_price),
        sell_price: String(product.sell_price), stock: String(product.stock),
        min_stock: String(product.min_stock), supplier_name: product.supplier_name || '',
        supplier_telegram: product.supplier_telegram || '',
      });
    } else {
      setForm({ name: '', category: categories[0] || '', cost_price: '', sell_price: '', stock: '', min_stock: '5', supplier_name: '', supplier_telegram: '' });
    }
  }, [product, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.sell_price) return;
    try {
      const data = {
        name: form.name.trim(),
        category: form.category,
        cost_price: Number(form.cost_price) || 0,
        sell_price: Number(form.sell_price),
        stock: Number(form.stock) || 0,
        min_stock: Number(form.min_stock) || 5,
        supplier_name: form.supplier_name || null,
        supplier_telegram: form.supplier_telegram || null,
      };
      if (product) {
        await updateProduct(product.id, data);
      } else {
        await addProduct(data as any);
      }
      toast.success(t('status.success'));
      onClose();
    } catch {
      toast.error(t('status.error'));
    }
  };

  if (!open) return null;

  const fields = [
    { key: 'name', label: t('product.name'), type: 'text', required: true },
    { key: 'cost_price', label: t('product.cost_price'), type: 'number' },
    { key: 'sell_price', label: t('product.sell_price'), type: 'number', required: true },
    { key: 'stock', label: t('product.stock'), type: 'number' },
    { key: 'min_stock', label: t('product.min_stock'), type: 'number' },
    { key: 'supplier_name', label: t('product.supplier'), type: 'text' },
    { key: 'supplier_telegram', label: t('product.supplier_telegram'), type: 'text' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end md:items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md glass-card p-5 space-y-3 animate-slide-up max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">{product ? t('action.edit') : t('action.add')}</h3>
          <button type="button" onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground"><X size={18} /></button>
        </div>

        <select
          value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })}
          className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground"
        >
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {fields.map(f => (
          <input
            key={f.key}
            type={f.type}
            placeholder={f.label}
            required={f.required}
            value={(form as any)[f.key]}
            onChange={e => setForm({ ...form, [f.key]: e.target.value })}
            className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground"
          />
        ))}

        <button type="submit" className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium">
          {t('action.save')}
        </button>
      </form>
    </div>
  );
}
