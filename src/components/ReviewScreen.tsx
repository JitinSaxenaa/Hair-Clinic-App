'use client';

import React from 'react';
import { Edit2, CheckCircle2, Clock, Dna, Sparkles, Pill, ShieldCheck } from 'lucide-react';
import { FormAnswers } from '../config/schema';
import { FormStep } from '../hooks/useFormWizard';
import { translations } from '../config/translations';

const renderSectionIcon = (secId: string) => {
  const className = "w-4 h-4 text-emerald-700 shrink-0";
  switch (secId) {
    case 'A': return <Clock className={className} />;
    case 'B': return <Dna className={className} />;
    case 'C': return <Sparkles className={className} />;
    case 'D': return <Pill className={className} />;
    case 'E': return <ShieldCheck className={className} />;
    default: return null;
  }
};

interface ReviewScreenProps {
  answers: FormAnswers;
  steps: FormStep[];
  onJumpToStep: (stepId: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  lang: 'en' | 'hi';
}

export default function ReviewScreen({
  answers,
  steps,
  onJumpToStep,
  onSubmit,
  isSubmitting,
  lang
}: ReviewScreenProps) {
  const t = translations[lang];
  
  // Group the active steps by Section (A to E)
  const groupedSteps = React.useMemo(() => {
    const groups: Record<string, FormStep[]> = { A: [], B: [], C: [], D: [], E: [] };
    
    steps.forEach(s => {
      if (s.sectionId === 'special') return; // skip open mic & sex gate in the section review
      if (groups[s.sectionId]) {
        groups[s.sectionId].push(s);
      }
    });

    return groups;
  }, [steps]);

  // Format values for human consumption
  const formatValue = (step: FormStep, val: unknown) => {
    const qTrans = t.questions[step.id];
    if (val === undefined || val === null || val === '') {
      return <span className="text-gray-400 italic">{t.chrome.not_answered}</span>;
    }
    if (Array.isArray(val)) {
      if (val.length === 0) {
        return <span className="text-gray-400 italic">{t.chrome.none_selected}</span>;
      }
      return (
        <div className="flex flex-wrap gap-1 mt-1">
          {val.map(x => {
            const displayOpt = qTrans?.options?.[x] || x;
            return (
              <span key={x} className="bg-gray-150 text-gray-700 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                {displayOpt}
              </span>
            );
          })}
        </div>
      );
    }
    if (val === 'yes') {
      return (
        <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
          {lang === 'hi' ? 'हाँ' : 'Yes'}
        </span>
      );
    }
    if (val === 'no') {
      return (
        <span className="text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
          {lang === 'hi' ? 'नहीं' : 'No'}
        </span>
      );
    }
    if (typeof val === 'boolean') {
      return val ? (
        <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
          {lang === 'hi' ? 'हाँ' : 'Yes'}
        </span>
      ) : (
        <span className="text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
          {lang === 'hi' ? 'नहीं' : 'No'}
        </span>
      );
    }
    
    // Look up translated string value if exists
    const stringVal = String(val);
    const displayVal = qTrans?.options?.[stringVal] || stringVal;
    return <span className="font-semibold text-gray-800">{displayVal}</span>;
  };

  return (
    <div className="w-full flex flex-col gap-6 select-none animate-in fade-in duration-200">
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold text-gray-800">{t.chrome.review_title}</h2>
        <p className="text-sm text-gray-500 mt-1">
          {t.chrome.review_desc}
        </p>
      </div>

      {/* Sex info shown at the top */}
      {answers.biological_sex && (
        <div className="flex justify-between items-center bg-[#FCFAF7] dark:bg-zinc-900/40 border border-[#EFECE6] dark:border-zinc-800 rounded-2xl p-4">
          <div>
            <p className="text-xs text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">{t.chrome.sex}</p>
            <p className="text-base font-bold text-gray-700 dark:text-zinc-200 mt-0.5">
              {t.questions.biological_sex.options?.[answers.biological_sex] || answers.biological_sex}
            </p>
          </div>
          <button
            onClick={() => onJumpToStep('biological_sex')}
            className="p-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-750 active:scale-95 duration-150 cursor-pointer"
            aria-label="Edit biological sex"
          >
            <Edit2 className="w-4 h-4 text-emerald-600 dark:text-sky-400" />
          </button>
        </div>
      )}

      {/* Section-wise checklist cards */}
      <div className="space-y-4">
        {Object.entries(groupedSteps).map(([secId, secSteps]) => {
          if (secSteps.length === 0) return null;
          return (
            <div key={secId} className="bg-white dark:bg-[#111C33] border-2 border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
              <div className="bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 px-4 py-3">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
                  <span className="bg-emerald-600 dark:bg-sky-500 text-white dark:text-slate-950 w-5 h-5 rounded-md flex items-center justify-center font-mono text-xs font-bold">
                    {secId}
                  </span>
                  {renderSectionIcon(secId)}
                  {t.sections[secId]}
                </h3>
              </div>

              <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                {secSteps.map((step) => {
                  const val = step.getValue(answers);
                  const qTrans = t.questions[step.id];
                  const displayQTitle = qTrans?.title || step.title;
                  const displayQSub = qTrans?.subtitle || step.subtitle;

                  // Render step detail row
                  return (
                    <div key={step.id} className="flex items-start justify-between p-4 gap-4 hover:bg-gray-50/50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] text-gray-400 font-bold tracking-wider block">
                          Q{step.questionNumber} {displayQSub ? `· ${displayQSub}` : ''}
                        </span>
                        <p className="text-xs font-semibold text-gray-600 mt-0.5">
                          {displayQTitle}
                        </p>
                        <div className="mt-1 text-sm">
                          {formatValue(step, val)}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => onJumpToStep(step.id)}
                        className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-emerald-600 rounded-xl transition-all border border-gray-200 self-center active:scale-95 duration-150"
                        aria-label={`Edit answer for ${displayQTitle}`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="bg-[#FCFAF7] border border-[#EFECE6] rounded-2xl p-4 flex flex-col items-center gap-2 mt-4">
        <p className="text-center text-xs text-gray-500 leading-relaxed max-w-xs">
          {lang === 'hi'
            ? 'जमा करके, आप पुष्टि करते हैं कि ये उत्तर आपके वर्तमान स्वास्थ्य प्रोफाइल का प्रतिनिधित्व करते हैं।'
            : 'By submitting, you confirm that these answers represent your current health profile.'}
        </p>
        
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{t.chrome.submitting}</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>{t.chrome.submit}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
