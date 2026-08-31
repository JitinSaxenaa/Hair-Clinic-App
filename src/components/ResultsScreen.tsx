'use client';

import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Clipboard, ClipboardCheck, RotateCcw, AlertTriangle, FileCode } from 'lucide-react';
import { FormAnswers } from '../config/schema';

import { translations } from '../config/translations';

interface ResultsScreenProps {
  answers: FormAnswers;
  summary: string;
  onReset: () => void;
  lang: 'en' | 'hi';
}

export default function ResultsScreen({
  answers,
  summary,
  onReset,
  lang
}: ResultsScreenProps) {
  const [copied, setCopied] = useState(false);
  const t = translations[lang];

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      const duration = 2 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 25, spread: 360, ticks: 50, zIndex: 50 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 40 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleCopyJson = () => {
    try {
      navigator.clipboard.writeText(JSON.stringify(answers, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy text', e);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 select-none animate-in zoom-in-95 duration-300 relative">
      {/* Flowing hair-strand background line art texture */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 select-none -mx-8 -my-6">
        <svg className="w-full h-full text-emerald-800/10" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M -10,30 Q 30,10 70,50 T 110,30" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M -10,40 Q 40,60 60,20 T 110,50" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <path d="M -10,20 Q 20,50 80,10 T 110,60" fill="none" stroke="currentColor" strokeWidth="0.4" />
        </svg>
      </div>

      {/* Success Badge */}
      <div className="flex flex-col items-center gap-2.5 text-center mt-2 relative z-10">
        <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center text-teal-600 shadow-xs animate-bounce">
          {/* Custom line-art sprout/growth follicle motif */}
          <svg className="w-10 h-10 text-teal-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22V12" />
            <path d="M12 12c-3.5 0-6-2.5-6-6h6Z" />
            <path d="M12 14c3.5 0 6-2.5 6-6h-6Z" />
            <circle cx="12" cy="5" r="1.2" fill="currentColor" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{t.chrome.results_title}</h2>
          <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
            {t.chrome.results_desc}
          </p>
        </div>
      </div>

      {/* Doctor's Summary Section */}
      <div className="bg-emerald-50/40 border border-emerald-150 rounded-2xl p-5 shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-2 -translate-y-2 text-emerald-100 opacity-20 pointer-events-none">
          <FileCode className="w-32 h-32" />
        </div>

        <div className="relative">
          <span className="bg-teal-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
            {t.chrome.clinical_summary}
          </span>
          <h3 className="font-bold text-gray-800 text-base mt-2">{t.chrome.doctors_review}</h3>
          <p className="text-gray-700 text-sm leading-relaxed mt-2.5 font-medium whitespace-pre-line">
            {summary || (lang === 'hi' ? 'चिकित्सीय समीक्षा रिपोर्ट तैयार की जा रही है...' : 'Generating summary clinical description...')}
          </p>
        </div>
      </div>

      {/* JSON Output Section */}
      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <FileCode className="w-4 h-4 text-gray-500" />
            {lang === 'hi' ? 'संरचित स्कीमा JSON (Structured JSON)' : 'Structured Schema JSON'}
          </span>
          
          <button
            onClick={handleCopyJson}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95 duration-150 ${
              copied
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-white border-gray-250 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {copied ? (
              <>
                <ClipboardCheck className="w-3.5 h-3.5" />
                <span>{t.chrome.copied}</span>
              </>
            ) : (
              <>
                <Clipboard className="w-3.5 h-3.5" />
                <span>{t.chrome.copy_json}</span>
              </>
            )}
          </button>
        </div>

        {/* Scrollable JSON Box */}
        <div className="border border-gray-200 rounded-2xl bg-gray-900 text-gray-150 p-4 font-mono text-xs overflow-auto max-h-80 shadow-inner">
          <pre>{JSON.stringify(answers, null, 2)}</pre>
        </div>
      </div>

      {/* Warning/Notes */}
      <div className="flex items-start gap-2.5 bg-yellow-50/50 border border-yellow-100 p-3 rounded-2xl text-xs text-yellow-800">
        <AlertTriangle className="w-4.5 h-4.5 text-yellow-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <p className="font-bold">{lang === 'hi' ? 'डेटा स्थायी रूप से सुरक्षित नहीं है' : 'No Data Persistence Enabled'}</p>
          <p className="text-yellow-700/90 mt-0.5">
            {lang === 'hi'
              ? 'सुरक्षा दिशानिर्देशों के अनुसार, आपका डेटा केवल ब्राउज़र सत्र में सहेजा गया है और टैब बंद करने पर मिट जाएगा। कृपया अपना विवरण रखने के लिए ऊपर दिया गया JSON कॉपी करें।'
              : 'Per security guidelines, your data is stored in the browser session memory and will be erased when you close this tab. Please copy the JSON above to keep it.'}
          </p>
        </div>
      </div>

      {/* Restart Button */}
      <button
        onClick={onReset}
        className="w-full bg-white hover:bg-gray-50 border border-[#EFECE6] text-gray-700 font-bold py-3.5 rounded-2xl shadow-xs transition-all active:scale-[0.98] duration-150 flex items-center justify-center gap-2 text-sm mt-2"
      >
        <RotateCcw className="w-4 h-4 animate-spin-hover" />
        <span>{t.chrome.reset}</span>
      </button>
    </div>
  );
}
