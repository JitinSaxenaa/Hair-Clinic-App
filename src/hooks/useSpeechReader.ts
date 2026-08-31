'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// Extend window interface for GC protection
declare global {
  interface Window {
    __activeTTSUtterance?: SpeechSynthesisUtterance | null;
  }
}

/**
 * Normalizes text for clear, natural clinical text-to-speech pronunciation
 */
function normalizeForSpeech(text: string, lang: 'en' | 'hi'): string {
  if (!text) return '';

  let clean = text
    .replace(/\//g, ' or ')
    .replace(/PCOS or PCOD/gi, 'PCOS or P C O D')
    .replace(/PRP or GFC or iPRF/gi, 'P R P, G F C, or i P R F')
    .replace(/DNA/gi, 'D N A')
    .replace(/<3mo/gi, 'less than 3 months')
    .replace(/3-6mo/gi, '3 to 6 months')
    .replace(/>6mo/gi, 'more than 6 months')
    .replace(/1-3/gi, '1 to 3')
    .replace(/4-6/gi, '4 to 6')
    .replace(/>6/gi, 'more than 6')
    .replace(/<6 months/gi, 'less than 6 months')
    .replace(/6-12 months/gi, '6 to 12 months')
    .replace(/<1 year/gi, 'less than 1 year')
    .replace(/\s+/g, ' ')
    .trim();

  if (!clean.endsWith('.') && !clean.endsWith('?') && !clean.endsWith('!')) {
    clean += '.';
  }

  return clean;
}

export function useSpeechReader() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const updateVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available && available.length > 0) {
        setVoices(available);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const cancelSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
        if (window.__activeTTSUtterance) {
          window.__activeTTSUtterance = null;
        }
        activeUtteranceRef.current = null;
        setIsSpeaking(false);
      } catch (e) {
        console.error('Error cancelling speech synthesis:', e);
      }
    }
  }, []);

  const speak = useCallback((
    rawText: string,
    lang: 'en' | 'hi' = 'en',
    romanizedHindiFallback?: string
  ) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !rawText) return;

    cancelSpeech();

    const availableVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
    
    let selectedVoice: SpeechSynthesisVoice | null = null;
    let textToSpeak = rawText;
    let targetLangCode = lang === 'hi' ? 'hi-IN' : 'en-US';

    if (lang === 'hi') {
      const hindiVoice = availableVoices.find(v => 
        v.lang.toLowerCase().startsWith('hi') || 
        v.name.toLowerCase().includes('hindi') || 
        v.name.toLowerCase().includes('swara') || 
        v.name.toLowerCase().includes('kalpana') ||
        v.name.toLowerCase().includes('madhur') ||
        v.name.toLowerCase().includes('hemant')
      );

      if (hindiVoice) {
        selectedVoice = hindiVoice;
        targetLangCode = 'hi-IN';
        textToSpeak = rawText;
      } else {
        const indianEngVoice = availableVoices.find(v => 
          v.lang.toLowerCase() === 'en-in' || 
          v.name.toLowerCase().includes('india') || 
          v.name.toLowerCase().includes('neerja') || 
          v.name.toLowerCase().includes('prabhat')
        );

        selectedVoice = indianEngVoice || availableVoices.find(v => v.lang.toLowerCase().startsWith('en')) || null;
        targetLangCode = 'en-IN';
        textToSpeak = romanizedHindiFallback || rawText;
      }
    } else {
      const bestEngVoice = availableVoices.find(v => 
        v.lang.toLowerCase().startsWith('en') && (
          v.name.includes('Natural') || 
          v.name.includes('Online') || 
          v.name.includes('Google') || 
          v.name.includes('Zira') || 
          v.name.includes('Samantha') || 
          v.name.includes('Jenny')
        )
      ) || availableVoices.find(v => v.lang.toLowerCase().startsWith('en'));

      selectedVoice = bestEngVoice || availableVoices[0] || null;
      targetLangCode = 'en-US';
      textToSpeak = normalizeForSpeech(rawText, 'en');
    }

    try {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = targetLangCode;
      utterance.rate = lang === 'hi' ? 0.90 : 0.93;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      activeUtteranceRef.current = utterance;
      window.__activeTTSUtterance = utterance;

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        activeUtteranceRef.current = null;
        window.__activeTTSUtterance = null;
      };

      utterance.onerror = (e) => {
        console.error('SpeechSynthesis error:', e);
        setIsSpeaking(false);
        activeUtteranceRef.current = null;
        window.__activeTTSUtterance = null;
      };

      setTimeout(() => {
        if (window.speechSynthesis) {
          window.speechSynthesis.speak(utterance);
        }
      }, 20);
    } catch (err) {
      console.error('Failed to speak with SpeechSynthesis:', err);
      setIsSpeaking(false);
    }
  }, [voices, cancelSpeech]);

  return { speak, cancelSpeech, isSpeaking, voices };
}
