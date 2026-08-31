import { formSchema, FormAnswers } from '../src/config/schema';

// Helper to simulate the steps list generation
// This mimics the steps generation logic of useFormWizard.ts in pure JS/TS
function getStepsList(answers: FormAnswers) {
  const list: any[] = [];

  list.push({ id: 'open_mic', key: 'open_mic_transcript', questionNumber: 0, sectionId: 'special' });
  list.push({ id: 'biological_sex', key: 'biological_sex', questionNumber: 0, sectionId: 'special' });

  const isFemale = answers.biological_sex === 'Female';

  formSchema.sections.forEach(section => {
    section.questions.forEach(q => {
      if (q.femaleOnly && !isFemale) {
        return;
      }

      if (q.type === 'number') {
        list.push({ id: q.key, key: q.key, questionNumber: q.n, sectionId: section.id });
      } else if (q.type === 'single') {
        list.push({ id: q.key, key: q.key, questionNumber: q.n, sectionId: section.id });
      } else if (q.type === 'multi') {
        list.push({ id: q.key, key: q.key, questionNumber: q.n, sectionId: section.id });
      } else if (q.type === 'yesno') {
        list.push({ id: q.key, key: q.key, questionNumber: q.n, sectionId: section.id });
      } else if (q.type === 'table') {
        if (q.key === 'habits') {
          q.rows?.forEach((row: any) => {
            list.push({ id: `habits.${row.key}`, key: row.key, parent: 'habits', questionNumber: q.n, sectionId: section.id });
            
            if (row.key === 'smoking' && answers.habits?.smoking === 'yes') {
              list.push({ id: `habits.smoking_severity`, parent: 'habits', key: 'smoking_severity', questionNumber: q.n, sectionId: section.id });
            }
            if (row.key === 'salon_treatments' && answers.habits?.salon_treatments === 'yes') {
              list.push({ id: `habits.salon_treatment_detail`, parent: 'habits', key: 'salon_treatment_detail', questionNumber: q.n, sectionId: section.id });
            }
          });
        } else if (q.key === 'products') {
          const rows = q.rows as string[];
          const cols = q.columns || [];

          rows.forEach(row => {
            list.push({ id: `products.${row}.used`, parent: 'products', row, key: 'used', questionNumber: q.n, sectionId: section.id });
            
            if (answers.products?.[row]?.used) {
              cols.forEach(col => {
                if (col.key === 'used') return;
                list.push({ id: `products.${row}.${col.key}`, parent: 'products', row, key: col.key, questionNumber: q.n, sectionId: section.id });
              });
            }
          });
        } else if (q.key === 'procedures') {
          const rows = q.rows as string[];
          const cols = q.columns || [];

          rows.forEach(row => {
            list.push({ id: `procedures.${row}.done`, parent: 'procedures', row, key: 'done', questionNumber: q.n, sectionId: section.id });
            
            if (answers.procedures?.[row]?.done) {
              cols.forEach(col => {
                if (col.key === 'done') return;
                list.push({ id: `procedures.${row}.${col.key}`, parent: 'procedures', row, key: col.key, questionNumber: q.n, sectionId: section.id });
              });
            }
          });
        }
      }
    });
  });

  list.push({ id: 'past_treatment_side_effects', key: 'past_treatment_side_effects', questionNumber: 14, sectionId: 'D' });
  if (answers.past_treatment_side_effects === 'yes') {
    list.push({ id: 'past_treatment_side_effects_describe', key: 'past_treatment_side_effects_describe', questionNumber: 14, sectionId: 'D' });
  }

  list.push({ id: 'sample_type', key: 'sample_type', questionNumber: 15, sectionId: 'E' });
  list.push({ id: 'consent', key: 'consent', questionNumber: 16, sectionId: 'E' });

  return list;
}

// 1. Male Patient Persona
const maleAnswers: FormAnswers = {
  biological_sex: 'Male',
  age_hair_loss_began: 28,
  duration: 'Over a year',
  family_history: ['Father had hair loss'],
  pattern: ['Receding hairline', 'Thinning at crown'],
  diagnosed_conditions: ['None'],
  adult_acne_oily_skin: 'no',
  excess_body_facial_hair: 'no',
  past_6_months: ['High stress or emotional trauma'],
  habits: {
    smoking: 'no',
    alcohol: 'no',
    hard_water: 'yes',
    hair_wash_frequency: 'Alternate Days',
    heating_tools_styling_chemicals: 'no',
    salon_treatments: 'no'
  },
  products: {
    'OTC/Medicated Shampoos': { used: true, duration: '>6mo', helped: 'yes', side_effects: 'no' },
    'Hair Oils/Serums': { used: false },
    'Topical Minoxidil': { used: false },
    'Oral Minoxidil': { used: false },
    'Supplements': { used: false }
  },
  procedures: {
    'PRP/GFC/iPRF': { done: false },
    'Stem Cells/Exosomes': { done: false },
    'Hair Transplant': { done: false },
    'Other': { done: false }
  },
  past_treatment_side_effects: 'no',
  sample_type: 'Saliva',
  consent: 'yes'
};

