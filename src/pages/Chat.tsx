import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Send } from 'lucide-react';

type Message = {
  id: number;
  text: string;
  from: 'user' | 'ai';
  time: string;
};

const Chat = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Привет! Я AI-помощник SVETLANA MARKET. Пока я в режиме подготовки, но скоро смогу отвечать на вопросы о вашем магазине.', from: 'ai', time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: Date.now(),
      text: input.trim(),
      from: 'user',
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // AI placeholder response
    setTimeout(() => {
      const aiMsg: Message = {
        id: Date.now() + 1,
        text: 'AI модуль будет подключён позже. Сейчас я запомню ваш вопрос.',
        from: 'ai',
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-3rem)] animate-fade-in">
      <h2 className="text-xl font-bold text-foreground mb-4">{t('nav.chat')}</h2>

      <div className="flex-1 glass-card p-4 overflow-y-auto space-y-3 mb-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
              msg.from === 'user' 
                ? 'bg-primary text-primary-foreground rounded-br-sm' 
                : 'bg-secondary text-secondary-foreground rounded-bl-sm'
            }`}>
              <p>{msg.text}</p>
              <p className={`text-xs mt-1 ${msg.from === 'user' ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Спросите что-нибудь..."
          className="flex-1 px-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <button
          onClick={handleSend}
          className="px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default Chat;
