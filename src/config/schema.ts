export interface QuestionConfig {
  n: number;
  key: string;
  type: 'number' | 'single' | 'multi' | 'yesno' | 'text' | 'table';
  options?: string[];
  femaleOnly?: boolean;
  rows?: TableRowConfig[] | string[];
  columns?: TableColumnConfig[];
  followup?: {
    key: string;
    type: 'single' | 'text';
    options?: string[];
  };
}

export interface TableRowConfig {
  key: string;
  type: 'yesno' | 'single';
  options?: string[];
  followup?: {
    key: string;
    type: 'single' | 'text';
    options?: string[];
  };
}

export interface TableColumnConfig {
  key: string;
  type: 'bool' | 'single' | 'yesno';
  options?: string[];
}

export interface SectionConfig {
  id: string;
  title: string;
  questions: QuestionConfig[];
}

export interface FormConfig {
  form: string;
  sections: SectionConfig[];
}

export const formSchema: FormConfig = {
  form: "Hair Vitals Hair & Scalp Intake",
  sections: [
    { id: "A", title: "Personal & Family Hair Loss History", questions: [
      { n: 1, key: "age_hair_loss_began", type: "number" },
      { n: 2, key: "duration", type: "single", options: ["Less than 6 months", "6-12 months", "Over a year"] },
      { n: 3, key: "family_history", type: "multi", options: ["Father had hair loss", "Mother had hair loss", "Siblings with thinning or baldness", "No known family history"] },
      { n: 4, key: "pattern", type: "multi", options: ["Receding hairline", "Thinning at crown", "Widening part line", "Diffuse thinning", "Patchy loss", "Sudden excessive shedding"] }
    ]},
    { id: "B", title: "Hormonal & Health Influences", questions: [
      { n: 5, key: "diagnosed_conditions", type: "multi", options: ["PCOS/PCOD", "Thyroid disorder", "Diabetes", "Autoimmune disease", "Anemia", "None"] },
      { n: 6, key: "menstrual_cycle", type: "single", options: ["Regular", "Irregular", "Menopausal", "Not applicable"], femaleOnly: true },
      { n: 7, key: "pregnancy_related", type: "single", options: ["Currently pregnant", "Postpartum <1 year", "Not applicable"], femaleOnly: true },
      { n: 8, key: "adult_acne_oily_skin", type: "yesno" },
      { n: 9, key: "excess_body_facial_hair", type: "yesno" }
    ]},
    { id: "C", title: "Lifestyle & Environmental Triggers", questions: [
      { n: 10, key: "past_6_months", type: "multi", options: ["Crash dieting or major weight loss", "High stress or emotional trauma", "Fever with illness (COVID, Dengue, Typhoid)", "Recent surgery", "Change in location/water/air quality"] },
      { n: 11, key: "habits", type: "table", rows: [
        { key: "smoking", type: "yesno", followup: { key: "smoking_severity", type: "single", options: ["Mild <5/day", "Moderate 5-10/day", "Severe >10/day"] } },
        { key: "alcohol", type: "yesno" },
        { key: "hard_water", type: "yesno" },
        { key: "hair_wash_frequency", type: "single", options: ["Daily", "Alternate Days", "Weekly"] },
        { key: "heating_tools_styling_chemicals", type: "yesno" },
        { key: "salon_treatments", type: "yesno", followup: { key: "salon_treatment_detail", type: "text" } }
      ]}
    ]},
    { id: "D", title: "Current Hair Care & Treatments", questions: [
      { n: 12, key: "products", type: "table", rows: ["OTC/Medicated Shampoos", "Hair Oils/Serums", "Topical Minoxidil", "Oral Minoxidil", "Supplements"], columns: [
        { key: "used", type: "bool" }, { key: "duration", type: "single", options: ["<3mo", "3-6mo", ">6mo"] }, { key: "helped", type: "yesno" }, { key: "side_effects", type: "yesno" }
      ]},
      { n: 13, key: "procedures", type: "table", rows: ["PRP/GFC/iPRF", "Stem Cells/Exosomes", "Hair Transplant", "Other"], columns: [
        { key: "done", type: "bool" }, { key: "sessions", type: "single", options: ["1-3", "4-6", ">6"] }, { key: "helped", type: "yesno" }
      ]},
      { n: 14, key: "past_treatment_side_effects", type: "yesno", followup: { key: "describe", type: "text" } }
    ]},
    { id: "E", title: "Sample Collection & Consent", questions: [
      { n: 15, key: "sample_type", type: "single", options: ["Saliva", "Blood", "Either"] },
      { n: 16, key: "consent", type: "yesno" }
    ]}
  ]
};

// Form state types
export interface FormAnswers {
  // Metadata fields
  biological_sex?: 'Male' | 'Female' | 'Prefer not to say';
  open_mic_transcript?: string;

  // Question answers
  age_hair_loss_began?: number;
  duration?: 'Less than 6 months' | '6-12 months' | 'Over a year';
  family_history?: string[];
  pattern?: string[];
  diagnosed_conditions?: string[];
  menstrual_cycle?: 'Regular' | 'Irregular' | 'Menopausal' | 'Not applicable';
  pregnancy_related?: 'Currently pregnant' | 'Postpartum <1 year' | 'Not applicable';
  adult_acne_oily_skin?: 'yes' | 'no';
  excess_body_facial_hair?: 'yes' | 'no';
  past_6_months?: string[];

  // habits: Row keys to their values (including severity followups)
  habits?: {
    smoking?: 'yes' | 'no';
    smoking_severity?: 'Mild <5/day' | 'Moderate 5-10/day' | 'Severe >10/day';
    alcohol?: 'yes' | 'no';
    hard_water?: 'yes' | 'no';
    hair_wash_frequency?: 'Daily' | 'Alternate Days' | 'Weekly';
    heating_tools_styling_chemicals?: 'yes' | 'no';
    salon_treatments?: 'yes' | 'no';
    salon_treatment_detail?: string;
  };

  // products: Row names to their column values
  products?: {
    [row: string]: {
      used?: boolean;
      duration?: '<3mo' | '3-6mo' | '>6mo';
      helped?: 'yes' | 'no';
      side_effects?: 'yes' | 'no';
    };
  };

  // procedures: Row names to their column values
  procedures?: {
    [row: string]: {
      done?: boolean;
      sessions?: '1-3' | '4-6' | '>6';
      helped?: 'yes' | 'no';
    };
  };

  past_treatment_side_effects?: 'yes' | 'no';
  past_treatment_side_effects_describe?: string; // followup for Q14
  
  sample_type?: 'Saliva' | 'Blood' | 'Either';
  consent?: 'yes' | 'no';
}

// Track autofilled fields to show highlight state and "auto-filled — tap to confirm"
export interface AutoFillMetadata {
  [key: string]: boolean; // key path -> true if auto-filled and unconfirmed
}