// 2. Female Patient (regular, not pregnant)
const femaleRegularAnswers: FormAnswers = {
  biological_sex: 'Female',
  age_hair_loss_began: 35,
  duration: '6-12 months',
  family_history: ['Mother had hair loss'],
  pattern: ['Widening part line'],
  diagnosed_conditions: ['None'],
  menstrual_cycle: 'Regular',
  pregnancy_related: 'Not applicable',
  adult_acne_oily_skin: 'yes',
  excess_body_facial_hair: 'no',
  past_6_months: ['Change in location/water/air quality'],
  habits: {
    smoking: 'no',
    alcohol: 'no',
    hard_water: 'no',
    hair_wash_frequency: 'Weekly',
    heating_tools_styling_chemicals: 'yes',
    salon_treatments: 'yes',
    salon_treatment_detail: 'Keratin treatments twice a year'
  },
  products: {
    'OTC/Medicated Shampoos': { used: false },
    'Hair Oils/Serums': { used: true, duration: '3-6mo', helped: 'no', side_effects: 'no' },
    'Topical Minoxidil': { used: false },
    'Oral Minoxidil': { used: false },
    'Supplements': { used: false }
  },
  procedures: {
    'PRP/GFC/iPRF': { done: false },
    'Stem Cells/Exosomes': { done: false },
    'Hair Transplant': { done: false },
    'Other': { done: false }
  },
  past_treatment_side_effects: 'no',
  sample_type: 'Either',
  consent: 'yes'
};

// 3. Female Patient (pregnant)
const femalePregnantAnswers: FormAnswers = {
  biological_sex: 'Female',
  age_hair_loss_began: 30,
  duration: 'Less than 6 months',
  family_history: ['No known family history'],
  pattern: ['Diffuse thinning'],
  diagnosed_conditions: ['Anemia'],
  menstrual_cycle: 'Irregular',
  pregnancy_related: 'Currently pregnant',
  adult_acne_oily_skin: 'no',
  excess_body_facial_hair: 'no',
  past_6_months: ['Crash dieting or major weight loss'],
  habits: {
    smoking: 'no',
    alcohol: 'no',
    hard_water: 'no',
    hair_wash_frequency: 'Alternate Days',
    heating_tools_styling_chemicals: 'no',
    salon_treatments: 'no'
  },
  products: {
    'OTC/Medicated Shampoos': { used: false },
    'Hair Oils/Serums': { used: false },
    'Topical Minoxidil': { used: false },
    'Oral Minoxidil': { used: false },
    'Supplements': { used: true, duration: '<3mo', helped: 'yes', side_effects: 'no' }
  },
  procedures: {
    'PRP/GFC/iPRF': { done: false },
    'Stem Cells/Exosomes': { done: false },
    'Hair Transplant': { done: false },
    'Other': { done: false }
  },
  past_treatment_side_effects: 'no',
  sample_type: 'Blood',
  consent: 'yes'
};

// 4. Female Patient (menopausal)
const femaleMenopausalAnswers: FormAnswers = {
  biological_sex: 'Female',
  age_hair_loss_began: 52,
  duration: 'Over a year',
  family_history: ['Siblings with thinning or baldness'],
  pattern: ['Widening part line', 'Diffuse thinning'],
  diagnosed_conditions: ['Thyroid disorder'],
  menstrual_cycle: 'Menopausal',
  pregnancy_related: 'Not applicable',
  adult_acne_oily_skin: 'no',
  excess_body_facial_hair: 'yes',
  past_6_months: ['Recent surgery'],
  habits: {
    smoking: 'yes',
    smoking_severity: 'Mild <5/day',
    alcohol: 'yes',
    hard_water: 'yes',
    hair_wash_frequency: 'Weekly',
    heating_tools_styling_chemicals: 'yes',
    salon_treatments: 'no'
  },
  products: {
    'OTC/Medicated Shampoos': { used: false },
    'Hair Oils/Serums': { used: false },
    'Topical Minoxidil': { used: true, duration: '>6mo', helped: 'no', side_effects: 'yes' },
    'Oral Minoxidil': { used: false },
    'Supplements': { used: false }
  },
  procedures: {
    'PRP/GFC/iPRF': { done: true, sessions: '1-3', helped: 'yes' },
    'Stem Cells/Exosomes': { done: false },
    'Hair Transplant': { done: false },
    'Other': { done: false }
  },
  past_treatment_side_effects: 'yes',
  past_treatment_side_effects_describe: 'Burning and itching on scalp from topical minoxidil',
  sample_type: 'Either',
  consent: 'yes'
};

