export interface LanguageTranslation {
  title: string;
  subtitle?: string;
  options?: Record<string, string>;
}

export interface TranslationSet {
  sections: Record<string, string>;
  questions: Record<string, LanguageTranslation>;
  chrome: Record<string, string>;
}

export const translations: Record<'en' | 'hi', TranslationSet> = {
  en: {
    sections: {
      A: 'Personal & Family Hair Loss History',
      B: 'Hormonal & Health Influences',
      C: 'Lifestyle & Environmental Triggers',
      D: 'Current Hair Care & Treatments',
      E: 'Sample Collection & Consent',
      special: 'Introduction'
    },
    questions: {
      open_mic: {
        title: 'Tell us about your hair journey',
        subtitle: 'Share in your own words — how it started, what you’ve tried, or how it affects you. You can speak or type. (Optional)'
      },
      biological_sex: {
        title: 'What is your biological sex?',
        subtitle: 'We ask this so we only show questions relevant to your body.',
        options: {
          'Male': 'Male',
          'Female': 'Female',
          'Prefer not to say': 'Prefer not to say'
        }
      },
      age_hair_loss_began: {
        title: 'At what age did your hair loss begin?',
        subtitle: 'Enter your approximate age in years.'
      },
      duration: {
        title: 'How long have you been experiencing hair loss?',
        subtitle: 'Select the option that best describes your duration.',
        options: {
          'Less than 6 months': 'Less than 6 months',
          '6-12 months': '6-12 months',
          'Over a year': 'Over a year'
        }
      },
      family_history: {
        title: 'Is there a family history of hair loss?',
        subtitle: 'Select all that apply. This helps identify genetic patterns.',
        options: {
          'Father had hair loss': 'Father had hair loss',
          'Mother had hair loss': 'Mother had hair loss',
          'Siblings with thinning or baldness': 'Siblings with thinning or baldness',
          'No known family history': 'No known family history'
        }
      },
      pattern: {
        title: 'Where are you noticing the hair loss or thinning?',
        subtitle: 'Select all areas and patterns that match your experience.',
        options: {
          'Receding hairline': 'Receding hairline',
          'Thinning at crown': 'Thinning at crown',
          'Widening part line': 'Widening part line',
          'Diffuse thinning': 'Diffuse thinning',
          'Patchy loss': 'Patchy loss',
          'Sudden excessive shedding': 'Sudden excessive shedding'
        }
      },
      diagnosed_conditions: {
        title: 'Have you been diagnosed with any of these conditions?',
        subtitle: 'Select all that apply. Hormones and health conditions play a big role.',
        options: {
          'PCOS/PCOD': 'PCOS/PCOD',
          'Thyroid disorder': 'Thyroid disorder',
          'Diabetes': 'Diabetes',
          'Autoimmune disease': 'Autoimmune disease',
          'Anemia': 'Anemia',
          'None': 'None'
        }
      },
      menstrual_cycle: {
        title: 'How would you describe your menstrual cycle?',
        subtitle: 'This helps us understand potential hormonal influences.',
        options: {
          'Regular': 'Regular',
          'Irregular': 'Irregular',
          'Menopausal': 'Menopausal',
          'Not applicable': 'Not applicable'
        }
      },
      pregnancy_related: {
        title: 'Are you currently pregnant or postpartum?',
        subtitle: 'Pregnancy and childbirth can significantly affect hair shedding cycles.',
        options: {
          'Currently pregnant': 'Currently pregnant',
          'Postpartum <1 year': 'Postpartum <1 year',
          'Not applicable': 'Not applicable'
        }
      },
      adult_acne_oily_skin: {
        title: 'Do you experience adult acne or excessively oily skin?',
        subtitle: 'This can indicate elevated androgenic (hormonal) activity.'
      },
      excess_body_facial_hair: {
        title: 'Do you have excess body or facial hair?',
        subtitle: 'This is another sign of hormonal balance levels that we check.'
      },
      past_6_months: {
        title: 'Have you experienced any of these in the past 6 months?',
        subtitle: 'Physical or emotional stressors can trigger hair shedding weeks or months later.',
        options: {
          'Crash dieting or major weight loss': 'Crash dieting or major weight loss',
          'High stress or emotional trauma': 'High stress or emotional trauma',
          'Fever with illness (COVID, Dengue, Typhoid)': 'Fever with illness (COVID, Dengue, Typhoid)',
          'Recent surgery': 'Recent surgery',
          'Change in location/water/air quality': 'Change in location/water/air quality'
        }
      },
      'habits.smoking': {
        title: 'Do you smoke cigarettes?',
        subtitle: 'Smoking affects scalp micro-circulation.'
      },
      'habits.smoking_severity': {
        title: 'How much do you smoke daily?',
        subtitle: 'Select your smoking severity category.',
        options: {
          'Mild <5/day': 'Mild <5/day',
          'Moderate 5-10/day': 'Moderate 5-10/day',
          'Severe >10/day': 'Severe >10/day'
        }
      },
      'habits.alcohol': {
        title: 'Do you consume alcohol regularly?',
        subtitle: 'Regular alcohol intake can affect nutrient absorption.'
      },
      'habits.hard_water': {
        title: 'Is your household tap water hard water?',
        subtitle: 'Hard water mineral deposits can cause hair breakage and scalp dryness.'
      },
      'habits.hair_wash_frequency': {
        title: 'How often do you wash your hair?',
        subtitle: 'Washing frequency influences sebum buildup and scalp health.',
        options: {
          'Daily': 'Daily',
          'Alternate Days': 'Alternate Days',
          'Weekly': 'Weekly'
        }
      },
      'habits.heating_tools_styling_chemicals': {
        title: 'Do you use heat styling tools or chemical treatments?',
        subtitle: 'E.g. blow dryers, straighteners, dyes, perms, relaxers.'
      },
      'habits.salon_treatments': {
        title: 'Do you receive salon hair treatments?',
        subtitle: 'E.g. hair spa, keratin treatments, deep conditioning.'
      },
      'habits.salon_treatment_detail': {
        title: 'Tell us about your salon treatments',
        subtitle: 'What treatments do you get and how often? Speak or type.'
      },
      'products.OTC/Medicated Shampoos.used': { title: 'Have you used OTC/Medicated Shampoos?' },
      'products.OTC/Medicated Shampoos.duration': {
        title: 'How long did you use OTC/Medicated Shampoos?',
        options: { '<3mo': '<3mo', '3-6mo': '3-6mo', '>6mo': '>6mo' }
      },
      'products.OTC/Medicated Shampoos.helped': { title: 'Did OTC/Medicated Shampoos help with your hair loss?' },
      'products.OTC/Medicated Shampoos.side_effects': { title: 'Did you experience side effects from OTC/Medicated Shampoos?' },

      'products.Hair Oils/Serums.used': { title: 'Have you used Hair Oils/Serums?' },
      'products.Hair Oils/Serums.duration': {
        title: 'How long did you use Hair Oils/Serums?',
        options: { '<3mo': '<3mo', '3-6mo': '3-6mo', '>6mo': '>6mo' }
      },
      'products.Hair Oils/Serums.helped': { title: 'Did Hair Oils/Serums help with your hair loss?' },
      'products.Hair Oils/Serums.side_effects': { title: 'Did you experience side effects from Hair Oils/Serums?' },

      'products.Topical Minoxidil.used': { title: 'Have you used Topical Minoxidil?' },
      'products.Topical Minoxidil.duration': {
        title: 'How long did you use Topical Minoxidil?',
        options: { '<3mo': '<3mo', '3-6mo': '3-6mo', '>6mo': '>6mo' }
      },
      'products.Topical Minoxidil.helped': { title: 'Did Topical Minoxidil help with your hair loss?' },
      'products.Topical Minoxidil.side_effects': { title: 'Did you experience side effects from Topical Minoxidil?' },

      'products.Oral Minoxidil.used': { title: 'Have you used Oral Minoxidil?' },
      'products.Oral Minoxidil.duration': {
        title: 'How long did you use Oral Minoxidil?',
        options: { '<3mo': '<3mo', '3-6mo': '3-6mo', '>6mo': '>6mo' }
      },
      'products.Oral Minoxidil.helped': { title: 'Did Oral Minoxidil help with your hair loss?' },
      'products.Oral Minoxidil.side_effects': { title: 'Did you experience side effects from Oral Minoxidil?' },

      'products.Supplements.used': { title: 'Have you used Supplements?' },
      'products.Supplements.duration': {
        title: 'How long did you use Supplements?',
        options: { '<3mo': '<3mo', '3-6mo': '3-6mo', '>6mo': '>6mo' }
      },
      'products.Supplements.helped': { title: 'Did Supplements help with your hair loss?' },
      'products.Supplements.side_effects': { title: 'Did you experience side effects from Supplements?' },

      'procedures.PRP/GFC/iPRF.done': { title: 'Have you ever done a PRP/GFC/iPRF procedure?' },
      'procedures.PRP/GFC/iPRF.sessions': {
        title: 'How many sessions of PRP/GFC/iPRF did you have?',
        options: { '1-3': '1-3', '4-6': '4-6', '>6': '>6' }
      },
      'procedures.PRP/GFC/iPRF.helped': { title: 'Did the PRP/GFC/iPRF procedure help?' },

      'procedures.Stem Cells/Exosomes.done': { title: 'Have you ever done a Stem Cells/Exosomes procedure?' },
      'procedures.Stem Cells/Exosomes.sessions': {
        title: 'How many sessions of Stem Cells/Exosomes did you have?',
        options: { '1-3': '1-3', '4-6': '4-6', '>6': '>6' }
      },
      'procedures.Stem Cells/Exosomes.helped': { title: 'Did the Stem Cells/Exosomes procedure help?' },

      'procedures.Hair Transplant.done': { title: 'Have you ever done a Hair Transplant procedure?' },
      'procedures.Hair Transplant.sessions': {
        title: 'How many sessions of Hair Transplant did you have?',
        options: { '1-3': '1-3', '4-6': '4-6', '>6': '>6' }
      },
      'procedures.Hair Transplant.helped': { title: 'Did the Hair Transplant procedure help?' },

      'procedures.Other.done': { title: 'Have you ever done other procedures?' },
      'procedures.Other.sessions': {
        title: 'How many sessions of other procedures did you have?',
        options: { '1-3': '1-3', '4-6': '4-6', '>6': '>6' }
      },
      'procedures.Other.helped': { title: 'Did other procedures help?' },

      past_treatment_side_effects: {
        title: 'Have you had side effects from any past hair treatments?',
        subtitle: 'This includes any products, shampoos, pills, or clinical procedures.'
      },
      past_treatment_side_effects_describe: {
        title: 'Please describe the side effects',
        subtitle: 'Tell us which treatments caused it and what occurred. Speak or type.'
      },
      sample_type: {
        title: 'Which DNA sample type do you prefer?',
        subtitle: 'Saliva collection is a simple cheek swab. Blood sample requires a quick visit.',
        options: {
          'Saliva': 'Saliva',
          'Blood': 'Blood',
          'Either': 'Either'
        }
      },
      consent: {
        title: 'Do you consent to genetic analysis of your hair/scalp sample?',
        subtitle: 'This is required to identify genetic pathways related to your hair loss pattern.'
      }
    },
    chrome: {
      next: 'Next Step',
      back: 'Back',
      skip: 'Skip & fill manually',
      auto_advance: 'Selection will auto-advance',
      confirm_autofill: 'Confirm answer',
      autofilled_msg: 'Auto-filled from your description',
      review_title: 'Review Your Intake Answers',
      review_desc: 'Please verify your information before submitting. Tap any edit button to make corrections.',
      submit: 'Submit Medical Intake',
      submitting: 'Analyzing & generating file...',
      results_title: 'Form Submitted!',
      results_desc: 'Your hair and scalp analysis report has been generated successfully.',
      reset: 'Start New Assessment',
      sensitive_reassurance: '🔒 This helps your doctor personalize care — answer only what you\'re comfortable sharing.',
      clinical_summary: 'Clinical Summary',
      doctors_review: "Doctor's Review",
      copy_json: 'Copy JSON',
      copied: 'Copied!',
      record_checklist: 'Medical Record Checklist',
      sex: 'Sex',
      overall_progress: 'Overall Progress',
      trichology_file: 'Trichology File',
      geno_intake_rec: 'Hair Vitals Intake Record',
      open_mic_tag: 'Intelligent Self-Filling',
      analyze_desc: 'Analyze Description',
      analyzing: 'Reading your story...',
      confirm_and_next: 'Confirm & Next',
      years_old: 'years old',
      or_type_age: 'Or type age:',
      not_answered: 'Not answered',
      none_selected: 'None selected'
    }
  },
  hi: {
    sections: {
      A: 'व्यक्तिगत और पारिवारिक बाल झड़ने का इतिहास',
      B: 'हार्मोनल और स्वास्थ्य प्रभाव',
      C: 'जीवनशैली और पर्यावरणीय कारक',
      D: 'वर्तमान बालों की देखभाल और उपचार',
      E: 'नमूना संग्रह और सहमति',
      special: 'परिचय'
    },
    questions: {
      open_mic: {
        title: 'हमें अपनी बालों के सफ़र के बारे में बताएं',
        subtitle: 'अपने शब्दों में साझा करें — यह कैसे शुरू हुआ, आपने क्या प्रयास किया, या यह आपको कैसे प्रभावित करता है। आप बोल सकते हैं या टाइप कर सकते हैं। (वैकल्पिक)'
      },
      biological_sex: {
        title: 'आपका जैविक लिंग क्या है?',
        subtitle: 'हम यह इसलिए पूछते हैं ताकि हम केवल आपके शरीर से संबंधित प्रश्न ही दिखाएं।',
        options: {
          'Male': 'पुरुष (Male)',
          'Female': 'महिला (Female)',
          'Prefer not to say': 'बताना नहीं चाहते'
        }
      },
      age_hair_loss_began: {
        title: 'आपके बाल झड़ना किस उम्र में शुरू हुए थे?',
        subtitle: 'अपनी अनुमानित उम्र वर्षों में दर्ज करें।'
      },
      duration: {
        title: 'आप कब से बाल झड़ने का अनुभव कर रहे हैं?',
        subtitle: 'वह विकल्प चुनें जो आपकी अवधि का सबसे अच्छा वर्णन करता है।',
        options: {
          'Less than 6 months': '6 महीने से कम',
          '6-12 months': '6-12 महीने',
          'Over a year': 'एक साल से अधिक'
        }
      },
      family_history: {
        title: 'क्या परिवार में बाल झड़ने का इतिहास है?',
        subtitle: 'लागू होने वाले सभी विकल्प चुनें। इससे आनुवंशिक पैटर्न की पहचान करने में मदद मिलती है।',
        options: {
          'Father had hair loss': 'पिता के बाल झड़ते थे',
          'Mother had hair loss': 'माता के बाल झड़ते थे',
          'Siblings with thinning or baldness': 'भाई-बहनों में बाल पतले होना या गंजापन',
          'No known family history': 'कोई ज्ञात पारिवारिक इतिहास नहीं'
        }
      },
      pattern: {
        title: 'आप बाल झड़ने या पतले होने की समस्या कहाँ देख रहे हैं?',
        subtitle: 'उन सभी क्षेत्रों और पैटर्न को चुनें जो आपके अनुभव से मेल खाते हैं।',
        options: {
          'Receding hairline': 'पीछे हटती हुई हेयरलाइन',
          'Thinning at crown': 'सिर के ऊपरी हिस्से (क्राउन) पर पतले बाल',
          'Widening part line': 'मांग का चौड़ा होना',
          'Diffuse thinning': 'पूरे सिर में बालों का पतला होना',
          'Patchy loss': 'जगह-जगह से गोल पैच में बाल गिरना',
          'Sudden excessive shedding': 'अचानक अत्यधिक मात्रा में बाल झड़ना'
        }
      },
      diagnosed_conditions: {
        title: 'क्या आपको इनमें से किसी बीमारी का निदान हुआ है?',
        subtitle: 'लागू होने वाले सभी विकल्प चुनें। हार्मोन और स्वास्थ्य स्थितियां बड़ी भूमिका निभाती हैं।',
        options: {
          'PCOS/PCOD': 'पीसीओएस / पीसीओडी (PCOS/PCOD)',
          'Thyroid disorder': 'थायराइड विकार (Thyroid)',
          'Diabetes': 'मधुमेह (Diabetes)',
          'Autoimmune disease': 'ऑटोइम्यून बीमारी',
          'Anemia': 'एनीमिया (खून की कमी)',
          'None': 'कोई नहीं'
        }
      },
      menstrual_cycle: {
        title: 'आप अपने मासिक धर्म चक्र का वर्णन कैसे करेंगी?',
        subtitle: 'इससे हमें संभावित हार्मोनल प्रभावों को समझने में मदद मिलती है।',
        options: {
          'Regular': 'नियमित (Regular)',
          'Irregular': 'अनियमित (Irregular)',
          'Menopausal': 'रजोनिवृत्ति (Menopausal)',
          'Not applicable': 'लागू नहीं होता'
        }
      },
      pregnancy_related: {
        title: 'क्या आप वर्तमान में गर्भवती हैं या प्रसवोत्तर (postpartum) हैं?',
        subtitle: 'गर्भावस्था और प्रसव बालों के झड़ने के चक्र को महत्वपूर्ण रूप से प्रभावित कर सकते हैं।',
        options: {
          'Currently pregnant': 'वर्तमान में गर्भवती',
          'Postpartum <1 year': 'प्रसवोत्तर < 1 वर्ष (Postpartum)',
          'Not applicable': 'लागू नहीं होता'
        }
      },
      adult_acne_oily_skin: {
        title: 'क्या आप वयस्कों वाले मुंहासे या अत्यधिक तैलीय त्वचा का अनुभव करते हैं?',
        subtitle: 'यह बढ़े हुए एण्ड्रोजन (हार्मोनल) गतिविधि का संकेत हो सकता है।'
      },
      excess_body_facial_hair: {
        title: 'क्या आपके शरीर या चेहरे पर अत्यधिक बाल हैं?',
        subtitle: 'यह हार्मोनल संतुलन स्तर का एक और संकेत है जिसकी हम जांच करते हैं।'
      },
      past_6_months: {
        title: 'क्या आपने पिछले 6 महीनों में इनमें से किसी का अनुभव किया है?',
        subtitle: 'शारीरिक या भावनात्मक तनाव हफ़्तों या महीनों बाद बाल झड़ने का कारण बन सकते हैं।',
        options: {
          'Crash dieting or major weight loss': 'क्रैश डाइटिंग या भारी वजन बढ़ना',
          'High stress or emotional trauma': 'अत्यधिक तनाव या भावनात्मक आघात',
          'Fever with illness (COVID, Dengue, Typhoid)': 'बीमारी के साथ बुखार (कोविड, डेंगू, टाइफाइड)',
          'Recent surgery': 'हाल ही में सर्जरी',
          'Change in location/water/air quality': 'स्थान/पानी/हवा की गुणवत्ता में बदलाव'
        }
      },
      'habits.smoking': {
        title: 'क्या आप धूम्रपान करते हैं?',
        subtitle: 'धूम्रपान स्कैल्प के सूक्ष्म रक्त परिसंचरण को प्रभावित करता है।'
      },
      'habits.smoking_severity': {
        title: 'आप प्रतिदिन कितना धूम्रपान करते हैं?',
        subtitle: 'अपनी धूम्रपान गंभीरता श्रेणी चुनें।',
        options: {
          'Mild <5/day': 'हल्का (दिन में 5 से कम)',
          'Moderate 5-10/day': 'मध्यम (दिन में 5-10)',
          'Severe >10/day': 'गंभीर (दिन में 10 से अधिक)'
        }
      },
      'habits.alcohol': {
        title: 'क्या आप नियमित रूप से शराब का सेवन करते हैं?',
        subtitle: 'नियमित शराब का सेवन पोषक तत्वों के अवशोषण को प्रभावित कर सकता है।'
      },
      'habits.hard_water': {
        title: 'क्या आपके घर का नल का पानी खारा पानी (Hard Water) है?',
        subtitle: 'खारे पानी के खनिज जमाव से बाल टूट सकते हैं और स्कैल्प रूखा हो सकता है।'
      },
      'habits.hair_wash_frequency': {
        title: 'आप अपने बाल कितनी बार धोते हैं?',
        subtitle: 'बाल धोने की आवृत्ति सीबम बनने और स्कैल्प के स्वास्थ्य को प्रभावित करती है।',
        options: {
          'Daily': 'रोजाना',
          'Alternate Days': 'एक दिन छोड़कर',
          'Weekly': 'साप्ताहिक'
        }
      },
      'habits.heating_tools_styling_chemicals': {
        title: 'क्या आप हीट स्टाइलिंग टूल्स या रासायनिक उपचारों का उपयोग करते हैं?',
        subtitle: 'जैसे ब्लो ड्रायर, स्ट्रेटनर, कलर, पर्म, रिलैक्सर।'
      },
      'habits.salon_treatments': {
        title: 'क्या आप सैलून में बालों का उपचार कराते हैं?',
        subtitle: 'जैसे हेयर स्पा, केराटिन ट्रीटमेंट, डीप कन्डिशनिंग।'
      },
      'habits.salon_treatment_detail': {
        title: 'हमें अपने सैलून उपचारों के बारे में बताएं',
        subtitle: 'आप कौन से उपचार प्राप्त करते हैं और कितनी बार? बोलें या टाइप करें।'
      },
      'products.OTC/Medicated Shampoos.used': { title: 'क्या आपने OTC/Medicated Shampoos का उपयोग किया है?' },
      'products.OTC/Medicated Shampoos.duration': {
        title: 'आपने कितने समय तक OTC/Medicated Shampoos का उपयोग किया?',
        options: { '<3mo': '3 महीने से कम', '3-6mo': '3-6 महीने', '>6mo': '6 महीने से अधिक' }
      },
      'products.OTC/Medicated Shampoos.helped': { title: 'क्या OTC/Medicated Shampoos ने आपकी बाल झड़ने की समस्या में मदद की?' },
      'products.OTC/Medicated Shampoos.side_effects': { title: 'क्या आपको OTC/Medicated Shampoos से कोई दुष्प्रभाव महसूस हुआ?' },

      'products.Hair Oils/Serums.used': { title: 'क्या आपने Hair Oils/Serums का उपयोग किया है?' },
      'products.Hair Oils/Serums.duration': {
        title: 'आपने कितने समय तक Hair Oils/Serums का उपयोग किया?',
        options: { '<3mo': '3 महीने से कम', '3-6mo': '3-6 महीने', '>6mo': '6 महीने से अधिक' }
      },
      'products.Hair Oils/Serums.helped': { title: 'क्या Hair Oils/Serums ने आपकी बाल झड़ने की समस्या में मदद की?' },
      'products.Hair Oils/Serums.side_effects': { title: 'क्या आपको Hair Oils/Serums से कोई दुष्प्रभाव महसूस हुआ?' },

      'products.Topical Minoxidil.used': { title: 'क्या आपने Topical Minoxidil का उपयोग किया है?' },
      'products.Topical Minoxidil.duration': {
        title: 'आपने कितने समय तक Topical Minoxidil का उपयोग किया?',
        options: { '<3mo': '3 महीने से कम', '3-6mo': '3-6 महीने', '>6mo': '6 महीने से अधिक' }
      },
      'products.Topical Minoxidil.helped': { title: 'क्या Topical Minoxidil ने आपकी बाल झड़ने की समस्या में मदद की?' },
      'products.Topical Minoxidil.side_effects': { title: 'क्या आपको Topical Minoxidil से कोई दुष्प्रभाव महसूस हुआ?' },

      'products.Oral Minoxidil.used': { title: 'क्या आपने Oral Minoxidil का उपयोग किया है?' },
      'products.Oral Minoxidil.duration': {
        title: 'आपने कितने समय तक Oral Minoxidil का उपयोग किया?',
        options: { '<3mo': '3 महीने से कम', '3-6mo': '3-6 महीने', '>6mo': '6 महीने से अधिक' }
      },
      'products.Oral Minoxidil.helped': { title: 'क्या Oral Minoxidil ने आपकी बाल झड़ने की समस्या में मदद की?' },
      'products.Oral Minoxidil.side_effects': { title: 'क्या आपको Oral Minoxidil से कोई दुष्प्रभाव महसूस हुआ?' },

      'products.Supplements.used': { title: 'क्या आपने Supplements का उपयोग किया है?' },
      'products.Supplements.duration': {
        title: 'आपने कितने समय तक Supplements का उपयोग किया?',
        options: { '<3mo': '3 महीने से कम', '3-6mo': '3-6 महीने', '>6mo': '6 महीने से अधिक' }
      },
      'products.Supplements.helped': { title: 'क्या Supplements ने आपकी बाल झड़ने की समस्या में मदद की?' },
      'products.Supplements.side_effects': { title: 'क्या आपको Supplements से कोई दुष्प्रभाव महसूस हुआ?' },

      'procedures.PRP/GFC/iPRF.done': { title: 'क्या आपने कभी PRP/GFC/iPRF प्रक्रिया कराई है?' },
      'procedures.PRP/GFC/iPRF.sessions': {
        title: 'आपने PRP/GFC/iPRF के कितने सत्र (sessions) लिए?',
        options: { '1-3': '1-3 सत्र', '4-6': '4-6 सत्र', '>6': '6 से अधिक सत्र' }
      },
      'procedures.PRP/GFC/iPRF.helped': { title: 'क्या PRP/GFC/iPRF प्रक्रिया से मदद मिली?' },

      'procedures.Stem Cells/Exosomes.done': { title: 'क्या आपने कभी Stem Cells/Exosomes प्रक्रिया कराई है?' },
      'procedures.Stem Cells/Exosomes.sessions': {
        title: 'आपने Stem Cells/Exosomes के कितने सत्र (sessions) लिए?',
        options: { '1-3': '1-3 सत्र', '4-6': '4-6 सत्र', '>6': '6 से अधिक सत्र' }
      },
      'procedures.Stem Cells/Exosomes.helped': { title: 'क्या Stem Cells/Exosomes प्रक्रिया से मदद मिली?' },

      'procedures.Hair Transplant.done': { title: 'क्या आपने कभी Hair Transplant प्रक्रिया कराई है?' },
      'procedures.Hair Transplant.sessions': {
        title: 'आपने Hair Transplant के कितने सत्र (sessions) लिए?',
        options: { '1-3': '1-3 सत्र', '4-6': '4-6 सत्र', '>6': '6 से अधिक सत्र' }
      },
      'procedures.Hair Transplant.helped': { title: 'क्या Hair Transplant प्रक्रिया से मदद मिली?' },

      'procedures.Other.done': { title: 'क्या आपने कभी अन्य प्रक्रियाएं कराई हैं?' },
      'procedures.Other.sessions': {
        title: 'आपने अन्य प्रक्रियाओं के कितने सत्र (sessions) लिए?',
        options: { '1-3': '1-3 सत्र', '4-6': '4-6 सत्र', '>6': '6 से अधिक सत्र' }
      },
      'procedures.Other.helped': { title: 'क्या अन्य प्रक्रियाओं से मदद मिली?' },

      past_treatment_side_effects: {
        title: 'क्या आपको अतीत में किसी बालों के उपचार से दुष्प्रभाव हुए हैं?',
        subtitle: 'इसमें कोई भी उत्पाद, शैम्पू, गोलियां या नैदानिक प्रक्रियाएं शामिल हैं।'
      },
      past_treatment_side_effects_describe: {
        title: 'कृपया दुष्प्रभावों का वर्णन करें',
        subtitle: 'हमें बताएं कि यह किस उपचार के कारण हुआ और क्या समस्या हुई। बोलें या टाइप करें।'
      },
      sample_type: {
        title: 'आप किस प्रकार का डीएनए नमूना देना पसंद करेंगे?',
        subtitle: 'लार संग्रह एक साधारण गाल का स्वाब है। रक्त के नमूने के लिए एक त्वरित क्लिनिक यात्रा की आवश्यकता होती है।',
        options: {
          'Saliva': 'लार (Saliva cheek swab)',
          'Blood': 'रक्त (Blood draw)',
          'Either': 'दोनों में से कोई भी'
        }
      },
      consent: {
        title: 'क्या आप अपने बाल/स्कैल्प नमूने के आनुवंशिक विश्लेषण के लिए सहमति देते हैं?',
        subtitle: 'यह आपके बालों के झड़ने के पैटर्न से जुड़े आनुवंशिक मार्करों की पहचान करने के लिए आवश्यक है।'
      }
    },
    chrome: {
      next: 'अगला कदम',
      back: 'पीछे',
      skip: 'छोड़ें और मैन्युअल रूप से भरें',
      auto_advance: 'चयन करने पर स्वतः आगे बढ़ जाएगा',
      confirm_autofill: 'उत्तर की पुष्टि करें',
      autofilled_msg: 'आपके विवरण से स्वतः भरा गया',
      review_title: 'अपने उत्तरों की समीक्षा करें',
      review_desc: 'कृपया जमा करने से पहले अपनी जानकारी सत्यापित करें। सुधार करने के लिए किसी भी संपादित बटन पर टैप करें।',
      submit: 'चिकित्सा प्रपत्र जमा करें',
      submitting: 'विश्लेषण और रिपोर्ट तैयार की जा रही है...',
      results_title: 'प्रपत्र सफलतापूर्वक जमा हुआ!',
      results_desc: 'आपके बालों और स्कैल्प की विश्लेषण रिपोर्ट सफलतापूर्वक तैयार हो गई है।',
      reset: 'नया मूल्यांकन शुरू करें',
      sensitive_reassurance: '🔒 यह आपके डॉक्टर को व्यक्तिगत देखभाल प्रदान करने में मदद करता है — केवल वही उत्तर दें जिसमें आप सहज महसूस करें।',
      clinical_summary: 'नैदानिक सारांश',
      doctors_review: 'डॉक्टर की समीक्षा',
      copy_json: 'JSON कॉपी करें',
      copied: 'कॉपी हो गया!',
      record_checklist: 'चिकित्सा रिकॉर्ड चेकलिस्ट',
      sex: 'जैविक लिंग',
      overall_progress: 'कुल प्रगति',
      trichology_file: 'त्रिकोणमिति फाइल',
      geno_intake_rec: 'हेयर वाइटल्स सेवन रिकॉर्ड',
      open_mic_tag: 'इंटेलिजेंट सेल्फ-फिलिंग',
      analyze_desc: 'विवरण का विश्लेषण करें',
      analyzing: 'आपका विवरण पढ़ा जा रहा है...',
      confirm_and_next: 'पुष्टि करें और आगे बढ़ें',
      years_old: 'वर्ष',
      or_type_age: 'या यहाँ उम्र लिखें:',
      not_answered: 'उत्तर नहीं दिया',
      none_selected: 'कोई चयन नहीं'
    }
  }
};
