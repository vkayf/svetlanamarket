import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  LayoutDashboard, Package, ArrowLeftRight, Wallet, Users, BarChart3, 
  Settings, MessageSquare, Menu, X, Globe 
} from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, key: 'nav.dashboard' },
  { path: '/products', icon: Package, key: 'nav.products' },
  { path: '/operations', icon: ArrowLeftRight, key: 'nav.operations' },
  { path: '/cash', icon: Wallet, key: 'nav.cash' },
  { path: '/credits', icon: Users, key: 'nav.credits' },
  { path: '/analytics', icon: BarChart3, key: 'nav.analytics' },
  { path: '/chat', icon: MessageSquare, key: 'nav.chat' },
  { path: '/settings', icon: Settings, key: 'nav.settings' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { t, lang, setLang } = useLanguage();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card/50 p-4 gap-1">
        <div className="px-3 py-4 mb-4">
          <h1 className="text-xl font-bold text-gradient">SVETLANA</h1>
          <p className="text-xs text-muted-foreground">MARKET</p>
        </div>
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <item.icon size={18} />
              {t(item.key)}
            </Link>
          );
        })}
        <div className="mt-auto pt-4 border-t border-border">
          <button
            onClick={() => setLang(lang === 'ru' ? 'uz' : 'ru')}
            className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full rounded-lg hover:bg-secondary"
          >
            <Globe size={16} />
            {lang === 'ru' ? 'Ўзбекча' : 'Русский'}
          </button>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gradient">SVETLANA MARKET</h1>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-foreground">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-16">
          <nav className="flex flex-col gap-1 p-4">
            {navItems.map(item => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    active ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <item.icon size={20} />
                  {t(item.key)}
                </Link>
              );
            })}
            <button
              onClick={() => { setLang(lang === 'ru' ? 'uz' : 'ru'); setMobileOpen(false); }}
              className="flex items-center gap-3 px-4 py-3 text-base text-muted-foreground mt-4 border-t border-border pt-4"
            >
              <Globe size={20} />
              {lang === 'ru' ? 'Ўзбекча' : 'Русский'}
            </button>
          </nav>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 md:overflow-y-auto">
        <div className="pt-16 md:pt-0 p-4 md:p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
