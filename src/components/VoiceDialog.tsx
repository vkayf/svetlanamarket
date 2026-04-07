import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProducts } from '@/hooks/useProducts';
import { useOperations } from '@/hooks/useOperations';
import { useCash } from '@/hooks/useCash';
import { useVoice } from '@/hooks/useVoice';
import { X, Mic, MicOff, Search } from 'lucide-react';
import { toast } from 'sonner';

export function VoiceDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLanguage();
  const { products, updateProduct } = useProducts();
  const { addOperation } = useOperations();
  const { addLog } = useCash();
  const voice = useVoice();
  const [manualProduct, setManualProduct] = useState('');
  const [manualQty, setManualQty] = useState(1);
  const [parsed, setParsed] = useState<ReturnType<typeof voice.parseTranscript> | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const matchedProduct = useMemo(() => {
    const query = parsed?.product || manualProduct;
    if (!query) return null;
    const q = query.toLowerCase();
    return products.find(p => p.name.toLowerCase().includes(q));
  }, [parsed, manualProduct, products]);

  const handleToggleVoice = () => {
    if (voice.isListening) {
      const result = voice.stopListening();
      if (result) setParsed(result);
    } else {
      voice.reset();
      setParsed(null);
      setConfirmed(false);
      voice.startListening();
    }
  };

  const handleExecute = async () => {
    const product = matchedProduct;
    const qty = parsed?.quantity || manualQty;
    const action = parsed?.action || 'sell';
    if (!product) { toast.error('Товар не найден'); return; }

    try {
      if (action === 'sell') {
        if (product.stock < qty) { toast.error('Недостаточно на складе'); return; }
        await updateProduct(product.id, { stock: product.stock - qty });
        await addOperation({ product_id: product.id, type: 'sale', quantity: -qty, note: 'Голосовой ввод' });
        await addLog({ type: 'revenue', amount: product.sell_price * qty, description: `${product.name} x${qty} (голос)` });
      } else if (action === 'stock_in') {
        await updateProduct(product.id, { stock: product.stock + qty });
        await addOperation({ product_id: product.id, type: 'stock_in', quantity: qty, note: 'Голосовой ввод' });
      } else if (action === 'stock_out') {
        await updateProduct(product.id, { stock: Math.max(0, product.stock - qty) });
        await addOperation({ product_id: product.id, type: 'stock_out', quantity: -qty, note: 'Голосовой ввод' });
      }
      toast.success(t('status.success'));
      onClose();
      setParsed(null);
      voice.reset();
    } catch {
      toast.error(t('status.error'));
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end md:items-center justify-center p-4">
      <div className="w-full max-w-md glass-card p-5 space-y-4 animate-slide-up">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">{t('voice.start')}</h3>
          <button onClick={() => { onClose(); voice.reset(); setParsed(null); }} className="p-2 text-muted-foreground hover:text-foreground">
            <X size={18} />
          </button>
        </div>

        {!voice.supported ? (
          <p className="text-center text-muted-foreground py-4">{t('voice.not_supported')}</p>
        ) : (
          <>
            {/* Mic button */}
            <div className="flex justify-center">
              <button
                onClick={handleToggleVoice}
                className={`relative p-6 rounded-full transition-all ${
                  voice.isListening ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'
                }`}
              >
                {voice.isListening && (
                  <span className="absolute inset-0 rounded-full bg-destructive/20 animate-pulse-ring" />
                )}
                {voice.isListening ? <MicOff size={32} /> : <Mic size={32} />}
              </button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              {voice.isListening ? t('voice.listening') : voice.transcript || 'Нажмите на микрофон'}
            </p>

            {voice.transcript && (
              <div className="glass-card p-3 text-center">
                <p className="text-sm text-foreground">"{voice.transcript}"</p>
              </div>
            )}

            {/* Parsed result */}
            {parsed && (
              <div className="space-y-2">
                <div className="glass-card p-3 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Действие:</span>
                    <span className="text-foreground font-medium">
                      {parsed.action ? t(`action.${parsed.action === 'sell' ? 'sell' : parsed.action}`) : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Товар:</span>
                    <span className="text-foreground font-medium">{matchedProduct?.name || parsed.product || '—'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Кол-во:</span>
                    <span className="text-foreground font-medium">{parsed.quantity || manualQty}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Manual correction */}
            {(parsed || !voice.isListening) && !voice.isListening && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Ручная коррекция:</p>
                <input
                  type="text"
                  placeholder={t('product.name')}
                  value={manualProduct}
                  onChange={e => setManualProduct(e.target.value)}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground"
                />
                <input
                  type="number"
                  placeholder={t('quantity')}
                  value={manualQty}
                  onChange={e => setManualQty(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground"
                  min="1"
                />
              </div>
            )}

            {/* Execute */}
            {(parsed || manualProduct) && !voice.isListening && (
              <button
                onClick={handleExecute}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium"
              >
                {t('action.confirm')}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
