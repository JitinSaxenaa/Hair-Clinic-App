'use client';

import { useState, useEffect, useMemo } from 'react';
import { formSchema, FormAnswers, AutoFillMetadata, TableRowConfig, TableColumnConfig } from '../config/schema';

export interface FormStep {
  id: string; // unique string identifier
  sectionId: 'A' | 'B' | 'C' | 'D' | 'E' | 'special';
  sectionTitle?: string;
  questionNumber: number; // 1-16 (0 for special/sex gate)
  title: string;
  subtitle?: string;
  type: 'number' | 'single' | 'multi' | 'yesno' | 'text' | 'bool';
  options?: string[];
  placeholder?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getValue: (answers: FormAnswers) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: (answers: FormAnswers, value: any) => FormAnswers;
}

const STORAGE_KEY = 'hairvitals_intake_state';

interface SavedState {
  answers: FormAnswers;
  autoFilled: AutoFillMetadata;
  currentStepIndex: number;
  mode: 'wizard' | 'review' | 'results' | 'assistant';
  lang?: 'en' | 'hi';
}

export function useFormWizard() {
  const [answers, setAnswers] = useState<FormAnswers>({});
  const [autoFilled, setAutoFilled] = useState<AutoFillMetadata>({});
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [mode, setMode] = useState<'wizard' | 'review' | 'results' | 'assistant'>('wizard');
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from sessionStorage
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as SavedState;
        setTimeout(() => {
          if (parsed.answers) setAnswers(parsed.answers);
          if (parsed.autoFilled) setAutoFilled(parsed.autoFilled);
          if (parsed.currentStepIndex !== undefined) setCurrentStepIndex(parsed.currentStepIndex);
          if (parsed.mode) setMode(parsed.mode);
          if (parsed.lang) setLang(parsed.lang);
          setIsLoaded(true);
        }, 0);
        return;
      }
    } catch (e) {
      console.error('Failed to load state from sessionStorage', e);
    }
    setTimeout(() => setIsLoaded(true), 0);
  }, []);

  // Save to sessionStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const stateToSave: SavedState = { answers, autoFilled, currentStepIndex, mode, lang };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Failed to save state to sessionStorage', e);
    }
  }, [answers, autoFilled, currentStepIndex, mode, lang, isLoaded]);

  // Construct flat list of steps based on schema and current state
  const steps = useMemo<FormStep[]>(() => {
    const list: FormStep[] = [];

    // 1. Open Mic step
    list.push({
      id: 'open_mic',
      sectionId: 'special',
      questionNumber: 0,
      title: 'Tell us about your hair journey',
      subtitle: 'Share in your own words — how it started, what you’ve tried, or how it affects you. You can speak or type. (Optional)',
      type: 'text',
      placeholder: 'E.g., I noticed my hair thinning at the crown about a year ago. My mother also had thin hair. I wash daily and tried OTC shampoos...',
      getValue: (ans) => ans.open_mic_transcript || '',
      setValue: (ans, val) => ({ ...ans, open_mic_transcript: val })
    });

    // 2. Sex Gate (so we filter menstrual / pregnancy questions)
    list.push({
      id: 'biological_sex',
      sectionId: 'special',
      questionNumber: 0,
      title: 'What is your biological sex?',
      subtitle: 'We ask this so we only show questions relevant to your body.',
      type: 'single',
      options: ['Male', 'Female', 'Prefer not to say'],
      getValue: (ans) => ans.biological_sex,
      setValue: (ans, val) => {
        // If sex changes, clear sex-specific answers to keep state clean
        const newAns = { ...ans, biological_sex: val };
        if (val !== 'Female') {
          delete newAns.menstrual_cycle;
          delete newAns.pregnancy_related;
        }
        return newAns;
      }
    });

    const isFemale = answers.biological_sex === 'Female';

    // Loop through form schema sections A-E
    formSchema.sections.forEach(section => {
      section.questions.forEach(q => {
        // Skip femaleOnly questions if not female
        if (q.femaleOnly && !isFemale) {
          return;
        }

        // Skip Q14, Q15, and Q16 inside the loop because they are pushed manually at the end
        if (q.n === 14 || q.n === 15 || q.n === 16) {
          return;
        }

        

        if (q.type === 'number') {
          list.push({
            id: q.key,
            sectionId: section.id as 'A' | 'B' | 'C' | 'D' | 'E',
            sectionTitle: section.title,
            questionNumber: q.n,
            title: 'At what age did your hair loss begin?',
            subtitle: 'Enter your approximate age in years.',
            type: 'number',
            getValue: (ans) => ans[q.key as keyof FormAnswers],
            setValue: (ans, val) => ({ ...ans, [q.key]: val })
          });
        } else if (q.type === 'single') {
          let title = '';
          let subtitle = '';
          if (q.key === 'duration') {
            title = 'How long have you been experiencing hair loss?';
            subtitle = 'Select the option that best describes your duration.';
          } else if (q.key === 'menstrual_cycle') {
            title = 'How would you describe your menstrual cycle?';
            subtitle = 'This helps us understand potential hormonal influences.';
          } else if (q.key === 'pregnancy_related') {
            title = 'Are you currently pregnant or postpartum?';
            subtitle = 'Pregnancy and childbirth can significantly affect hair shedding cycles.';
          } else if (q.key === 'sample_type') {
            title = 'Which DNA sample collection method do you prefer?';
            subtitle = 'Choose saliva swabbing, blood draw, or either.';
          } else {
            title = `Question ${q.n}`;
          }

          list.push({
            id: q.key,
            sectionId: section.id as 'A' | 'B' | 'C' | 'D' | 'E',
            sectionTitle: section.title,
            questionNumber: q.n,
            title,
            subtitle,
            type: 'single',
            options: q.options,
            getValue: (ans) => ans[q.key as keyof FormAnswers],
            setValue: (ans, val) => ({ ...ans, [q.key]: val })
          });
        } else if (q.type === 'multi') {
          let title = '';
          let subtitle = '';
          if (q.key === 'family_history') {
            title = 'Is there a family history of hair loss?';
            subtitle = 'Select all that apply. This helps identify genetic patterns.';
          } else if (q.key === 'pattern') {
            title = 'Where are you noticing the hair loss or thinning?';
            subtitle = 'Select all areas and patterns that match your experience.';
          } else if (q.key === 'diagnosed_conditions') {
            title = 'Have you been diagnosed with any of these conditions?';
            subtitle = 'Select all that apply. Hormones and health conditions play a big role.';
          } else if (q.key === 'past_6_months') {
            title = 'Have you experienced any of these in the past 6 months?';
            subtitle = 'Physical or emotional stressors can trigger hair shedding weeks or months later.';
          } else {
            title = `Question ${q.n}`;
          }

          list.push({
            id: q.key,
            sectionId: section.id as 'A' | 'B' | 'C' | 'D' | 'E',
            sectionTitle: section.title,
            questionNumber: q.n,
            title,
            subtitle,
            type: 'multi',
            options: q.options,
            getValue: (ans) => ans[q.key as keyof FormAnswers] || [],
            setValue: (ans, val) => ({ ...ans, [q.key]: val })
          });
        } else if (q.type === 'yesno') {
          let title = '';
          let subtitle = '';
          if (q.key === 'adult_acne_oily_skin') {
            title = 'Do you experience adult acne or excessively oily skin?';
            subtitle = 'This can indicate elevated androgenic (hormonal) activity.';
          } else if (q.key === 'excess_body_facial_hair') {
            title = 'Do you have excess body or facial hair?';
            subtitle = 'This is another sign of hormonal balance levels that we check.';
          } else if (q.key === 'consent') {
            title = 'Do you consent to DNA analysis for hair loss risk factors?';
            subtitle = 'Your sample will only be analyzed for genetic hair/scalp markers.';
          } else {
            title = `Question ${q.n}`;
          }

          list.push({
            id: q.key,
            sectionId: section.id as 'A' | 'B' | 'C' | 'D' | 'E',
            sectionTitle: section.title,
            questionNumber: q.n,
            title,
            subtitle,
            type: 'yesno',
            getValue: (ans) => ans[q.key as keyof FormAnswers],
            setValue: (ans, val) => ({ ...ans, [q.key]: val })
          });
        } else if (q.type === 'table') {
          if (q.key === 'habits') {
            // Habits rows
            (q.rows as TableRowConfig[]).forEach(row => {
              let rowTitle = '';
              let rowSubtitle = '';
              if (row.key === 'smoking') {
                rowTitle = 'Do you smoke cigarettes?';
                rowSubtitle = 'Smoking affects scalp micro-circulation.';
              } else if (row.key === 'alcohol') {
                rowTitle = 'Do you consume alcohol regularly?';
                rowSubtitle = 'Regular alcohol intake can affect nutrient absorption.';
              } else if (row.key === 'hard_water') {
                rowTitle = 'Is your household tap water hard water?';
                rowSubtitle = 'Hard water mineral deposits can cause hair breakage and scalp dry state.';
              } else if (row.key === 'hair_wash_frequency') {
                rowTitle = 'How often do you wash your hair?';
                rowSubtitle = 'Washing frequency influences sebum buildup and scalp health.';
              } else if (row.key === 'heating_tools_styling_chemicals') {
                rowTitle = 'Do you use heat styling tools or chemical treatments?';
                rowSubtitle = 'E.g. blow dryers, straighteners, dyes, perms, relaxers.';
              } else if (row.key === 'salon_treatments') {
                rowTitle = 'Do you receive salon hair treatments?';
                rowSubtitle = 'E.g. hair spa, keratin treatments, deep conditioning.';
              }

              // Add the main row step
              list.push({
                id: `habits.${row.key}`,
                sectionId: section.id as 'A' | 'B' | 'C' | 'D' | 'E',
                sectionTitle: section.title,
                questionNumber: q.n,
                title: rowTitle,
                subtitle: rowSubtitle,
                type: row.type,
                options: row.options,
                getValue: (ans) => ans.habits?.[row.key as keyof typeof ans.habits],
                setValue: (ans, val) => ({
                  ...ans,
                  habits: {
                    ...ans.habits,
                    [row.key]: val
                  }
                })
              });

              // Add followup if smoking is yes
              if (row.key === 'smoking' && answers.habits?.smoking === 'yes') {
                list.push({
                  id: `habits.smoking_severity`,
                  sectionId: section.id as 'A' | 'B' | 'C' | 'D' | 'E',
                  sectionTitle: section.title,
                  questionNumber: q.n,
                  title: 'How much do you smoke daily?',
                  subtitle: 'Select your smoking severity category.',
                  type: 'single',
                  options: row.followup?.options,
                  getValue: (ans) => ans.habits?.smoking_severity,
                  setValue: (ans, val) => ({
                    ...ans,
                    habits: {
                      ...ans.habits,
                      smoking_severity: val
                    }
                  })
                });
              }

              // Add followup if salon_treatments is yes
              if (row.key === 'salon_treatments' && answers.habits?.salon_treatments === 'yes') {
                list.push({
                  id: `habits.salon_treatment_detail`,
                  sectionId: section.id as 'A' | 'B' | 'C' | 'D' | 'E',
                  sectionTitle: section.title,
                  questionNumber: q.n,
                  title: 'Tell us about your salon treatments',
                  subtitle: 'What treatments do you get and how often? Speak or type.',
                  type: 'text',
                  placeholder: 'E.g., Keratin treatment every 3 months, blow-out twice a month...',
                  getValue: (ans) => ans.habits?.salon_treatment_detail || '',
                  setValue: (ans, val) => ({
                    ...ans,
                    habits: {
                      ...ans.habits,
                      salon_treatment_detail: val
                    }
                  })
                });
              }
            });
          } else if (q.key === 'products') {
            // Products rows (strings) and columns
            const rows = q.rows as string[];
            const cols = q.columns as TableColumnConfig[];

            rows.forEach(row => {
              // 1. Used column step
              list.push({
                id: `products.${row}.used`,
                sectionId: section.id as 'A' | 'B' | 'C' | 'D' | 'E',
                sectionTitle: section.title,
                questionNumber: q.n,
                title: `Have you used ${row}?`,
                subtitle: 'Let us know if this has been part of your regimen.',
                type: 'yesno',
                getValue: (ans) => {
                  const usedVal = ans.products?.[row]?.used;
                  if (usedVal === undefined) return undefined;
                  return usedVal ? 'yes' : 'no';
                },
                setValue: (ans, val) => {
                  const usedBool = val === 'yes';
                  const existingRow = ans.products?.[row] || {};
                  const updatedRow = usedBool 
                    ? { ...existingRow, used: true }
                    : { used: false }; // Clear details if set to no

                  return {
                    ...ans,
                    products: {
                      ...ans.products,
                      [row]: updatedRow
                    }
                  };
                }
              });

              // If used, ask the duration, helped, side_effects
              if (answers.products?.[row]?.used) {
                cols.forEach(col => {
                  if (col.key === 'used') return; // already handled

                  let colTitle = '';
                  let colSubtitle = '';
                  let colType: 'single' | 'yesno' = 'yesno';

                  if (col.key === 'duration') {
                    colTitle = `How long did you use ${row}?`;
                    colSubtitle = 'Select the duration.';
                    colType = 'single';
                  } else if (col.key === 'helped') {
                    colTitle = `Did ${row} help with your hair loss?`;
                    colSubtitle = 'Select whether it was effective.';
                    colType = 'yesno';
                  } else if (col.key === 'side_effects') {
                    colTitle = `Did you experience side effects from ${row}?`;
                    colSubtitle = 'E.g., skin irritation, headache, dizziness.';
                    colType = 'yesno';
                  }

                  list.push({
                    id: `products.${row}.${col.key}`,
                    sectionId: section.id as 'A' | 'B' | 'C' | 'D' | 'E',
                    sectionTitle: section.title,
                    questionNumber: q.n,
                    title: colTitle,
                    subtitle: colSubtitle,
                    type: colType,
                    options: col.options,
                    getValue: (ans) => ans.products?.[row]?.[col.key as 'duration' | 'helped' | 'side_effects'],
                    setValue: (ans, val) => {
                      const existingRow = ans.products?.[row] || {};
                      return {
                        ...ans,
                        products: {
                          ...ans.products,
                          [row]: {
                            ...existingRow,
                            [col.key as 'duration' | 'helped' | 'side_effects']: val
                          }
                        }
                      };
                    }
                  });
                });
              }
            });
          } else if (q.key === 'procedures') {
            // Procedures rows (strings) and columns
            const rows = q.rows as string[];
            const cols = q.columns as TableColumnConfig[];

            rows.forEach(row => {
              // 1. Done column step
              list.push({
                id: `procedures.${row}.done`,
                sectionId: section.id as 'A' | 'B' | 'C' | 'D' | 'E',
                sectionTitle: section.title,
                questionNumber: q.n,
                title: `Have you ever done a ${row} procedure?`,
                subtitle: 'Let us know if you underwent this hair clinical treatment.',
                type: 'yesno',
                getValue: (ans) => {
                  const doneVal = ans.procedures?.[row]?.done;
                  if (doneVal === undefined) return undefined;
                  return doneVal ? 'yes' : 'no';
                },
                setValue: (ans, val) => {
                  const doneBool = val === 'yes';
                  const existingRow = ans.procedures?.[row] || {};
                  const updatedRow = doneBool
                    ? { ...existingRow, done: true }
                    : { done: false }; // Clear details if set to no

                  return {
                    ...ans,
                    procedures: {
                      ...ans.procedures,
                      [row]: updatedRow
                    }
                  };
                }
              });

              // If done, ask sessions, helped
              if (answers.procedures?.[row]?.done) {
                cols.forEach(col => {
                  if (col.key === 'done') return; // already handled

                  let colTitle = '';
                  let colSubtitle = '';
                  let colType: 'single' | 'yesno' = 'yesno';

                  if (col.key === 'sessions') {
                    colTitle = `How many sessions of ${row} did you have?`;
                    colSubtitle = 'Select the count of sessions.';
                    colType = 'single';
                  } else if (col.key === 'helped') {
                    colTitle = `Did the ${row} procedure help?`;
                    colSubtitle = 'Let us know if you noticed improvements.';
                    colType = 'yesno';
                  }

                  list.push({
                    id: `procedures.${row}.${col.key}`,
                    sectionId: section.id as 'A' | 'B' | 'C' | 'D' | 'E',
                    sectionTitle: section.title,
                    questionNumber: q.n,
                    title: colTitle,
                    subtitle: colSubtitle,
                    type: colType,
                    options: col.options,
                    getValue: (ans) => ans.procedures?.[row]?.[col.key as 'sessions' | 'helped'],
                    setValue: (ans, val) => {
                      const existingRow = ans.procedures?.[row] || {};
                      return {
                        ...ans,
                        procedures: {
                          ...ans.procedures,
                          [row]: {
                            ...existingRow,
                            [col.key as 'sessions' | 'helped']: val
                          }
                        }
                      };
                    }
                  });
                });
              }
            });
          }
        }
      });
    });

    // 3. Past treatment side effects (Q14)
    list.push({
      id: 'past_treatment_side_effects',
      sectionId: 'D',
      sectionTitle: 'Current Hair Care & Treatments',
      questionNumber: 14,
      title: 'Have you had side effects from any past hair treatments?',
      subtitle: 'This includes any products, shampoos, pills, or clinical procedures.',
      type: 'yesno',
      getValue: (ans) => ans.past_treatment_side_effects,
      setValue: (ans, val) => {
        const newAns = { ...ans, past_treatment_side_effects: val };
        if (val !== 'yes') {
          delete newAns.past_treatment_side_effects_describe;
        }
        return newAns;
      }
    });

    if (answers.past_treatment_side_effects === 'yes') {
      list.push({
        id: 'past_treatment_side_effects_describe',
        sectionId: 'D',
        sectionTitle: 'Current Hair Care & Treatments',
        questionNumber: 14,
        title: 'Please describe the side effects',
        subtitle: 'Tell us which treatments caused it and what occurred. Speak or type.',
        type: 'text',
        placeholder: 'E.g., Minoxidil caused scalp itching and red flaking skin for 2 weeks...',
        getValue: (ans) => ans.past_treatment_side_effects_describe || '',
        setValue: (ans, val) => ({ ...ans, past_treatment_side_effects_describe: val })
      });
    }

    // 4. Sample Collection method (Q15)
    list.push({
      id: 'sample_type',
      sectionId: 'E',
      sectionTitle: 'Sample Collection & Consent',
      questionNumber: 15,
      title: 'Which DNA sample type do you prefer?',
      subtitle: 'Saliva collection is a simple cheek swab. Blood sample requires a quick visit.',
      type: 'single',
      options: ['Saliva', 'Blood', 'Either'],
      getValue: (ans) => ans.sample_type,
      setValue: (ans, val) => ({ ...ans, sample_type: val })
    });

    // 5. Consent (Q16)
    list.push({
      id: 'consent',
      sectionId: 'E',
      sectionTitle: 'Sample Collection & Consent',
      questionNumber: 16,
      title: 'Do you consent to genetic analysis of your hair/scalp sample?',
      subtitle: 'This is required to identify genetic pathways related to your hair loss pattern.',
      type: 'yesno',
      getValue: (ans) => ans.consent,
      setValue: (ans, val) => ({ ...ans, consent: val })
    });

    return list;
  }, [answers.biological_sex, answers.habits?.smoking, answers.habits?.salon_treatments, answers.products, answers.procedures, answers.past_treatment_side_effects]);

  // Clamp step index if out of bounds (due to dynamic list changing size)
  const clampedStepIndex = Math.min(currentStepIndex, Math.max(0, steps.length - 1));
  const activeStep = steps[clampedStepIndex];

  // Helper to update state for the current step
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateAnswer = (value: any) => {
    if (!activeStep) return;
    setAnswers(prev => {
      const nextAns = activeStep.setValue(prev, value);
      return nextAns;
    });
    // Remove autoFilled highlight for this key once the user interacts/sets it
    setAutoFilled(prev => {
      if (prev[activeStep.id]) {
        const nextMeta = { ...prev };
        delete nextMeta[activeStep.id];
        return nextMeta;
      }
      return prev;
    });
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setMode('review');
    }
  };

  const handleBack = () => {
    if (mode === 'results') {
      setMode('review');
    } else if (mode === 'review') {
      setMode('wizard');
      setCurrentStepIndex(steps.length - 1);
    } else if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const jumpToStep = (stepId: string) => {
    const idx = steps.findIndex(s => s.id === stepId);
    if (idx !== -1) {
      setCurrentStepIndex(idx);
      setMode('wizard');
    }
  };

  // Helper to confirm an auto-filled field
  const confirmAutoFill = (stepId: string) => {
    setAutoFilled(prev => {
      const nextMeta = { ...prev };
      delete nextMeta[stepId];
      return nextMeta;
    });
  };

  const resetForm = () => {
    setAnswers({});
    setAutoFilled({});
    setCurrentStepIndex(0);
    setMode('wizard');
    setLang('en');
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  // Check section completion
  const sectionStats = useMemo(() => {
    const totalBySec: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    const filledBySec: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };

    steps.forEach(s => {
      if (s.sectionId === 'special') return; // skip open mic and sex gate stats
      const key = s.sectionId;
      totalBySec[key] = (totalBySec[key] || 0) + 1;

      const val = s.getValue(answers);
      const isFilled = val !== undefined && val !== null && val !== '' && (Array.isArray(val) ? val.length > 0 : true);
      if (isFilled) {
        filledBySec[key] = (filledBySec[key] || 0) + 1;
      }
    });

    return {
      totalBySec,
      filledBySec
    };
  }, [steps, answers]);

  // 3. Continuous inference for obvious correlations (e.g. Fever + Shedding => Short Duration Suggestion)
  useEffect(() => {
    if (!isLoaded) return;
    const hasFever = answers.past_6_months?.includes('Fever with illness (COVID, Dengue, Typhoid)');
    const hasShedding = answers.pattern?.includes('Sudden excessive shedding');
    
    if (hasFever && hasShedding && !answers.duration) {
      setAnswers(prev => {
        if (!prev.duration) {
          return { ...prev, duration: 'Less than 6 months' };
        }
        return prev;
      });
      setAutoFilled(prev => {
        if (!prev.duration) {
          return { ...prev, duration: true };
        }
        return prev;
      });
    }
  }, [answers.past_6_months, answers.pattern, isLoaded]);

  return {
    isLoaded,
    answers,
    setAnswers,
    autoFilled,
    setAutoFilled,
    currentStepIndex: clampedStepIndex,
    setCurrentStepIndex,
    activeStep,
    steps,
    mode,
    setMode,
    lang,
    setLang,
    updateAnswer,
    handleNext,
    handleBack,
    jumpToStep,
    confirmAutoFill,
    resetForm,
    sectionStats
  };
}
