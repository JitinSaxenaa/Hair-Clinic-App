'use client';

import React from 'react';
import { ThumbsUp, ThumbsDown, Plus, Minus, Check, CheckCircle2 } from 'lucide-react';
import { FormStep } from '../hooks/useFormWizard';
import VoiceTextInput from './VoiceTextInput';
import { translations } from '../config/translations';

interface StepRendererProps {
  step: FormStep;
  value: unknown;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (val: any) => void;
  isAutoFilled: boolean;
  onConfirm: () => void;
  onNext: () => void;
  lang: 'en' | 'hi';
  setLang: (lang: 'en' | 'hi') => void;
}

const renderPatternIcon = (optKey: string) => {
  const strokeColor = "currentColor";
  switch (optKey) {
    case 'Receding hairline':
      return (
        <svg className="w-9 h-9 text-blue-800 dark:text-sky-400 shrink-0 mr-3" viewBox="0 0 100 100" fill="none" stroke={strokeColor} strokeWidth="2.5">
          <path d="M25,80 C25,75 30,50 35,45 C38,42 45,40 50,40 C52,40 55,42 55,48 C55,52 48,58 48,65 C48,70 52,75 55,75 C60,75 62,65 65,60 C68,55 75,55 75,65 C75,75 70,80 70,80" />
          <path d="M40,20 C38,28 35,32 30,35" strokeDasharray="3 3" />
          <path d="M40,20 Q48,22 55,30 Q45,35 35,30 Z" className="fill-blue-500/20 stroke-blue-500 dark:fill-sky-400/20 dark:stroke-sky-400" strokeWidth="1.5" />
        </svg>
      );
    case 'Thinning at crown':
      return (
        <svg className="w-9 h-9 text-blue-800 dark:text-sky-400 shrink-0 mr-3" viewBox="0 0 100 100" fill="none" stroke={strokeColor} strokeWidth="2.5">
          <circle cx="50" cy="50" r="35" />
          <path d="M12,50 Q10,45 15,40" />
          <path d="M88,50 Q90,45 85,40" />
          <circle cx="50" cy="40" r="12" className="fill-blue-500/20 stroke-blue-500 dark:fill-sky-400/20 dark:stroke-sky-400 animate-pulse" strokeWidth="1.5" />
          <path d="M30,30 C35,25 45,28 48,32" strokeWidth="1.5" />
          <path d="M70,30 C65,25 55,28 52,32" strokeWidth="1.5" />
          <path d="M25,50 C32,52 35,48 40,48" strokeWidth="1.5" />
          <path d="M75,50 C68,52 65,48 60,48" strokeWidth="1.5" />
        </svg>
      );
    case 'Widening part line':
      return (
        <svg className="w-9 h-9 text-blue-800 dark:text-sky-400 shrink-0 mr-3" viewBox="0 0 100 100" fill="none" stroke={strokeColor} strokeWidth="2.5">
          <circle cx="50" cy="50" r="35" />
          <path d="M47,20 L47,80 M53,20 L53,80" className="stroke-blue-500 dark:stroke-sky-400" strokeWidth="1.5" />
          <path d="M47,20 Q50,18 53,20 L53,80 Q50,82 47,80 Z" className="fill-blue-500/20 dark:fill-sky-400/20" />
          <path d="M45,30 Q30,35 25,45" strokeWidth="1.5" />
          <path d="M55,30 Q70,35 75,45" strokeWidth="1.5" />
          <path d="M45,60 Q30,65 25,75" strokeWidth="1.5" />
          <path d="M55,60 Q70,65 75,75" strokeWidth="1.5" />
        </svg>
      );
    case 'Diffuse thinning':
      return (
        <svg className="w-9 h-9 text-blue-800 dark:text-sky-400 shrink-0 mr-3" viewBox="0 0 100 100" fill="none" stroke={strokeColor} strokeWidth="2.5">
          <circle cx="50" cy="50" r="35" />
          <circle cx="50" cy="40" r="1.5" fill="currentColor" />
          <circle cx="40" cy="50" r="1.5" fill="currentColor" />
          <circle cx="60" cy="55" r="1.5" fill="currentColor" />
          <circle cx="48" cy="65" r="1.5" fill="currentColor" />
          <circle cx="35" cy="35" r="1.5" fill="currentColor" />
          <circle cx="65" cy="35" r="1.5" fill="currentColor" />
          <circle cx="50" cy="50" r="25" className="fill-blue-500/10 stroke-blue-500/30 dark:fill-sky-400/10 dark:stroke-sky-400/30" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
      );
    case 'Patchy loss':
      return (
        <svg className="w-9 h-9 text-blue-800 dark:text-sky-400 shrink-0 mr-3" viewBox="0 0 100 100" fill="none" stroke={strokeColor} strokeWidth="2.5">
          <circle cx="50" cy="50" r="35" />
          <circle cx="38" cy="42" r="8" className="fill-blue-500/20 stroke-blue-500 dark:fill-sky-400/20 dark:stroke-sky-400" strokeWidth="1.5" />
          <circle cx="62" cy="58" r="6" className="fill-blue-500/20 stroke-blue-500 dark:fill-sky-400/20 dark:stroke-sky-400" strokeWidth="1.5" />
          <path d="M22,35 C28,32 30,36 30,42" strokeWidth="1" />
          <path d="M55,30 C62,35 68,30 75,32" strokeWidth="1" />
        </svg>
      );
    case 'Sudden excessive shedding':
      return (
        <svg className="w-9 h-9 text-blue-800 dark:text-sky-400 shrink-0 mr-3" viewBox="0 0 100 100" fill="none" stroke={strokeColor} strokeWidth="2.5">
          <path d="M30,30 L45,45 M35,25 L50,40 M25,35 L40,50" strokeWidth="2.5" />
          <path d="M55,50 C58,62 55,70 52,80" className="stroke-blue-500 dark:stroke-sky-400" strokeWidth="1.5" />
          <path d="M68,45 C72,55 70,65 66,75" className="stroke-blue-500 dark:stroke-sky-400" strokeWidth="1.5" />
          <path d="M42,60 C46,68 44,75 40,82" className="stroke-blue-500 dark:stroke-sky-400" strokeWidth="1.5" />
        </svg>
      );
    default:
      return null;
  }
};

