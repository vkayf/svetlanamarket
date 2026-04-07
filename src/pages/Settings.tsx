import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

const SettingsPage = () => {
  const { t, lang, setLang } = useLanguage();

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-foreground">{t('nav.settings')}</h2>

      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Globe size={16} className="text-primary" />
          Язык / Til
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setLang('ru')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              lang === 'ru' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            }`}
          >
            Русский
          </button>
          <button
            onClick={() => setLang('uz')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              lang === 'uz' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            }`}
          >
            O'zbekcha
          </button>
        </div>
      </div>

      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-2">SVETLANA MARKET v1.0</h3>
        <p className="text-xs text-muted-foreground">
          Система управления магазином. Голосовой ввод, аналитика, управление товарами и кассой.
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;
