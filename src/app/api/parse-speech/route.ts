import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Groq API Key is not configured on the server.' }, { status: 500 });
    }

    const { text } = await req.json();
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text content is required' }, { status: 400 });
    }

    const systemInstruction = `You are a medical speech-parsing assistant for Hair Vitals Hair & Scalp Clinic.
Your job is to analyze the free-text transcript from a patient (which could be in English, Hindi, or Hinglish - Hindi words written in English letters) and extract structured information matching the questionnaire schema.

Strictly return a JSON object with:
1. "extracted": a subset of the FormAnswers interface containing fields you are CONFIDENT about.
2. "detected_language": "English" | "Hindi" | "Hinglish" | "Other"
3. "feedback_message": a friendly 1-2 sentence message in the patient's own register/language summarizing what has been auto-filled. E.g., if Hinglish, write: "Maine aapka gender 'Female' aur thinning duration 'Over a year' set kar diya hai. Baki details hum aage step-by-step fill karenge." If Hindi: "मैंने आपके बालों के झड़ने की अवधि 'Over a year' और लिंग 'Female' सेट कर दिया है। बाकी विवरण हम आगे भरेंगे।" If English: "I've pre-filled your sex as 'Female' and hair loss duration as 'Over a year'. Let's verify the rest."

SCHEMA RULES FOR EXTRACTED FIELDS:
- biological_sex: must be "Male" | "Female" | "Prefer not to say"
- age_hair_loss_began: must be an integer. (Calculate based on current age if patient says e.g. "I am 45, and my hair fall started 3 years ago" -> age_hair_loss_began is 42. If they say they are 45 and have been experiencing it for "over a year", calculate as 44. If you cannot calculate, do not fill).
- duration: must be "Less than 6 months" | "6-12 months" | "Over a year"
- family_history: array of options. Allowed options: "Father had hair loss", "Mother had hair loss", "Siblings with thinning or baldness", "No known family history"
- pattern: array of options. Allowed options: "Receding hairline", "Thinning at crown", "Widening part line", "Diffuse thinning", "Patchy loss", "Sudden excessive shedding"
- diagnosed_conditions: array of options. Allowed options: "PCOS/PCOD", "Thyroid disorder", "Diabetes", "Autoimmune disease", "Anemia", "None"
- menstrual_cycle: must be "Regular" | "Irregular" | "Menopausal" | "Not applicable" (Skip if male)
- pregnancy_related: must be "Currently pregnant" | "Postpartum <1 year" | "Not applicable" (Skip if male)
- adult_acne_oily_skin: "yes" | "no"
- excess_body_facial_hair: "yes" | "no"
- past_6_months: array of options. Allowed options: "Crash dieting or major weight loss", "High stress or emotional trauma", "Fever with illness (COVID, Dengue, Typhoid)", "Recent surgery", "Change in location/water/air quality"
- habits: object containing keys:
  - smoking: "yes" | "no"
  - smoking_severity: "Mild <5/day" | "Moderate 5-10/day" | "Severe >10/day" (only if smoking is yes)
  - alcohol: "yes" | "no"
  - hard_water: "yes" | "no"
  - hair_wash_frequency: "Daily" | "Alternate Days" | "Weekly"
  - heating_tools_styling_chemicals: "yes" | "no"
  - salon_treatments: "yes" | "no"
  - salon_treatment_detail: string (only if salon_treatments is yes)
- products: object mapping product names to details:
  Allowed names: "OTC/Medicated Shampoos", "Hair Oils/Serums", "Topical Minoxidil", "Oral Minoxidil", "Supplements"
  Details schema:
    - used: boolean
    - duration: "<3mo" | "3-6mo" | ">6mo" (If not mentioned, omit duration)
    - helped: "yes" | "no" (If they say "tried minoxidil but it didn't help", helped is "no")
    - side_effects: "yes" | "no" (If not mentioned, omit side_effects)
  If the patient says they "tried minoxidil" or "used minoxidil" without specifying topical or oral, map it to "Topical Minoxidil" by default and set used to true.
- procedures: object mapping procedure names to details:
  Allowed names: "PRP/GFC/iPRF", "Stem Cells/Exosomes", "Hair Transplant", "Other"
  Details schema:
    - done: boolean
    - sessions: "1-3" | "4-6" | ">6"
    - helped: "yes" | "no"
- past_treatment_side_effects: "yes" | "no"
- past_treatment_side_effects_describe: string
- sample_type: "Saliva" | "Blood" | "Either"
- consent: "yes" | "no"

Ensure all field values exactly match the spelling and options given above. Do not guess fields unless the text provides clear context.`;

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: `Here is the patient's transcript: "${text}"` }
        ],
        temperature: 0.1
      })
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('Groq request failed:', errorText);
      return NextResponse.json({ error: 'Failed to communicate with LLM provider.' }, { status: 502 });
    }

    const data = await groqResponse.json();
    const resultString = data.choices[0]?.message?.content;
    const resultJson = JSON.parse(resultString || '{}');

    return NextResponse.json(resultJson);
  } catch (error: unknown) {
    console.error('Error in parse-speech route:', error);
    return NextResponse.json({ error: (error as Error).message || 'Internal Server Error' }, { status: 500 });
  }
}
