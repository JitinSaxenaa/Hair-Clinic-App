'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, AlertCircle, Check, ArrowRight, Plus } from 'lucide-react';

interface VoiceTextInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  lang: 'en' | 'hi';
  setLang: (lang: 'en' | 'hi') => void;
  onConfirm?: (finalText: string) => void;
  confirmLabel?: string;
  isAnalyzing?: boolean;
}

export default function VoiceTextInput({
  value,
  onChange,
  placeholder = 'Type here or click the microphone to speak...',
  className = '',
  lang,
  setLang,
  onConfirm,
  confirmLabel,
  isAnalyzing = false
}: VoiceTextInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const shouldListenRef = useRef(false);
  const valueRef = useRef(value);
  const baseTextRef = useRef('');
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    // Check SpeechRecognition support on client mount
    const hasSupport =
      typeof window !== 'undefined' &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (Boolean((window as any).SpeechRecognition) || Boolean((window as any).webkitSpeechRecognition));
    
    if (hasSupport) {
      setTimeout(() => setSpeechSupported(true), 0);
    }

    // Cleanup when component unmounts or step changes
    return () => {
      shouldListenRef.current = false;
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
        recognitionRef.current = null;
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        try {
          window.speechSynthesis.cancel();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  // Gracefully stop listening after inactivity without auto-submitting
  const resetSilenceTimer = (duration = 6000) => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    silenceTimerRef.current = setTimeout(() => {
      if (shouldListenRef.current) {
        console.log("Inactivity detected, gently stopping mic...");
        stopListening();
      }
    }, duration);
  };

  const createAndStartRecognition = () => {
    const SpeechRecognitionConstructor =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).SpeechRecognition ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionConstructor) return;

    const rec = new SpeechRecognitionConstructor();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = lang === 'hi' ? 'hi-IN' : 'en-US';

    rec.onstart = () => {
      setIsListening(true);
      setErrorMsg(null);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = 0; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          finalTranscript += item[0].transcript + ' ';
        } else {
          interimTranscript += item[0].transcript;
        }
      }

      const sessionText = (finalTranscript + interimTranscript).trim();
      const base = baseTextRef.current.trim();
      const combined = base ? (sessionText ? base + ' ' + sessionText : base) : sessionText;

      onChange(combined);
      resetSilenceTimer(7000);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onerror = (event: any) => {
      console.warn('Speech recognition event:', event.error);
      if (event.error === 'not-allowed') {
        setErrorMsg(lang === 'hi' ? 'माइक्रोफ़ोन एक्सेस अस्वीकृत है।' : 'Microphone access denied. Please allow microphone access.');
        shouldListenRef.current = false;
        setIsListening(false);
      } else if (event.error === 'no-speech' || event.error === 'aborted') {
        // Expected during pauses or transitions, do not show error
      } else {
        console.warn(`Speech recognition warning: ${event.error}`);
      }
    };

    rec.onend = () => {
      if (shouldListenRef.current) {
        baseTextRef.current = valueRef.current;
        // Chrome requires a fresh SpeechRecognition instance on end
        setTimeout(() => {
          if (shouldListenRef.current) {
            createAndStartRecognition();
          }
        }, 50);
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = rec;

    try {
      rec.start();
      resetSilenceTimer(8000);
    } catch (e) {
      console.error('Error starting speech recognition:', e);
      setErrorMsg(lang === 'hi' ? 'माइक्रोफ़ोन प्रारंभ करने में असमर्थ।' : 'Unable to start microphone. Please click again.');
      setIsListening(false);
      shouldListenRef.current = false;
    }
  };

  const startListening = () => {
    // Immediately cancel any TTS synthesis so the microphone gets clear audio
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
    }

    const SpeechRecognitionConstructor =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).SpeechRecognition ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionConstructor) {
      setErrorMsg(lang === 'hi' ? 'आपके ब्राउज़र में वॉयस डिक्टेशन समर्थित नहीं है।' : 'Voice dictation is not supported in this browser.');
      return;
    }

    // Stop any previous instance cleanly
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        // ignore
      }
      recognitionRef.current = null;
    }

    setErrorMsg(null);
    setIsListening(true);
    shouldListenRef.current = true;
    baseTextRef.current = valueRef.current;

    createAndStartRecognition();
  };

  const stopListening = () => {
    shouldListenRef.current = false;
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const hasText = value.trim().length > 0;

  return (
    <div className={`flex flex-col gap-3 w-full ${className}`}>
      {/* Speech language picker */}
      {speechSupported && (
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-1.5 shadow-2xs">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {lang === 'hi' ? 'भाषा (Language):' : 'Language / भाषा:'}
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => {
                if (isListening) stopListening();
                setLang('en');
              }}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                lang === 'en'
                  ? 'bg-emerald-600 text-white dark:bg-sky-500 dark:text-slate-950 shadow-2xs'
                  : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-250 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => {
                if (isListening) stopListening();
                setLang('hi');
              }}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                lang === 'hi'
                  ? 'bg-emerald-600 text-white dark:bg-sky-500 dark:text-slate-950 shadow-2xs'
                  : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-250 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>
      )}

      {/* Main Text / Transcript Area */}
      <div className="relative border-2 border-slate-250 dark:border-slate-700 focus-within:border-emerald-500 dark:focus-within:border-sky-400 rounded-2xl bg-white dark:bg-slate-900 shadow-xs p-1 transition-all">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-32 text-slate-800 dark:text-slate-100 text-base placeholder-slate-400 dark:placeholder-slate-500 border-0 focus:ring-0 resize-none p-3 outline-none bg-transparent"
        />

        {/* Floating mic indicator inside input area */}
        <div className="absolute right-3 bottom-3 flex items-center gap-2">
          {isListening && (
            <div className="flex gap-1.5 items-center bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 text-xs px-3 py-1 rounded-full animate-pulse font-semibold shadow-2xs">
              <span className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full animate-ping" />
              <span>{lang === 'hi' ? 'सुन रहे हैं...' : 'Listening...'}</span>
            </div>
          )}

          {speechSupported ? (
            <button
              type="button"
              onClick={toggleListening}
              className={`p-3 rounded-full shadow-md transition-all duration-200 cursor-pointer active:scale-95 ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 text-white ring-4 ring-red-100 dark:ring-red-950/50 animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-700 dark:bg-sky-500 dark:hover:bg-sky-400 text-white dark:text-slate-950 hover:shadow-lg'
              }`}
              aria-label={isListening ? "Stop listening" : "Start speaking"}
              title={isListening ? "Stop recording" : "Click to speak"}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          ) : (
            <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed" title="Voice dictation not supported in this browser">
              <MicOff className="w-5 h-5" />
            </div>
          )}
        </div>
      </div>

      {/* Two Action Buttons: Add More vs. Confirm & Analyze */}
      {hasText && onConfirm && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1 animate-in fade-in-50 duration-200">
          <button
            type="button"
            onClick={startListening}
            disabled={isListening || isAnalyzing}
            className={`flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer active:scale-98 ${
              isListening
                ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-400'
                : 'bg-white hover:bg-slate-50 dark:bg-slate-800/90 dark:hover:bg-slate-700 border-slate-250 dark:border-slate-700 text-slate-700 dark:text-slate-100 shadow-2xs'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4 text-red-500" />
                <span>{lang === 'hi' ? 'रिकॉर्डिंग चालू है...' : 'Recording active...'}</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-emerald-600 dark:text-sky-400" />
                <span>{lang === 'hi' ? 'और बोलें / जोड़ें' : 'Speak more / Add details'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onConfirm(value)}
            disabled={isAnalyzing}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 dark:from-sky-500 dark:to-blue-600 dark:hover:from-sky-400 dark:hover:to-blue-500 text-white dark:text-slate-950 text-xs font-extrabold shadow-sm active:scale-98 transition-all cursor-pointer disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white dark:border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>{lang === 'hi' ? 'विश्लेषण हो रहा है...' : 'Analyzing response...'}</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>{confirmLabel || (lang === 'hi' ? 'पुष्टि करें और विश्लेषण करें' : 'Confirm & Analyze')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 p-2.5 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
