'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, RefreshCw, AlertCircle, Check } from 'lucide-react';
import Header from '../components/Header';
import DoctorCard from '../components/DoctorCard';
import StepRenderer from '../components/StepRenderer';
import ReviewScreen from '../components/ReviewScreen';
import ResultsScreen from '../components/ResultsScreen';
import VoiceTextInput from '../components/VoiceTextInput';
import { useFormWizard } from '../hooks/useFormWizard';
import { useSpeechReader } from '../hooks/useSpeechReader';
import { translations } from '../config/translations';

const triggerHaptic = () => {
  if (typeof window !== 'undefined' && window.navigator && typeof window.navigator.vibrate === 'function') {
    try {
      window.navigator.vibrate(10);
    } catch (e) {
      // ignore
    }
  }
};

export default function Home() {
  const {
    isLoaded,
    answers,
    setAnswers,
    autoFilled,
    setAutoFilled,
    currentStepIndex,
    setCurrentStepIndex,
    activeStep,
    steps,
    mode,
    setMode,
    updateAnswer,
    handleNext,
    handleBack,
    jumpToStep,
    confirmAutoFill,
    resetForm,
    sectionStats,
    lang,
    setLang
  } = useFormWizard();

  const { speak, cancelSpeech } = useSpeechReader();
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [openMicText, setOpenMicText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openMicFeedback, setOpenMicFeedback] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [summary, setSummary] = useState('');
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [showCursorGlow, setShowCursorGlow] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Conversational follow-up assistant states
  const [assistantQueue, setAssistantQueue] = useState<string[]>([]);
  const [assistantQueueIdx, setAssistantQueueIdx] = useState(0);
  const [assistantText, setAssistantText] = useState('');
  const [isParsingFollowUp, setIsParsingFollowUp] = useState(false);
  const [followUpError, setFollowUpError] = useState<string | null>(null);
  const [showFollowUpFallback, setShowFollowUpFallback] = useState(false);
  const [hasComputedQueue, setHasComputedQueue] = useState(false);

  // Detect preference on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedTheme = localStorage.getItem('hairvitals_theme') as 'light' | 'dark' | null;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Sync theme with DOM root class list
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('hairvitals_theme', theme);
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      setShowCursorGlow(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const t = translations[lang];

  // 1. Text-To-Speech (TTS) reading assistant
  useEffect(() => {
    if (ttsEnabled && activeStep) {
      const qTrans = t.questions[activeStep.id];
      let speakText = qTrans?.title || activeStep.title;
      if (qTrans?.subtitle || activeStep.subtitle) {
        speakText += '. ' + (qTrans?.subtitle || activeStep.subtitle);
      }
      if (activeStep.type === 'single' || activeStep.type === 'yesno') {
        speakText += lang === 'hi' ? '. विकल्प हैं: ' : '. Options are: ';
        if (activeStep.type === 'yesno') {
          speakText += lang === 'hi' ? 'हाँ या नहीं।' : 'Yes or No.';
        } else if (activeStep.options) {
          const translatedOpts = activeStep.options.map(opt => qTrans?.options?.[opt] || opt);
          speakText += translatedOpts.join(', ') + '.';
        }
      }

      // Romanized fallback for systems without Hindi TTS voice installed
      const romanFallback = lang === 'hi' ? `${activeStep.title}. ${activeStep.subtitle || ''}` : undefined;
      speak(speakText, lang, romanFallback);
    } else {
      cancelSpeech();
    }

    return () => {
      cancelSpeech();
    };
  }, [activeStep, ttsEnabled, lang, t, speak, cancelSpeech]);

  // 2. Open Mic analysis caller
  const handleAnalyzeOpenMic = async (textToAnalyze?: string) => {
    setApiError(null);
    const text = typeof textToAnalyze === 'string' ? textToAnalyze : openMicText;
    if (!text.trim()) {
      // If empty, just start the assistant flow
      setMode('assistant');
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/parse-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!res.ok) {
        throw new Error('Failed to analyze your description. Please try again.');
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await res.json() as any;

      if (result.error) {
        throw new Error(result.error);
      }

      // Merge extracted fields
      if (result.extracted) {
        const nextAutoFilled: Record<string, boolean> = {};

        // Recursive helper to mark keys as autoFilled
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const markKeys = (obj: any, prefix = '') => {
          if (!obj || typeof obj !== 'object') return;
          Object.keys(obj).forEach(key => {
            const path = prefix ? `${prefix}.${key}` : key;
            if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
              markKeys(obj[key], path);
            } else {
              nextAutoFilled[path] = true;
            }
          });
        };

        markKeys(result.extracted);

        // Merge answers cleanly
        setAnswers(prev => {
          // Merge products
          const mergedProducts = { ...prev.products };
          if (result.extracted.products) {
            Object.keys(result.extracted.products).forEach(k => {
              mergedProducts[k] = {
                ...mergedProducts[k],
                ...result.extracted.products[k]
              };
            });
          }

          // Merge procedures
          const mergedProcedures = { ...prev.procedures };
          if (result.extracted.procedures) {
            Object.keys(result.extracted.procedures).forEach(k => {
              mergedProcedures[k] = {
                ...mergedProcedures[k],
                ...result.extracted.procedures[k]
              };
            });
          }

          // Merge habits
          const mergedHabits = {
            ...prev.habits,
            ...result.extracted.habits
          };

          return {
            ...prev,
            ...result.extracted,
            products: mergedProducts,
            procedures: mergedProcedures,
            habits: mergedHabits,
            open_mic_transcript: openMicText
          };
        });

        setAutoFilled(nextAutoFilled);

        if (result.feedback_message) {
          setOpenMicFeedback(result.feedback_message);
        }
      }

      // Transition directly to assistant flow mode
      setMode('assistant');
    } catch (err: unknown) {
      console.error(err);
      setApiError((err as Error).message || 'Something went wrong during extraction.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 3. Final submission caller
  const handleSubmitIntake = async () => {
    setApiError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      });

      if (!res.ok) {
        throw new Error('Failed to generate clinical summary. Please try again.');
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await res.json() as any;
      if (result.error) {
        throw new Error(result.error);
      }

      setSummary(result.summary || 'Summary generated successfully.');
      setMode('results');
    } catch (err: unknown) {
      console.error(err);
      setApiError((err as Error).message || 'Something went wrong generating the summary.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Conversational Assistant logic
  const activeAssistantStepId = assistantQueue[assistantQueueIdx];
  const activeAssistantStep = steps.find(s => s.id === activeAssistantStepId);

  useEffect(() => {
    if (mode === 'assistant') {
      if (!hasComputedQueue && isLoaded) {
        // Find unanswered active steps
        const missingSteps = steps
          .filter(s => s.id !== 'open_mic' && !s.getValue(answers));
        
        // Cap follow-up questions to at most 2-3 high-leverage questions
        const queue = missingSteps.slice(0, 3).map(s => s.id);
        
        console.log("Calculated Assistant Queue (max 3):", queue);
        setAssistantQueue(queue);
        setAssistantQueueIdx(0);
        setHasComputedQueue(true);
      }
    } else {
      setHasComputedQueue(false);
    }
  }, [mode, steps, answers, isLoaded, hasComputedQueue]);

  useEffect(() => {
    if (mode === 'assistant' && activeAssistantStep && ttsEnabled) {
      const qTrans = t.questions[activeAssistantStep.id];
      const speakText = qTrans?.title || activeAssistantStep.title;
      speak(speakText, lang, activeAssistantStep.title);
    }
  }, [mode, assistantQueueIdx, ttsEnabled, lang, activeAssistantStep, t, speak]);

  useEffect(() => {
    if (mode === 'assistant' && hasComputedQueue && (assistantQueue.length === 0 || assistantQueueIdx >= assistantQueue.length)) {
      // 1. Apply helpful defaults for standard untouched fields to minimize manual typing
      setAnswers(prev => {
        const next = { ...prev };
        if (!next.sample_type) next.sample_type = 'Saliva';
        if (!next.consent) next.consent = 'yes';
        if (!next.diagnosed_conditions || next.diagnosed_conditions.length === 0) next.diagnosed_conditions = ['None'];
        if (!next.adult_acne_oily_skin) next.adult_acne_oily_skin = 'no';
        if (!next.excess_body_facial_hair) next.excess_body_facial_hair = 'no';
        if (!next.habits) next.habits = {};
        if (!next.habits.hard_water) next.habits.hard_water = 'no';
        if (!next.habits.heating_tools_styling_chemicals) next.habits.heating_tools_styling_chemicals = 'no';
        if (!next.habits.salon_treatments) next.habits.salon_treatments = 'no';
        if (!next.past_treatment_side_effects) next.past_treatment_side_effects = 'no';
        return next;
      });

      // 2. Mark inferred defaults for review tags
      setAutoFilled(prev => ({
        ...prev,
        'sample_type': prev['sample_type'] ?? true,
        'consent': prev['consent'] ?? true,
        'diagnosed_conditions': prev['diagnosed_conditions'] ?? true,
        'habits.hard_water': prev['habits.hard_water'] ?? true,
        'past_treatment_side_effects': prev['past_treatment_side_effects'] ?? true
      }));

      // 3. Return to standard wizard at first unanswered question, or proceed to review
      const firstUnansweredIdx = steps.findIndex(s => s.id !== 'open_mic' && !s.getValue(answers));
      if (firstUnansweredIdx !== -1) {
        setMode('wizard');
        setCurrentStepIndex(firstUnansweredIdx);
      } else {
        setMode('review');
      }
    }
  }, [mode, hasComputedQueue, assistantQueue, assistantQueueIdx, steps, answers, setMode, setCurrentStepIndex]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleProcessFollowUp = async (speechText: string, step: any) => {
    if (!speechText.trim()) return;
    setIsParsingFollowUp(true);
    setFollowUpError(null);
    setShowFollowUpFallback(false);

    try {
      const qTrans = t.questions[step.id];
      const res = await fetch('/api/parse-followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionKey: step.id,
          questionTitle: qTrans?.title || step.title,
          questionType: step.type,
          options: step.options,
          userSpeech: speechText,
          detectedLanguage: lang === 'hi' ? 'Hindi' : 'English'
        })
      });

      if (!res.ok) {
        throw new Error('Failed to parse response.');
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await res.json() as any;
      if (result.resolvedValue !== null && result.resolvedValue !== undefined) {
        // Successfully resolved!
        setAnswers(prev => {
          let newAns = step.setValue(prev, result.resolvedValue);
          
          // Smart cascade inference: if smoking is "no", default alcohol and severity
          if (step.id === 'habits.smoking' && result.resolvedValue === 'no') {
            if (newAns.habits && !newAns.habits.alcohol) {
              newAns = { ...newAns, habits: { ...newAns.habits, alcohol: 'no' } };
            }
          }
          // If shedding is indicated, default duration
          if (step.id === 'pattern' && Array.isArray(result.resolvedValue) && result.resolvedValue.includes('Sudden excessive shedding')) {
            if (!newAns.duration) {
              newAns = { ...newAns, duration: 'Less than 6 months' };
            }
          }
          return newAns;
        });
        setAutoFilled(prev => ({
          ...prev,
          [step.id]: true
        }));
        
        // Move to next question in queue
        setAssistantText('');
        setAssistantQueueIdx(prev => prev + 1);
      } else {
        // Parsing failed or low confidence. Fall back to manual chips!
        setShowFollowUpFallback(true);
        setFollowUpError(lang === 'hi' ? 'उत्तर स्पष्ट नहीं था। कृपया नीचे से चुनें।' : 'Answer not recognized. Please tap to select below:');
      }
    } catch (err) {
      console.error(err);
      setShowFollowUpFallback(true);
      setFollowUpError(lang === 'hi' ? 'कनेक्शन में त्रुटि। कृपया नीचे से चुनें।' : 'Error parsing response. Please select below:');
    } finally {
      setIsParsingFollowUp(false);
    }
  };

  const handleReset = () => {
    resetForm();
    setOpenMicText('');
    setOpenMicFeedback(null);
    setApiError(null);
    setSummary('');
    setTtsEnabled(false);
    setAssistantQueue([]);
    setAssistantQueueIdx(0);
    setAssistantText('');
    setIsParsingFollowUp(false);
    setFollowUpError(null);
    setShowFollowUpFallback(false);
    setHasComputedQueue(false);
  };

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 text-gray-500 gap-3">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
        <span className="font-semibold text-sm">Loading intake file...</span>
      </div>
    );
  }

  const handleBackNavigation = () => {
    triggerHaptic();
    if (mode === 'assistant') {
      if (assistantQueueIdx > 0) {
        setAssistantQueueIdx(prev => prev - 1);
      } else {
        setMode('wizard');
        setCurrentStepIndex(0);
      }
    } else if (mode === 'results') {
      setMode('review');
    } else if (mode === 'review') {
      setMode('wizard');
      setCurrentStepIndex(steps.length - 1);
    } else if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  // Active step references
  const isFirstStep = currentStepIndex === 0;
  const showBackBtn = mode !== 'wizard' || !isFirstStep;

  // Derive current section ID
  const currentSectionId = mode === 'wizard' && activeStep ? activeStep.sectionId : 'special';

  return (
    <div className="min-h-screen bg-[#EDF2F7] dark:bg-[#070B14] text-slate-800 dark:text-slate-100 flex flex-col items-center antialiased font-sans transition-colors duration-200">
      
      {/* App Header (Wizard, Assistant, and Review Mode) */}
      {mode !== 'results' && (
        <Header
          currentSectionId={currentSectionId}
          sectionStats={sectionStats}
          onBack={handleBackNavigation}
          showBack={showBackBtn}
          ttsEnabled={ttsEnabled}
          setTtsEnabled={setTtsEnabled}
          lang={lang}
          theme={theme}
          setTheme={setTheme}
          onHome={() => {
            triggerHaptic();
            setMode('wizard');
            setCurrentStepIndex(0);
          }}
          onJumpToSection={(secId) => {
            triggerHaptic();
            const firstStepIdx = steps.findIndex(s => s.id !== 'open_mic' && s.sectionId === secId);
            if (firstStepIdx !== -1) {
              setMode('wizard');
              setCurrentStepIndex(firstStepIdx);
            }
          }}
        />
      )}

      {/* Main Container Layout */}
      <main className="flex-1 w-full max-w-5xl px-4 py-6 md:py-10 flex flex-col lg:flex-row gap-8 justify-center items-start">
        
        {/* Dynamic Card Container */}
        <div className="w-full max-w-2xl bg-white dark:bg-[#111C33] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] flex flex-col min-h-[500px] justify-between relative overflow-hidden">
          
          {/* Decorative clinical background blur */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100/50 dark:bg-sky-950/20 rounded-full blur-2xl opacity-70 pointer-events-none -mr-4 -mt-4" />

          {/* Alert messages / API errors */}
          {apiError && (
            <div className="mb-4 bg-rose-50 border border-rose-100 rounded-xl p-3 flex items-start gap-2 text-rose-700 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p>{apiError}</p>
              </div>
            </div>
          )}

          {/* Open Mic Hinglish/Hindi Auto-fill Notification */}
          {openMicFeedback && mode === 'wizard' && currentStepIndex === 1 && (
            <div className="mb-6 bg-emerald-50 dark:bg-sky-950/30 border border-emerald-200 dark:border-sky-800/60 rounded-2xl p-4 flex gap-3 animate-in slide-in-from-top duration-300">
              <Sparkles className="w-5 h-5 text-emerald-600 dark:text-sky-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-bold text-emerald-900 dark:text-sky-200">
                  {lang === 'hi' ? 'चिकित्सीय सहायक नोट (Clinical Assistant Note)' : 'Clinical Assistant Note'}
                </p>
                <p className="text-xs text-emerald-700 dark:text-sky-300 mt-1 font-medium italic">
                  &ldquo;{openMicFeedback}&rdquo;
                </p>
              </div>
              <button
                onClick={() => setOpenMicFeedback(null)}
                className="text-emerald-500 hover:text-emerald-700 dark:text-sky-400 font-bold text-xs self-start cursor-pointer"
                aria-label="Dismiss note"
              >
                {lang === 'hi' ? 'हटाएं' : 'Dismiss'}
              </button>
            </div>
          )}

          {/* Active Screen Rendering */}
          <div className="flex-1 flex flex-col justify-center">
            {mode === 'wizard' && activeStep && (
              <div key={activeStep.id} className="animate-slide-in">
                {/* 2a. SPECIAL: Open Mic Intro View */}
                {activeStep.id === 'open_mic' ? (
                  <div className="flex flex-col gap-5 py-2 relative">
                    {/* Flowing hair-strand background line art texture */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25 select-none -mx-8 -my-6">
                      <svg className="w-full h-full text-emerald-800/10 dark:text-sky-400/10" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M -10,30 Q 30,10 70,50 T 110,30" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        <path d="M -10,40 Q 40,60 60,20 T 110,50" fill="none" stroke="currentColor" strokeWidth="0.3" />
                        <path d="M -10,20 Q 20,50 80,10 T 110,60" fill="none" stroke="currentColor" strokeWidth="0.4" />
                      </svg>
                    </div>
                    <div className="text-center md:text-left">
                      <div className="flex items-center gap-1.5 justify-center md:justify-start bg-emerald-50 dark:bg-sky-950/30 text-emerald-700 dark:text-sky-300 border border-emerald-200 dark:border-sky-800/60 text-xs font-bold px-3 py-1 rounded-full w-fit">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{t.chrome.open_mic_tag}</span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-2.5 leading-tight">
                        {t.questions.open_mic.title}
                      </h2>
                      {t.questions.open_mic.subtitle && (
                        <p className="text-sm text-slate-500 dark:text-slate-300 mt-2 leading-relaxed">
                          {t.questions.open_mic.subtitle}
                        </p>
                      )}
                    </div>

                    <VoiceTextInput
                      value={openMicText}
                      onChange={setOpenMicText}
                      placeholder={lang === 'hi' ? 'जैसे: मेरी उम्र 45 साल है, एक साल से सिर के क्राउन वाले हिस्से पर बाल कम हो रहे हैं...' : "E.g., I'm a 45 year old female. Experiencing thin hair at my crown for a year now. My mother had similar balding. I don't smoke, wash my hair alternate days..."}
                      lang={lang}
                      setLang={setLang}
                      onConfirm={handleAnalyzeOpenMic}
                      confirmLabel={t.chrome.analyze_desc}
                      isAnalyzing={isAnalyzing}
                    />

                    <div className="flex flex-col gap-2 mt-2">
                      <button
                        onClick={() => handleAnalyzeOpenMic()}
                        disabled={isAnalyzing}
                        className="w-full bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 dark:from-sky-500 dark:to-blue-600 dark:hover:from-sky-400 dark:hover:to-blue-500 text-white dark:text-slate-950 font-bold py-3.5 rounded-2xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 text-base cursor-pointer"
                      >
                        {isAnalyzing ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white dark:border-slate-950 border-t-transparent rounded-full animate-spin" />
                            <span>{t.chrome.analyzing}</span>
                          </>
                        ) : (
                          <>
                            <span>{t.chrome.analyze_desc}</span>
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setCurrentStepIndex(1)}
                        disabled={isAnalyzing}
                        className="w-full bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-250 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold py-3 rounded-2xl text-sm transition-all active:scale-[0.99] cursor-pointer"
                      >
                        {t.chrome.skip}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* 2b. STANDARD: Question Wizard Steps */
                  <StepRenderer
                    step={activeStep}
                    value={activeStep.getValue(answers)}
                    onChange={updateAnswer}
                    isAutoFilled={!!autoFilled[activeStep.id]}
                    onConfirm={() => {
                      confirmAutoFill(activeStep.id);
                      handleNext();
                    }}
                    onNext={handleNext}
                    lang={lang}
                    setLang={setLang}
                  />
                )}
              </div>
            )}

            {mode === 'assistant' && activeAssistantStep && (
              <div key={activeAssistantStep.id} className="animate-slide-in flex flex-col gap-6">
                <div className="text-center md:text-left">
                  <div className="flex items-center gap-1.5 justify-center md:justify-start bg-emerald-50 dark:bg-sky-950/30 text-emerald-700 dark:text-sky-300 border border-emerald-200 dark:border-sky-800/60 text-xs font-bold px-3 py-1 rounded-full w-fit">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'चिकित्सीय सहायक (Clinical Assistant)' : 'Clinical Assistant'}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight mt-2.5">
                    {t.questions[activeAssistantStep.id]?.title || activeAssistantStep.title}
                  </h2>
                  {(t.questions[activeAssistantStep.id]?.subtitle || activeAssistantStep.subtitle) && (
                    <p className="text-sm text-slate-500 dark:text-slate-300 mt-2 leading-relaxed">
                      {t.questions[activeAssistantStep.id]?.subtitle || activeAssistantStep.subtitle}
                    </p>
                  )}
                </div>

                {/* Subtitle helper showing progress through follow-up queue */}
                <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold font-mono">
                  {lang === 'hi' ? 'वॉयस फॉलो-अप:' : 'Voice Follow-up:'} {assistantQueueIdx + 1} / {assistantQueue.length}
                </div>

                <div className="w-full max-w-md mx-auto">
                  <VoiceTextInput
                    value={assistantText}
                    onChange={setAssistantText}
                    placeholder={lang === 'hi' ? 'यहाँ बोलें या टाइप करें...' : 'Speak or type your short answer here...'}
                    lang={lang}
                    setLang={setLang}
                    onConfirm={(finalText) => {
                      handleProcessFollowUp(finalText, activeAssistantStep);
                    }}
                    confirmLabel={lang === 'hi' ? 'पुष्टि करें और आगे बढ़ें' : 'Confirm & Continue'}
                    isAnalyzing={isParsingFollowUp}
                  />
                </div>

                {isParsingFollowUp && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 justify-center">
                    <div className="w-4 h-4 border-2 border-emerald-600 dark:border-sky-400 border-t-transparent rounded-full animate-spin" />
                    <span>{lang === 'hi' ? 'उत्तर की जांच की जा रही है...' : 'Analyzing answer...'}</span>
                  </div>
                )}

                {followUpError && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-800 dark:text-sky-300 bg-emerald-50 dark:bg-sky-950/30 border border-emerald-200 dark:border-sky-800/60 p-2.5 rounded-xl">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{followUpError}</span>
                  </div>
                )}

                {/* Fallback Selector chips when speech fails or is requested */}
                {showFollowUpFallback && (
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-2">
                    <StepRenderer
                      step={activeAssistantStep}
                      value={activeAssistantStep.getValue(answers)}
                      onChange={(val) => {
                        updateAnswer(val);
                        setAssistantText('');
                        setShowFollowUpFallback(false);
                        setFollowUpError(null);
                        setAssistantQueueIdx(prev => prev + 1);
                      }}
                      isAutoFilled={false}
                      onConfirm={() => {}}
                      onNext={() => {
                        setAssistantText('');
                        setShowFollowUpFallback(false);
                        setFollowUpError(null);
                        setAssistantQueueIdx(prev => prev + 1);
                      }}
                      lang={lang}
                      setLang={setLang}
                    />
                  </div>
                )}

                {/* Navigation and escape controls */}
                <div className="flex items-center justify-between gap-4 mt-4 border-t border-slate-200 dark:border-slate-800 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setAssistantText('');
                      setShowFollowUpFallback(false);
                      setFollowUpError(null);
                      setAssistantQueueIdx(prev => prev + 1);
                    }}
                    className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-300 rounded-xl border border-slate-250 dark:border-slate-700 active:scale-95 duration-150 cursor-pointer"
                  >
                    {lang === 'hi' ? 'सवाल छोड़ें' : 'Skip Question'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      // Bail out to manual wizard at this exact step!
                      setMode('wizard');
                      const idx = steps.findIndex(s => s.id === activeAssistantStep.id);
                      if (idx !== -1) {
                        setCurrentStepIndex(idx);
                      }
                    }}
                    className="px-4 py-2.5 text-xs font-bold text-emerald-700 dark:text-sky-300 bg-emerald-50 dark:bg-sky-950/30 rounded-xl border border-emerald-200 dark:border-sky-800/60 active:scale-95 duration-150 cursor-pointer hover:bg-emerald-100 dark:hover:bg-sky-900/40"
                  >
                    {lang === 'hi' ? 'मैन्युअल रूप से भरें' : 'Skip & fill manually'}
                  </button>
                </div>
              </div>
            )}

            {mode === 'review' && (
              <ReviewScreen
                answers={answers}
                steps={steps}
                onJumpToStep={jumpToStep}
                onSubmit={handleSubmitIntake}
                isSubmitting={isSubmitting}
                lang={lang}
              />
            )}

            {mode === 'results' && (
              <ResultsScreen
                answers={answers}
                summary={summary}
                onReset={handleReset}
                lang={lang}
              />
            )}
          </div>

          {/* Standard Navigation Controls (Only shown for active questions in wizard flow) */}
          {mode === 'wizard' && activeStep && activeStep.id !== 'open_mic' && (
            <div className="mt-8 border-t border-gray-100 pt-6 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => { triggerHaptic(); handleBack(); }}
                className="px-5 py-3.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 rounded-2xl font-bold text-sm transition-all flex items-center gap-1 active:scale-95 duration-150"
              >
                {t.chrome.back}
              </button>

              {/* Next button only active for non-steppers or if option selected */}
              {(activeStep.type === 'multi' || activeStep.type === 'number' || activeStep.type === 'text') ? (
                <button
                  type="button"
                  onClick={() => { triggerHaptic(); handleNext(); }}
                  className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm transition-all flex items-center gap-1 shadow-sm hover:shadow-md active:scale-95 duration-150"
                >
                  <span>{t.chrome.next}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="text-[11px] text-gray-400 font-semibold italic flex items-center gap-1 bg-gray-55 px-2.5 py-1 rounded-full">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{t.chrome.auto_advance}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Doctor Card Checklist (Desktop column display, hidden during review/results) */}
        {mode === 'wizard' && (
          <DoctorCard
            sectionStats={sectionStats}
            biologicalSex={answers.biological_sex}
            lang={lang}
            steps={steps}
            answers={answers}
            onJumpToStep={(stepId) => {
              triggerHaptic();
              const idx = steps.findIndex(s => s.id === stepId);
              if (idx !== -1) {
                setMode('wizard');
                setCurrentStepIndex(idx);
              }
            }}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Desktop only pointer follow glow, respects prefers-reduced-motion */}
      {showCursorGlow && (
        <div 
          className="pointer-events-none fixed z-50 w-10 h-10 rounded-full bg-emerald-500/8 blur-md transition-all duration-300 ease-out hidden md:block motion-reduce:hidden"
          style={{
            left: `${cursorPos.x - 20}px`,
            top: `${cursorPos.y - 20}px`,
          }}
        />
      )}
    </div>
  );
}
