import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProducts } from '@/hooks/useProducts';
import { useOperations } from '@/hooks/useOperations';
import { useCash } from '@/hooks/useCash';
import { useCredits } from '@/hooks/useCredits';
import { Search, ShoppingCart, PackagePlus, AlertTriangle, TrendingUp, Wallet, Users, Mic } from 'lucide-react';
import { SellDialog } from '@/components/SellDialog';
import { StockInDialog } from '@/components/StockInDialog';
import { VoiceDialog } from '@/components/VoiceDialog';

const Dashboard = () => {
  const { t } = useLanguage();
  const { products, lowStockProducts, loading } = useProducts();
  const { operations } = useOperations();
  const { totals } = useCash();
  const { totalPending } = useCredits();
  const [search, setSearch] = useState('');
  const [sellOpen, setSellOpen] = useState(false);
  const [stockInOpen, setStockInOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);

  const todayOps = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return operations.filter(o => o.created_at?.startsWith(today));
  }, [operations]);

  const todayRevenue = useMemo(() => {
    return todayOps
      .filter(o => o.type === 'sale')
      .reduce((sum, o) => sum + Math.abs(o.quantity), 0);
  }, [todayOps]);

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(q)).slice(0, 8);
  }, [search, products]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">{t('status.loading')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
        <input
          type="text"
          placeholder={t('action.search') + '...'}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
        {searchResults.length > 0 && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-card border border-border rounded-xl shadow-2xl z-10 max-h-64 overflow-y-auto">
            {searchResults.map(p => (
              <button
                key={p.id}
                onClick={() => { setSearch(''); setSellOpen(true); }}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors text-left"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{p.sell_price?.toLocaleString()}</p>
                  <p className={`text-xs ${p.stock <= p.min_stock ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {t('product.stock')}: {p.stock}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => setSellOpen(true)}
          className="glass-card-hover flex flex-col items-center gap-2 p-5"
        >
          <ShoppingCart size={24} className="text-primary" />
          <span className="text-sm font-medium text-foreground">{t('action.sell')}</span>
        </button>
        <button
          onClick={() => setStockInOpen(true)}
          className="glass-card-hover flex flex-col items-center gap-2 p-5"
        >
          <PackagePlus size={24} className="text-primary" />
          <span className="text-sm font-medium text-foreground">{t('action.stock_in')}</span>
        </button>
        <button
          onClick={() => setVoiceOpen(true)}
          className="glass-card-hover flex flex-col items-center gap-2 p-5 relative"
        >
          <Mic size={24} className="text-primary" />
          <span className="text-sm font-medium text-foreground">{t('voice.start')}</span>
        </button>
        <div className="glass-card flex flex-col items-center gap-1 p-5">
          <AlertTriangle size={24} className={lowStockProducts.length > 0 ? 'text-warning' : 'text-muted-foreground'} />
          <span className="text-lg font-bold text-foreground">{lowStockProducts.length}</span>
          <span className="text-xs text-muted-foreground">{t('product.low_stock')}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-primary" />
            <span className="text-xs text-muted-foreground">{t('today')}</span>
          </div>
          <p className="text-lg font-bold text-foreground">{todayOps.length}</p>
          <p className="text-xs text-muted-foreground">{t('nav.operations')}</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wallet size={16} className="text-primary" />
            <span className="text-xs text-muted-foreground">{t('cash.revenue')}</span>
          </div>
          <p className="text-lg font-bold text-foreground">{totals.revenue.toLocaleString()}</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-destructive" />
            <span className="text-xs text-muted-foreground">{t('nav.credits')}</span>
          </div>
          <p className="text-lg font-bold text-foreground">{totalPending.toLocaleString()}</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <PackagePlus size={16} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{t('nav.products')}</span>
          </div>
          <p className="text-lg font-bold text-foreground">{products.length}</p>
        </div>
      </div>

      {/* Low stock alerts */}
      {lowStockProducts.length > 0 && (
        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold text-warning mb-3 flex items-center gap-2">
            <AlertTriangle size={16} />
            {t('product.low_stock')} ({lowStockProducts.length})
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {lowStockProducts.map(p => (
              <div key={p.id} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                <span className="text-sm text-foreground">{p.name}</span>
                <span className="text-sm font-mono text-destructive">{p.stock} / {p.min_stock}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent operations */}
      {todayOps.length > 0 && (
        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">{t('today')} — {t('nav.operations')}</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {todayOps.slice(0, 10).map(op => (
              <div key={op.id} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                <div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    op.type === 'sale' ? 'bg-primary/10 text-primary' :
                    op.type === 'stock_in' ? 'bg-success/10 text-success' :
                    'bg-muted text-muted-foreground'
                  }`}>{t(`action.${op.type === 'sale' ? 'sell' : op.type}`)}</span>
                </div>
                <span className="text-sm text-muted-foreground">{op.quantity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <SellDialog open={sellOpen} onClose={() => setSellOpen(false)} />
      <StockInDialog open={stockInOpen} onClose={() => setStockInOpen(false)} />
      <VoiceDialog open={voiceOpen} onClose={() => setVoiceOpen(false)} />
    </div>
  );
};

export default Dashboard;
