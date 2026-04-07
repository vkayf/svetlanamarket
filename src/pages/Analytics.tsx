import React, { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProducts } from '@/hooks/useProducts';
import { useOperations } from '@/hooks/useOperations';
import { useCash } from '@/hooks/useCash';
import { TrendingUp, AlertTriangle, Star, Lightbulb } from 'lucide-react';

const Analytics = () => {
  const { t } = useLanguage();
  const { products, lowStockProducts } = useProducts();
  const { operations } = useOperations();
  const { totals } = useCash();

  const topProducts = useMemo(() => {
    const sales: Record<string, number> = {};
    operations
      .filter(o => o.type === 'sale')
      .forEach(o => {
        sales[o.product_id] = (sales[o.product_id] || 0) + Math.abs(o.quantity);
      });
    return Object.entries(sales)
      .map(([id, qty]) => ({ product: products.find(p => p.id === id), qty }))
      .filter(x => x.product)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 10);
  }, [operations, products]);

  const slowProducts = useMemo(() => {
    const soldIds = new Set(operations.filter(o => o.type === 'sale').map(o => o.product_id));
    return products.filter(p => !soldIds.has(p.id) && p.stock > 0).slice(0, 10);
  }, [operations, products]);

  const profit = totals.revenue - totals.expenses;

  const suggestions = useMemo(() => {
    const s: string[] = [];
    if (lowStockProducts.length > 5) {
      s.push(t('analytics.low_stock') + `: ${lowStockProducts.length} товаров нужно заказать`);
    }
    if (slowProducts.length > 3) {
      s.push(`${slowProducts.length} товаров не продаются — рассмотрите скидку или списание`);
    }
    if (profit < 0) {
      s.push('Расходы превышают выручку — проверьте наценки');
    }
    if (topProducts.length > 0) {
      s.push(`Лидер продаж: ${topProducts[0].product?.name} (${topProducts[0].qty} шт)`);
    }
    return s;
  }, [lowStockProducts, slowProducts, profit, topProducts, t]);

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-xl font-bold text-foreground">{t('nav.analytics')}</h2>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground mb-1">{t('analytics.revenue')}</p>
          <p className="text-2xl font-bold text-primary">{totals.revenue.toLocaleString()}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground mb-1">{t('analytics.profit')}</p>
          <p className={`text-2xl font-bold ${profit >= 0 ? 'text-primary' : 'text-destructive'}`}>
            {profit.toLocaleString()}
          </p>
        </div>
        <div className="glass-card p-4 col-span-2 md:col-span-1">
          <p className="text-xs text-muted-foreground mb-1">{t('analytics.low_stock')}</p>
          <p className="text-2xl font-bold text-warning">{lowStockProducts.length}</p>
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Lightbulb size={16} className="text-warning" />
            {t('analytics.suggestions')}
          </h3>
          <div className="space-y-2">
            {suggestions.map((s, i) => (
              <p key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span> {s}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Top products */}
      {topProducts.length > 0 && (
        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Star size={16} className="text-primary" />
            {t('analytics.top_products')}
          </h3>
          <div className="space-y-2">
            {topProducts.map(({ product, qty }, i) => (
              <div key={product!.id} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground w-5">{i + 1}</span>
                  <span className="text-sm text-foreground">{product!.name}</span>
                </div>
                <span className="text-sm font-mono text-primary">{qty}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Slow products */}
      {slowProducts.length > 0 && (
        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <AlertTriangle size={16} className="text-muted-foreground" />
            Не продаются
          </h3>
          <div className="space-y-2">
            {slowProducts.map(p => (
              <div key={p.id} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                <span className="text-sm text-foreground">{p.name}</span>
                <span className="text-xs text-muted-foreground">{t('product.stock')}: {p.stock}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
