'use client';

import React, { useState } from 'react';
import { ClipboardList, CheckCircle2, ChevronUp, ChevronDown, Clock, Dna, Sparkles, Pill, ShieldCheck, RotateCcw, Edit2, ChevronRight } from 'lucide-react';
import { translations } from '../config/translations';
import { FormStep } from '../hooks/useFormWizard';
import { FormAnswers } from '../config/schema';

const triggerHaptic = () => {
  if (typeof window !== 'undefined' && window.navigator && typeof window.navigator.vibrate === 'function') {
    try {
      window.navigator.vibrate(10);
    } catch (e) {
      // ignore
    }
  }
};

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
  onJumpToStep?: (stepId: string) => void;
  onReset?: () => void;
  steps?: FormStep[];
  answers?: FormAnswers;
}

export default function DoctorCard({
  sectionStats,
  biologicalSex,
  lang,
  onJumpToStep,
  onReset,
  steps = [],
  answers = {}
}: DoctorCardProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const t = translations[lang];

  const sections = [
    { id: 'A', title: lang === 'hi' ? 'बाल झड़ने का इतिहास' : 'Hair Loss History' },
    { id: 'B', title: lang === 'hi' ? 'हार्मोन और स्वास्थ्य' : 'Hormones & Health' },
    { id: 'C', title: lang === 'hi' ? 'जीवनशैली और कारक' : 'Lifestyle & Triggers' },
    { id: 'D', title: lang === 'hi' ? 'उपचार के प्रयास' : 'Treatments tried' },
    { id: 'E', title: lang === 'hi' ? 'सहमति और डीएनए' : 'Consent & DNA' }
  ];

  // Group steps by section
  const groupedSteps: Record<string, FormStep[]> = { A: [], B: [], C: [], D: [], E: [] };
  steps.forEach(s => {
    if (s.id !== 'open_mic' && groupedSteps[s.sectionId]) {
      groupedSteps[s.sectionId].push(s);
    }
  });

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

  const toggleSection = (secId: string) => {
    triggerHaptic();
    setExpandedSection(prev => (prev === secId ? null : secId));
  };

  const handleStepClick = (stepId: string) => {
    triggerHaptic();
    if (onJumpToStep) {
      onJumpToStep(stepId);
      setIsMobileOpen(false);
    }
  };

  const handleResetClick = () => {
    triggerHaptic();
    if (showResetConfirm) {
      if (onReset) onReset();
      setShowResetConfirm(false);
      setIsMobileOpen(false);
      setExpandedSection(null);
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 5000);
    }
  };

  const formatStepValue = (step: FormStep) => {
    const val = step.getValue(answers);
    if (val === undefined || val === null || val === '') return null;
    if (typeof val === 'boolean') return val ? 'Yes' : 'No';
    if (Array.isArray(val)) {
      if (val.length === 0) return null;
      return val.join(', ');
    }
    if (typeof val === 'object') return 'Configured';
    return String(val);
  };

  const renderSectionList = (isMobile = false) => (
    <div className="space-y-2 mb-4">
      {sections.map((sec) => {
        const total = sectionStats.totalBySec[sec.id] || 0;
        const filled = sectionStats.filledBySec[sec.id] || 0;
        const isDone = total > 0 && filled === total;
        const isExpanded = expandedSection === sec.id;
        const secSteps = groupedSteps[sec.id] || [];

        return (
          <div 
            key={sec.id} 
            className={`border rounded-xl transition-all overflow-hidden ${
              isExpanded 
                ? 'bg-emerald-50/40 dark:bg-slate-800/80 border-emerald-300 dark:border-sky-700/60 shadow-xs' 
                : 'bg-slate-50/50 dark:bg-slate-850/50 border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-slate-700'
            }`}
          >
            {/* Clickable Section Row Header */}
            <button
              type="button"
              onClick={() => toggleSection(sec.id)}
              className="w-full flex items-center justify-between p-2.5 text-xs text-left cursor-pointer transition-all active:scale-[0.99]"
              aria-label={`Toggle questions for ${sec.title}`}
            >
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-sky-400 shrink-0" />
                ) : (
                  renderSectionIcon(sec.id, "w-4 h-4 text-emerald-700/80 dark:text-sky-400/80 shrink-0")
                )}
                <span className={isDone ? 'text-slate-900 dark:text-slate-100 font-bold' : ''}>{sec.title}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 font-mono bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                  {filled}/{total}
                </span>
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-emerald-600 dark:text-sky-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>
            </button>

            {/* Expandable Domain Question List */}
            {isExpanded && (
              <div className="px-2.5 pb-2.5 pt-1 border-t border-emerald-100 dark:border-slate-750 divide-y divide-slate-150 dark:divide-slate-800 animate-in slide-in-from-top-1 duration-150">
                {secSteps.length === 0 ? (
                  <p className="text-[11px] text-slate-400 py-1 italic">{lang === 'hi' ? 'कोई सवाल नहीं' : 'No questions in this section'}</p>
                ) : (
                  secSteps.map((s) => {
                    const qVal = formatStepValue(s);
                    const isAnswered = qVal !== null;
                    const qTitle = t.questions[s.id]?.title || s.title;

                    return (
                      <div
                        key={s.id}
                        onClick={() => handleStepClick(s.id)}
                        className="py-1.5 flex items-center justify-between gap-2 hover:bg-white/80 dark:hover:bg-slate-800/90 rounded-lg px-1.5 transition-colors cursor-pointer group"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-medium text-slate-700 dark:text-slate-200 truncate group-hover:text-emerald-700 dark:group-hover:text-sky-300">
                            Q{s.questionNumber}: {qTitle}
                          </p>
                          <p className="text-[10px] truncate">
                            {isAnswered ? (
                              <span className="text-emerald-700 dark:text-sky-300 font-semibold">{qVal}</span>
                            ) : (
                              <span className="text-slate-400 italic">{lang === 'hi' ? 'उत्तर नहीं दिया' : 'Not answered'}</span>
                            )}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStepClick(s.id);
                          }}
                          className="p-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-sky-400 hover:border-emerald-300 shrink-0 shadow-2xs"
                          aria-label={`Edit ${qTitle}`}
                          title={`Edit ${qTitle}`}
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Laptop / Desktop View */}
      <div className="hidden lg:flex flex-col bg-white dark:bg-[#111C33] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs w-72 shrink-0 h-fit sticky top-24">
        <div className="flex items-center gap-2 border-b border-slate-150 dark:border-slate-800 pb-3 mb-4">
          <div className="p-2 bg-emerald-50 dark:bg-sky-950/40 rounded-xl text-emerald-600 dark:text-sky-400 shadow-2xs">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{t.chrome.trichology_file}</h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-400">{t.chrome.geno_intake_rec}</p>
          </div>
        </div>

        {/* Bio info */}
        {biologicalSex && (
          <div className="mb-3 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-750 rounded-xl p-2.5 flex justify-between items-center shadow-2xs">
            <span className="text-slate-500 dark:text-slate-400 font-semibold">{t.chrome.sex}:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {t.questions.biological_sex.options?.[biologicalSex] || biologicalSex}
            </span>
          </div>
        )}

        <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-2 font-medium">
          {lang === 'hi' ? 'प्रश्नों को देखने या संपादित करने के लिए टैप करें:' : 'Click any section to view & edit questions:'}
        </div>

        {renderSectionList()}

        {/* Overall progress bar */}
        <div className="border-t border-slate-150 dark:border-slate-800 pt-3 mt-1">
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
            <span>{t.chrome.overall_progress}</span>
            <span className="font-mono text-emerald-700 dark:text-sky-300">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-150 dark:bg-slate-800 h-2 rounded-full overflow-hidden shadow-inner">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-sky-400 dark:to-blue-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Reset Data Button */}
        {onReset && (
          <div className="mt-4 pt-3 border-t border-slate-150 dark:border-slate-800">
            <button
              type="button"
              onClick={handleResetClick}
              className={`w-full py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs ${
                showResetConfirm
                  ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-600 ring-2 ring-rose-300 animate-pulse'
                  : 'bg-slate-50 hover:bg-rose-50 hover:border-rose-300 text-slate-600 hover:text-rose-600 dark:bg-slate-800/80 dark:hover:bg-rose-950/40 border-slate-200 dark:border-slate-700 dark:text-slate-300 dark:hover:text-rose-400'
              }`}
              aria-label="Reset all intake data"
              title="Reset all intake data"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${showResetConfirm ? 'animate-spin' : ''}`} />
              <span>
                {showResetConfirm
                  ? (lang === 'hi' ? 'पुष्टि करें: सारा डेटा मिटाएं?' : 'Click again to confirm reset')
                  : (lang === 'hi' ? 'डेटा रीसेट करें (Reset Data)' : 'Reset Intake Data')}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Mobile Floating Mini-Card */}
      <div className="lg:hidden fixed bottom-4 right-4 z-40 flex flex-col items-end">
        {isMobileOpen && (
          <div className="bg-white dark:bg-[#111C33] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-xl w-80 max-h-[80vh] overflow-y-auto mb-2 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-800 pb-2 mb-3">
              <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{t.chrome.record_checklist}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-400 font-mono">
                {t.chrome.sex}: {biologicalSex ? (t.questions.biological_sex.options?.[biologicalSex] || biologicalSex) : (lang === 'hi' ? 'चयन नहीं' : 'Not set')}
              </span>
            </div>
            
            {renderSectionList(true)}

            <div className="w-full bg-slate-150 dark:bg-slate-800 h-2 rounded-full overflow-hidden my-2">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-sky-400 dark:to-blue-500 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Mobile Reset Button */}
            {onReset && (
              <button
                type="button"
                onClick={handleResetClick}
                className={`w-full mt-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                  showResetConfirm
                    ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
                    : 'bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>
                  {showResetConfirm
                    ? (lang === 'hi' ? 'पुष्टि करें: रीसेट?' : 'Confirm Reset?')
                    : (lang === 'hi' ? 'डेटा रीसेट करें' : 'Reset Intake Data')}
                </span>
              </button>
            )}
          </div>
        )}

        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-700 to-teal-800 dark:from-sky-500 dark:to-blue-600 text-white dark:text-slate-950 px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all font-bold text-xs border border-emerald-600 dark:border-sky-400 focus:outline-none cursor-pointer active:scale-95"
        >
          <ClipboardList className="w-4 h-4" />
          <span>{lang === 'hi' ? 'प्रगति' : 'Intake Progress'} ({completedSections}/5)</span>
          {isMobileOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
        </button>
      </div>
    </>
  );
}
