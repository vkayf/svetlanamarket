import { useState, useRef, useCallback } from 'react';

type VoiceResult = {
  transcript: string;
  product: string | null;
  quantity: number | null;
  action: 'sell' | 'stock_in' | 'stock_out' | null;
};

export function useVoice() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  const parseTranscript = useCallback((text: string): VoiceResult => {
    const lower = text.toLowerCase();
    let action: VoiceResult['action'] = null;
    let quantity: number | null = null;
    let product: string | null = null;

    // Detect action (Russian)
    if (/прода[йжт]|продать|продаю/.test(lower)) action = 'sell';
    else if (/приход|принять|приня[лт]|пришл/.test(lower)) action = 'stock_in';
    else if (/расход|списа[тн]|убра[тл]/.test(lower)) action = 'stock_out';

    // Detect action (Uzbek)
    if (/sot|sotish/.test(lower)) action = 'sell';
    else if (/kirim|kel/.test(lower)) action = action || 'stock_in';
    else if (/chiqim/.test(lower)) action = action || 'stock_out';

    // Detect quantity
    const numMatch = lower.match(/(\d+)/);
    if (numMatch) quantity = parseInt(numMatch[1]);

    // Word-to-number (Russian)
    const wordNums: Record<string, number> = {
      'один': 1, 'одну': 1, 'одно': 1, 'два': 2, 'две': 2, 'три': 3,
      'четыре': 4, 'пять': 5, 'шесть': 6, 'семь': 7, 'восемь': 8,
      'девять': 9, 'десять': 10, 'двадцать': 20, 'тридцать': 30,
    };
    if (!quantity) {
      for (const [word, num] of Object.entries(wordNums)) {
        if (lower.includes(word)) { quantity = num; break; }
      }
    }

    // Product is everything that's not action/quantity words
    const cleanedWords = lower
      .replace(/прода[йжт]|продать|продаю|приход|принять|расход|списать|sot|sotish|kirim|chiqim/g, '')
      .replace(/\d+/g, '')
      .replace(/штук[аи]?|шт|кг|литр|dona|kilogram/g, '')
      .replace(Object.keys(wordNums).join('|'), '')
      .trim();
    
    if (cleanedWords.length > 1) product = cleanedWords;

    return { transcript: text, product, quantity, action };
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript;
      }
      setTranscript(finalTranscript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, []);

  const stopListening = useCallback((): VoiceResult | null => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    if (transcript) {
      return parseTranscript(transcript);
    }
    return null;
  }, [transcript, parseTranscript]);

  const reset = useCallback(() => {
    setTranscript('');
  }, []);

  return { isListening, transcript, supported, startListening, stopListening, reset, parseTranscript };
}
