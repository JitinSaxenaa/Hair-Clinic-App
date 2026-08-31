'use client';

import React, { useState } from 'react';
import { ClipboardList, CheckCircle2, ChevronUp, ChevronDown, Clock, Dna, Sparkles, Pill, ShieldCheck } from 'lucide-react';
import { translations } from '../config/translations';

const renderSectionIcon = (secId: string, className = "w-3.5 h-3.5 text-emerald-700/80 shrink-0") => {
  switch (secId) {
    case 'A': return <Clock className={className} />;
    case 'B': return <Dna className={className} />;
    case 'C': return <Sparkles className={className} />;
    case 'D': return <Pill className={className} />;
    case 'E': return <ShieldCheck className={className} />;
    default: return null;
  }
};

interface DoctorCardProps {
  sectionStats: {
    totalBySec: Record<string, number>;
    filledBySec: Record<string, number>;
  };
  biologicalSex?: string;
  lang: 'en' | 'hi';
}

export default function DoctorCard({ sectionStats, biologicalSex, lang }: DoctorCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = translations[lang];

  const sections = [
    { id: 'A', title: lang === 'hi' ? 'बाल झड़ने का इतिहास' : 'Hair Loss History' },
    { id: 'B', title: lang === 'hi' ? 'हार्मोन और स्वास्थ्य' : 'Hormones & Health' },
    { id: 'C', title: lang === 'hi' ? 'जीवनशैली और कारक' : 'Lifestyle & Triggers' },
    { id: 'D', title: lang === 'hi' ? 'उपचार के प्रयास' : 'Treatments tried' },
    { id: 'E', title: lang === 'hi' ? 'सहमति और डीएनए' : 'Consent & DNA' }
  ];

  // Calculate overall progress
  let totalQuestions = 0;
  let filledQuestions = 0;
  sections.forEach(s => {
    totalQuestions += sectionStats.totalBySec[s.id] || 0;
    filledQuestions += sectionStats.filledBySec[s.id] || 0;
  });

  const completedSections = sections.filter(s => {
    const total = sectionStats.totalBySec[s.id] || 0;
    const filled = sectionStats.filledBySec[s.id] || 0;
    return total > 0 && filled === total;
  }).length;

  const progressPercent = totalQuestions > 0 ? Math.round((filledQuestions / totalQuestions) * 100) : 0;

  return (
    <>
      {/* Laptop / Desktop View */}
      <div className="hidden lg:flex flex-col bg-white dark:bg-[#111C33] border-2 border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs w-64 shrink-0 h-fit sticky top-24">
        <div className="flex items-center gap-2 border-b border-slate-150 dark:border-slate-800 pb-3 mb-4">
          <div className="p-1.5 bg-emerald-50 dark:bg-sky-950/40 rounded-lg text-emerald-600 dark:text-sky-400">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{t.chrome.trichology_file}</h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-400">{t.chrome.geno_intake_rec}</p>
          </div>
        </div>

        {/* Bio info */}
        {biologicalSex && (
          <div className="mb-4 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-750 rounded-lg p-2 flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">{t.chrome.sex}:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {t.questions.biological_sex.options?.[biologicalSex] || biologicalSex}
            </span>
          </div>
        )}

        <div className="space-y-3 mb-4">
          {sections.map((sec) => {
            const total = sectionStats.totalBySec[sec.id] || 0;
            const filled = sectionStats.filledBySec[sec.id] || 0;
            const isDone = total > 0 && filled === total;

            return (
              <div key={sec.id} className="flex items-start justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-sky-400 shrink-0" />
                  ) : (
                    renderSectionIcon(sec.id, "w-4 h-4 text-emerald-700/80 dark:text-sky-400/80 shrink-0")
                  )}
                  <span className={isDone ? 'text-slate-900 dark:text-slate-100 font-bold' : ''}>{sec.title}</span>
                </div>
                <span className="text-slate-400 dark:text-slate-400 font-mono">
                  {filled}/{total}
                </span>
              </div>
            );
          })}
        </div>

        {/* Overall progress bar */}
        <div className="border-t border-slate-150 dark:border-slate-800 pt-3 mt-2">
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
            <span>{t.chrome.overall_progress}</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-150 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-sky-400 dark:to-blue-500 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Mobile Floating Mini-Card */}
      <div className="lg:hidden fixed bottom-4 right-4 z-40 flex flex-col items-end">
        {isOpen && (
          <div className="bg-white dark:bg-[#111C33] border-2 border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-lg w-72 mb-2 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-800 pb-2 mb-3">
              <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{t.chrome.record_checklist}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-400 font-mono">
                {t.chrome.sex}: {biologicalSex ? (t.questions.biological_sex.options?.[biologicalSex] || biologicalSex) : (lang === 'hi' ? 'चयन नहीं' : 'Not set')}
              </span>
            </div>
            
            <div className="space-y-2 mb-3">
              {sections.map((sec) => {
                const total = sectionStats.totalBySec[sec.id] || 0;
                const filled = sectionStats.filledBySec[sec.id] || 0;
                const isDone = total > 0 && filled === total;

                return (
                  <div key={sec.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-sky-400 shrink-0" />
                      ) : (
                        renderSectionIcon(sec.id, "w-3.5 h-3.5 text-emerald-700/80 dark:text-sky-400/80 shrink-0")
                      )}
                      <span className={isDone ? 'text-slate-900 dark:text-slate-100 font-bold' : ''}>{sec.title}</span>
                    </div>
                    <span className="text-slate-400 dark:text-slate-400 font-mono text-[10px]">
                      {filled}/{total}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="w-full bg-slate-150 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-sky-400 dark:to-blue-500 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-700 to-teal-800 dark:from-sky-500 dark:to-blue-600 text-white dark:text-slate-950 px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all font-bold text-xs border border-emerald-600 dark:border-sky-400 focus:outline-none cursor-pointer active:scale-95"
        >
          <ClipboardList className="w-4 h-4" />
          <span>{lang === 'hi' ? 'प्रगति' : 'Intake Progress'} ({completedSections}/5)</span>
          {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
        </button>
      </div>
    </>
  );
}