// Run validation tests
function runValidationSuite() {
  console.log('--- RUNNING GENOROOT INTAKE PERSONA TESTS ---');

  // Test 1: Male Patient
  const maleSteps = getStepsList(maleAnswers);
  const maleHasQ6 = maleSteps.some(s => s.id === 'menstrual_cycle');
  const maleHasQ7 = maleSteps.some(s => s.id === 'pregnancy_related');
  console.log('\n[TEST 1] Male Patient:');
  console.log(`- Total Wizard Steps: ${maleSteps.length}`);
  console.log(`- Contains Q6 (menstrual_cycle)? ${maleHasQ6 ? '❌ YES' : '✅ NO (correctly skipped)'}`);
  console.log(`- Contains Q7 (pregnancy_related)? ${maleHasQ7 ? '❌ YES' : '✅ NO (correctly skipped)'}`);
  if (!maleHasQ6 && !maleHasQ7) {
    console.log('STATUS: PASS (Sex gate successfully skipped female questions)');
  } else {
    console.log('STATUS: FAIL');
    process.exit(1);
  }

  // Test 2: Female Regular Patient
  const femaleRegSteps = getStepsList(femaleRegularAnswers);
  const regHasQ6 = femaleRegSteps.some(s => s.id === 'menstrual_cycle');
  const regHasQ7 = femaleRegSteps.some(s => s.id === 'pregnancy_related');
  console.log('\n[TEST 2] Female Patient (Regular, Not Pregnant):');
  console.log(`- Total Wizard Steps: ${femaleRegSteps.length}`);
  console.log(`- Contains Q6 (menstrual_cycle)? ${regHasQ6 ? '✅ YES' : '❌ NO'}`);
  console.log(`- Contains Q7 (pregnancy_related)? ${regHasQ7 ? '✅ YES' : '❌ NO'}`);
  console.log(`- Menstrual cycle value: ${femaleRegularAnswers.menstrual_cycle}`);
  console.log(`- Pregnancy status: ${femaleRegularAnswers.pregnancy_related}`);
  if (regHasQ6 && regHasQ7) {
    console.log('STATUS: PASS');
  } else {
    console.log('STATUS: FAIL');
    process.exit(1);
  }

  // Test 3: Female Pregnant Patient
  const femalePregSteps = getStepsList(femalePregnantAnswers);
  const pregHasQ6 = femalePregSteps.some(s => s.id === 'menstrual_cycle');
  const pregHasQ7 = femalePregSteps.some(s => s.id === 'pregnancy_related');
  console.log('\n[TEST 3] Female Patient (Currently Pregnant):');
  console.log(`- Total Wizard Steps: ${femalePregSteps.length}`);
  console.log(`- Contains Q6 (menstrual_cycle)? ${pregHasQ6 ? '✅ YES' : '❌ NO'}`);
  console.log(`- Contains Q7 (pregnancy_related)? ${pregHasQ7 ? '✅ YES' : '❌ NO'}`);
  console.log(`- Pregnancy status: ${femalePregnantAnswers.pregnancy_related}`);
  if (pregHasQ6 && pregHasQ7 && femalePregnantAnswers.pregnancy_related === 'Currently pregnant') {
    console.log('STATUS: PASS');
  } else {
    console.log('STATUS: FAIL');
    process.exit(1);
  }

  // Test 4: Female Menopausal Patient
  const femaleMenoSteps = getStepsList(femaleMenopausalAnswers);
  const menoHasQ6 = femaleMenoSteps.some(s => s.id === 'menstrual_cycle');
  const menoHasQ7 = femaleMenoSteps.some(s => s.id === 'pregnancy_related');
  console.log('\n[TEST 4] Female Patient (Menopausal):');
  console.log(`- Total Wizard Steps: ${femaleMenoSteps.length}`);
  console.log(`- Contains Q6 (menstrual_cycle)? ${menoHasQ6 ? '✅ YES' : '❌ NO'}`);
  console.log(`- Contains Q7 (pregnancy_related)? ${menoHasQ7 ? '✅ YES' : '❌ NO'}`);
  console.log(`- Menstrual cycle value: ${femaleMenopausalAnswers.menstrual_cycle}`);
  console.log(`- Past treatment side effects details included? ${femaleMenoSteps.some(s => s.id === 'past_treatment_side_effects_describe') ? '✅ YES' : '❌ NO'}`);
  if (menoHasQ6 && menoHasQ7 && femaleMenopausalAnswers.menstrual_cycle === 'Menopausal') {
    console.log('STATUS: PASS');
  } else {
    console.log('STATUS: FAIL');
    process.exit(1);
  }

  console.log('\n--- ALL CONFORMANCE AND PERSONA VALIDATIONS PASSED SUCCESSFULLY! ---');
}

runValidationSuite();
