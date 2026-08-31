'use client';

import React from 'react';
import { ArrowLeft, Volume2, VolumeX, Sun, Moon } from 'lucide-react';

const triggerHaptic = () => {
  if (typeof window !== 'undefined' && window.navigator && typeof window.navigator.vibrate === 'function') {
    try {
      window.navigator.vibrate(10);
    } catch (e) {
      // ignore
    }
  }
};

interface HeaderProps {
  currentSectionId: string;
  sectionStats: {
    totalBySec: Record<string, number>;
    filledBySec: Record<string, number>;
  };
  onBack: () => void;
  showBack: boolean;
  ttsEnabled: boolean;
  setTtsEnabled: (val: boolean) => void;
  lang: 'en' | 'hi';
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  onHome?: () => void;
  onJumpToSection?: (sectionId: string) => void;
}

export default function Header({
  currentSectionId,
  sectionStats,
  onBack,
  showBack,
  ttsEnabled,
  setTtsEnabled,
  lang,
  theme,
  setTheme,
  onHome,
  onJumpToSection
}: HeaderProps) {
  const isDark = theme === 'dark';
  const SECTIONS = [
    { id: 'A', label: lang === 'hi' ? 'क: इतिहास' : 'A: History' },
    { id: 'B', label: lang === 'hi' ? 'ख: हार्मोन' : 'B: Hormones' },
    { id: 'C', label: lang === 'hi' ? 'ग: आदतें' : 'C: Lifestyle' },
    { id: 'D', label: lang === 'hi' ? 'घ: उपचार' : 'D: Care' },
    { id: 'E', label: lang === 'hi' ? 'ङ: सहमति' : 'E: Consent' }
  ];

  const handleSectionClick = (secId: string) => {
    triggerHaptic();
    if (onJumpToSection) {
      onJumpToSection(secId);
    }
  };

  return (
    <header className={`w-full py-3.5 px-4 md:px-8 flex flex-col gap-3.5 sticky top-0 z-40 transition-all duration-200 relative overflow-hidden backdrop-blur-md ${
      isDark 
        ? 'bg-[#0B132B] border-b border-slate-800 text-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.5)]' 
        : 'bg-[#F8FAFC] border-b-2 border-slate-200/90 text-slate-900 shadow-[0_4px_16px_rgba(15,23,42,0.04)]'
    }`}>
      {/* Top ambient accent stripe */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${
        isDark ? 'from-sky-400 via-blue-500 to-indigo-500' : 'from-emerald-600 via-teal-500 to-emerald-700'
      }`} />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {showBack ? (
            <button
              onClick={onBack}
              className={`p-2 rounded-xl transition-all border shadow-2xs focus:outline-none focus:ring-2 cursor-pointer active:scale-95 ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750 focus:ring-sky-400' 
                  : 'bg-white border-slate-250 text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 focus:ring-emerald-500'
              }`}
              aria-label="Go back"
              title="Go back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-8 h-8" /> // spacer
          )}

          {/* Clickable Logo Badge (Directs back to Home) */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic();
              if (onHome) onHome();
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border shadow-2xs cursor-pointer active:scale-95 transition-all ${
              isDark 
                ? 'bg-slate-800/90 border-slate-700 hover:bg-slate-750' 
                : 'bg-white border-slate-250 hover:bg-emerald-50/80 hover:border-emerald-300'
            }`}
            aria-label="Return to home screen"
            title="Return to home screen"
          >
            <span className={`w-2 h-2 rounded-full animate-pulse ${isDark ? 'bg-sky-400' : 'bg-emerald-600'}`} />
            <span className={`font-black text-xs md:text-sm tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r ${
              isDark ? 'from-sky-300 via-sky-400 to-blue-400' : 'from-emerald-800 via-emerald-700 to-teal-800'
            }`}>
              Hair Vitals
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle (Sun / Moon) */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic();
              setTheme(isDark ? 'light' : 'dark');
            }}
            className={`flex items-center justify-center p-2 rounded-xl border transition-all cursor-pointer shadow-2xs active:scale-95 ${
              isDark 
                ? 'bg-slate-800 border-slate-700 text-sky-300 hover:text-sky-200 hover:bg-slate-750' 
                : 'bg-white border-slate-250 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300'
            }`}
            aria-label="Toggle light or dark theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* Voice Assistant Toggle */}
          <button
            onClick={() => setTtsEnabled(!ttsEnabled)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer shadow-2xs active:scale-95 ${
              ttsEnabled
                ? (isDark 
                    ? 'bg-sky-950/40 border-sky-800/90 text-sky-300 shadow-sky-950/20' 
                    : 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-emerald-100/50')
                : (isDark 
                    ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200' 
                    : 'bg-white border-slate-250 text-slate-600 hover:text-slate-800 hover:bg-slate-50')
            }`}
            aria-label={ttsEnabled ? "Disable voice assistant" : "Enable voice assistant"}
          >
            {ttsEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 animate-pulse text-emerald-600 dark:text-sky-400" />
                <span>{lang === 'hi' ? 'आवाज़ चालू' : 'Voice On'}</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'आवाज़ बंद' : 'Voice Off'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Dots/Segments with subtle light color shades & clickable jump */}
      <div className="grid grid-cols-5 gap-2 w-full max-w-5xl mx-auto">
        {SECTIONS.map((sec) => {
          const total = sectionStats.totalBySec[sec.id] || 0;
          const filled = sectionStats.filledBySec[sec.id] || 0;
          const isCurrent = currentSectionId === sec.id;
          const percent = total > 0 ? (filled / total) * 100 : 0;
          const isComplete = total > 0 && filled === total;

          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => handleSectionClick(sec.id)}
              className={`flex flex-col gap-1.5 p-2 rounded-2xl border transition-all text-left cursor-pointer active:scale-98 group ${
                isCurrent
                  ? (isDark 
                      ? 'bg-sky-950/40 border-sky-500/80 shadow-md ring-2 ring-sky-400/20' 
                      : 'bg-emerald-50/90 border-2 border-emerald-400 shadow-xs ring-2 ring-emerald-200/50')
                  : isComplete
                  ? (isDark 
                      ? 'bg-slate-800/80 border-slate-700 hover:border-sky-700' 
                      : 'bg-teal-50/60 border border-teal-200 hover:border-teal-300 hover:bg-teal-50')
                  : (isDark 
                      ? 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700' 
                      : 'bg-slate-50/80 border border-slate-200/90 hover:border-emerald-300 hover:bg-emerald-50/40')
              }`}
              aria-label={`Jump to Section ${sec.label}`}
              title={`Jump to Section ${sec.label}`}
            >
              {/* Progress bar track */}
              <div className={`h-1.5 md:h-2 rounded-full overflow-hidden relative shadow-inner w-full ${
                isDark ? 'bg-slate-800' : 'bg-slate-200/80'
              }`}>
                <div
                  className={`h-full absolute left-0 top-0 transition-all duration-300 rounded-full ${
                    isDark
                      ? (isCurrent ? 'bg-sky-400 animate-pulse' : percent === 100 ? 'bg-sky-500' : 'bg-sky-400/80')
                      : (isCurrent ? 'bg-gradient-to-r from-emerald-600 to-teal-600 animate-pulse' : percent === 100 ? 'bg-teal-600' : 'bg-emerald-500')
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span 
                className={`text-[9px] md:text-[10px] font-bold text-center truncate w-full transition-colors ${
                  isCurrent 
                    ? (isDark ? 'text-sky-300' : 'text-emerald-950 font-extrabold') 
                    : isComplete
                    ? (isDark ? 'text-sky-400/80' : 'text-teal-900 font-bold')
                    : (isDark ? 'text-slate-400 group-hover:text-slate-200' : 'text-slate-600 group-hover:text-emerald-800')
                }`}
              >
                {sec.label}
              </span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