const triggerHaptic = () => {
  if (typeof window !== 'undefined' && window.navigator && typeof window.navigator.vibrate === 'function') {
    try {
      window.navigator.vibrate(10);
    } catch (e) {
      // ignore
    }
  }
};

export default function StepRenderer({
  step,
  value,
  onChange,
  isAutoFilled,
  onConfirm,
  onNext,
  lang,
  setLang
}: StepRendererProps) {
  const t = translations[lang];
  const qTranslation = t.questions[step.id];

  const displayTitle = qTranslation?.title || step.title;
  const displaySubtitle = qTranslation?.subtitle || step.subtitle;

  const getOptionText = (opt: string) => {
    return qTranslation?.options?.[opt] || opt;
  };
  // Stepper for number inputs
  const renderNumberInput = () => {
    // default to 25 if undefined
    const numValue = typeof value === 'number' ? value : 25;

    const handleIncrement = () => {
      onChange(Math.min(100, numValue + 1));
    };

    const handleDecrement = () => {
      onChange(Math.max(1, numValue - 1));
    };

    return (
      <div className="flex flex-col items-center gap-6 py-4 w-full">
        <div className="flex items-center gap-6 justify-center w-full max-w-xs">
          <button
            type="button"
            onClick={handleDecrement}
            className="w-16 h-16 rounded-full bg-gray-50 border border-gray-200 hover:bg-gray-100 flex items-center justify-center text-gray-700 transition-all active:scale-95 shadow-xs"
            aria-label="Decrease age"
          >
            <Minus className="w-6 h-6" />
          </button>
          
          <div className="flex flex-col items-center">
            <span className="text-5xl font-extrabold font-mono text-gray-800">
              {numValue}
            </span>
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">
              {t.chrome.years_old}
            </span>
          </div>

          <button
            type="button"
            onClick={handleIncrement}
            className="w-16 h-16 rounded-full bg-gray-50 border border-gray-200 hover:bg-gray-100 flex items-center justify-center text-gray-700 transition-all active:scale-95 shadow-xs"
            aria-label="Increase age"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
        
        {/* Direct number inputs fallback on the bottom */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-gray-400">{t.chrome.or_type_age}</span>
          <input
            type="number"
            value={(value as string | number) || ''}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (!isNaN(val)) onChange(val);
              else onChange(undefined);
            }}
            className="w-16 border border-gray-250 rounded-lg py-1 px-2 text-center text-sm font-semibold font-mono focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            min="1"
            max="120"
          />
        </div>
      </div>
    );
  };

  // Single select (Large chips, auto-advance)
  const renderSingleSelect = () => {
    const options = step.options || [];

    const handleOptionSelect = (opt: string) => {
      triggerHaptic();
      onChange(opt);
      // Auto advance on selection (small timeout for smooth feel)
      setTimeout(() => {
        onNext();
      }, 250);
    };

    return (
      <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
        {options.map((opt) => {
          const isSelected = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => handleOptionSelect(opt)}
              className={`w-full min-h-[56px] text-left px-5 py-4 rounded-2xl border text-base font-semibold transition-all duration-200 flex items-center justify-between active:scale-98 cursor-pointer ${
                isSelected
                  ? 'bg-emerald-50/90 border-emerald-500 text-emerald-950 shadow-xs scale-[1.01] dark:bg-sky-950/40 dark:border-sky-500 dark:text-sky-200'
                  : 'bg-white border-slate-200 hover:border-emerald-300 hover:scale-[1.005] text-slate-700 active:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700'
              }`}
            >
              <span>{getOptionText(opt)}</span>
              {isSelected && (
                <div className="w-5 h-5 bg-emerald-600 dark:bg-sky-500 rounded-full flex items-center justify-center text-white dark:text-slate-950">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  // Multi select (Checkboxes with next button)
  const renderMultiSelect = () => {
    const options = step.options || [];
    const currentList = Array.isArray(value) ? value : [];

    const handleToggle = (opt: string) => {
      triggerHaptic();
      let updated: string[];
      if (currentList.includes(opt)) {
        updated = currentList.filter(x => x !== opt);
      } else {
        // If selecting "None" or "No known family history", clear others.
        // Or if selecting something else, remove "None" / "No known family history".
        if (opt === 'None' || opt === 'No known family history') {
          updated = [opt];
        } else {
          updated = currentList.filter(x => x !== 'None' && x !== 'No known family history');
          updated.push(opt);
        }
      }
      onChange(updated);
    };

    if (step.id === 'pattern') {
      return (
        <div className="flex flex-col items-center gap-5 w-full max-w-md mx-auto">
          {/* Labeled diagram instruction */}
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium text-center">
            {lang === 'hi' ? 'सिर के चित्र पर टैप करें या नीचे से चुनें:' : 'Tap the diagram or select your pattern(s) below:'}
          </div>

          {/* Clean Interactive SVG Scalp Diagram */}
          <div className="relative w-48 h-48 bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-3 flex items-center justify-center shadow-xs">
            <svg className="w-full h-full text-slate-300 dark:text-slate-700" viewBox="0 0 100 100" fill="none" stroke="currentColor">
              {/* Nose Indicator (Front) */}
              <path d="M47,10 L50,4 L53,10 Z" className="fill-slate-300 dark:fill-slate-700 stroke-slate-300 dark:stroke-slate-700" />
              {/* Left Ear */}
              <path d="M12,46 Q9,46 11,54 Q13,54 13,46" strokeWidth="2.5" />
              {/* Right Ear */}
              <path d="M88,46 Q91,46 89,54 Q87,54 87,46" strokeWidth="2.5" />

              {/* 1. Diffuse Thinning (Clickable background scalp region) */}
              <circle
                cx="50"
                cy="50"
                r="36"
                className={`cursor-pointer transition-all duration-200 ${
                  currentList.includes('Diffuse thinning')
                    ? 'fill-emerald-500/25 stroke-emerald-500 dark:fill-sky-500/25 dark:stroke-sky-400 stroke-2'
                    : 'fill-white dark:fill-slate-800 hover:fill-emerald-50/40 dark:hover:fill-slate-750 stroke-slate-250 dark:stroke-slate-700'
                }`}
                onClick={() => handleToggle('Diffuse thinning')}
              />

              {/* 2. Receding Hairline (Front curve band) */}
              <path
                d="M 23,28 Q 50,15 77,28 Q 50,38 23,28 Z"
                className={`cursor-pointer transition-all duration-200 ${
                  currentList.includes('Receding hairline')
                    ? 'fill-emerald-600/40 stroke-emerald-600 dark:fill-sky-500/40 dark:stroke-sky-400 stroke-2'
                    : 'fill-slate-100/90 dark:fill-slate-700/60 hover:fill-emerald-50 dark:hover:fill-slate-650 stroke-slate-300 dark:stroke-slate-600'
                }`}
                onClick={() => handleToggle('Receding hairline')}
              />

              {/* 3. Widening Part Line (Center vertical stripe) */}
              <path
                d="M 46,28 L 54,28 L 54,72 L 46,72 Z"
                className={`cursor-pointer transition-all duration-200 ${
                  currentList.includes('Widening part line')
                    ? 'fill-emerald-600/40 stroke-emerald-600 dark:fill-sky-500/40 dark:stroke-sky-400 stroke-2'
                    : 'fill-slate-150/90 dark:fill-slate-700/60 hover:fill-emerald-50 dark:hover:fill-slate-650 stroke-slate-300 dark:stroke-slate-600'
                }`}
                onClick={() => handleToggle('Widening part line')}
              />

              {/* 4. Thinning at Crown (Vertex circle) */}
              <circle
                cx="50"
                cy="68"
                r="11"
                className={`cursor-pointer transition-all duration-200 ${
                  currentList.includes('Thinning at crown')
                    ? 'fill-emerald-600/40 stroke-emerald-600 dark:fill-sky-500/40 dark:stroke-sky-400 stroke-2'
                    : 'fill-slate-150/90 dark:fill-slate-700/60 hover:fill-emerald-50 dark:hover:fill-slate-650 stroke-slate-300 dark:stroke-slate-600'
                }`}
                onClick={() => handleToggle('Thinning at crown')}
              />

              {/* 5. Patchy Loss (Side circular regions) */}
              <g
                className="cursor-pointer"
                onClick={() => handleToggle('Patchy loss')}
              >
                <circle
                  cx="28"
                  cy="50"
                  r="7"
                  className={`transition-all duration-200 ${
                    currentList.includes('Patchy loss')
                      ? 'fill-emerald-600/40 stroke-emerald-600 dark:fill-sky-500/40 dark:stroke-sky-400 stroke-2'
                      : 'fill-slate-150/90 dark:fill-slate-700/60 hover:fill-emerald-50 dark:hover:fill-slate-650 stroke-slate-300 dark:stroke-slate-600'
                  }`}
                />
                <circle
                  cx="72"
                  cy="48"
                  r="6"
                  className={`transition-all duration-200 ${
                    currentList.includes('Patchy loss')
                      ? 'fill-emerald-600/40 stroke-emerald-600 dark:fill-sky-500/40 dark:stroke-sky-400 stroke-2'
                      : 'fill-slate-150/90 dark:fill-slate-700/60 hover:fill-emerald-50 dark:hover:fill-slate-650 stroke-slate-300 dark:stroke-slate-600'
                  }`}
                />
              </g>
            </svg>
          </div>

          {/* Full List of Pattern Option Chips */}
          <div className="w-full space-y-2">
            {options.map((opt) => {
              const isSelected = currentList.includes(opt);
              const patternIcon = renderPatternIcon(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleToggle(opt)}
                  className={`w-full min-h-[52px] text-left px-4 py-3 rounded-2xl border text-sm font-semibold transition-all duration-200 flex items-center justify-between active:scale-98 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/90 border-emerald-500 text-emerald-950 shadow-xs dark:bg-sky-950/40 dark:border-sky-500 dark:text-sky-200'
                      : 'bg-white border-slate-200 hover:border-emerald-300 text-slate-800 active:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {patternIcon}
                    <span>{getOptionText(opt)}</span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-emerald-600 border-emerald-600 text-white dark:bg-sky-500 dark:border-sky-500 dark:text-slate-950'
                        : 'border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
        <div className="space-y-2.5">
          {options.map((opt) => {
            const isSelected = currentList.includes(opt);
            const patternIcon = step.id === 'pattern' ? renderPatternIcon(opt) : null;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => handleToggle(opt)}
                className={`w-full min-h-[56px] text-left px-5 py-4 rounded-2xl border text-sm font-semibold transition-all duration-200 flex items-center justify-between active:scale-98 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50/90 border-emerald-500 text-emerald-900 shadow-xs scale-[1.005] dark:bg-sky-950/40 dark:border-sky-500 dark:text-sky-200'
                    : 'bg-white border-slate-200 hover:border-emerald-300 hover:scale-[1.005] text-slate-700 active:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center">
                  {patternIcon}
                  <span>{getOptionText(opt)}</span>
                </div>
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-emerald-600 border-emerald-600 text-white dark:bg-sky-500 dark:border-sky-500 dark:text-slate-950'
                      : 'border-slate-350 bg-white dark:border-slate-700 dark:bg-slate-800'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Yes / No (Big thumbs, auto-advance)
  const renderYesNo = () => {
    const handleSelect = (val: 'yes' | 'no') => {
      triggerHaptic();
      onChange(val);
      setTimeout(() => {
        onNext();
      }, 250);
    };

    return (
      <div className="flex gap-4 w-full max-w-sm mx-auto py-2">
        <button
          type="button"
          onClick={() => handleSelect('yes')}
          className={`flex-1 flex flex-col items-center justify-center gap-3 py-6 px-4 rounded-3xl border-2 transition-all duration-200 active:scale-95 hover:scale-101 cursor-pointer ${
            value === 'yes'
              ? 'bg-emerald-50/90 border-emerald-500 text-emerald-700 dark:bg-sky-950/40 dark:border-sky-500 dark:text-sky-300 scale-102 shadow-xs'
              : 'bg-white border-slate-200 hover:border-emerald-300 text-slate-500 hover:text-emerald-600 active:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:border-sky-700'
          }`}
        >
          <ThumbsUp className={`w-8 h-8 ${value === 'yes' ? 'fill-emerald-100 dark:fill-sky-900/40' : ''}`} />
          <span className="font-bold text-base">{lang === 'hi' ? 'हाँ (Yes)' : 'Yes'}</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelect('no')}
          className={`flex-1 flex flex-col items-center justify-center gap-3 py-6 px-4 rounded-3xl border-2 transition-all duration-200 active:scale-95 hover:scale-101 cursor-pointer ${
            value === 'no'
              ? 'bg-rose-50/80 border-rose-500 text-rose-700 dark:bg-rose-950/40 dark:border-rose-500 dark:text-rose-300 scale-102 shadow-xs'
              : 'bg-white border-slate-200 hover:border-rose-300 text-slate-500 hover:text-rose-600 active:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:border-rose-700'
          }`}
        >
          <ThumbsDown className={`w-8 h-8 ${value === 'no' ? 'fill-rose-150 dark:fill-rose-900/40' : ''}`} />
          <span className="font-bold text-base">{lang === 'hi' ? 'नहीं (No)' : 'No'}</span>
        </button>
      </div>
    );
  };

  // Text details with voice typing
  const renderTextInput = () => {
    return (
      <div className="w-full max-w-md mx-auto">
        <VoiceTextInput
          value={(value as string) || ''}
          onChange={onChange}
          placeholder={step.placeholder}
          lang={lang}
          setLang={setLang}
        />
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col gap-6 select-none">
      {/* Question titles */}
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-zinc-100 leading-tight">
          {displayTitle}
        </h2>
        {displaySubtitle && (
          <p className="text-sm text-gray-500 dark:text-zinc-350 mt-2 leading-relaxed">
            {displaySubtitle}
          </p>
        )}
      </div>

      {/* Sensitive Question Micro-copy (If PCOS, acne, facial hair, etc) */}
      {(step.id === 'diagnosed_conditions' || 
        step.id === 'menstrual_cycle' || 
        step.id === 'pregnancy_related' || 
        step.id === 'adult_acne_oily_skin' || 
        step.id === 'excess_body_facial_hair') && (
        <div className="text-center md:text-left bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-xl p-2.5 text-xs text-blue-700 dark:text-blue-300 -mt-2 font-medium">
          {t.chrome.sensitive_reassurance}
        </div>
      )}

      {/* Confidence Tinted Autofilled Badge */}
      {isAutoFilled && (
        <div className="w-full bg-blue-50 dark:bg-sky-950/30 border border-blue-200 dark:border-sky-800/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-200 ring-4 ring-blue-100/50 dark:ring-sky-950/20">
          <div className="flex gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-sky-400 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <p className="text-xs font-bold text-blue-900 dark:text-sky-200">{t.chrome.autofilled_msg}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-sky-500 dark:hover:bg-sky-400 text-white dark:text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 duration-150 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            {t.chrome.confirm_autofill}
          </button>
        </div>
      )}

      {/* Actual Question Input Element */}
      <div 
        className={`w-full py-2 transition-all rounded-2xl ${
          isAutoFilled ? 'bg-blue-50/20 border border-dashed border-blue-300 dark:border-sky-700/60 p-4 animate-pulse-border' : ''
        }`}
      >
        {step.type === 'number' && renderNumberInput()}
        {step.type === 'single' && renderSingleSelect()}
        {step.type === 'multi' && renderMultiSelect()}
        {step.type === 'yesno' && renderYesNo()}
        {step.type === 'text' && renderTextInput()}
      </div>
    </div>
  );
}
