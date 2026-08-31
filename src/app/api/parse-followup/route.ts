import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Groq API Key is not configured on the server.' }, { status: 500 });
    }

    const { questionKey, questionTitle, questionType, options, userSpeech, detectedLanguage } = await req.json();

    if (!questionKey || !userSpeech || typeof userSpeech !== 'string') {
      return NextResponse.json({ error: 'questionKey and userSpeech are required' }, { status: 400 });
    }

    const cleanSpeech = userSpeech.trim().toLowerCase();

    // 1. FAST PATH: Instant sub-millisecond local resolution for common spoken responses
    if (questionType === 'yesno') {
      const yesWords = ['yes', 'yeah', 'yep', 'yup', 'haan', 'ha', 'haa', 'bilkul', 'sahi', 'true', 'used', 'done', 'taken'];
      const noWords = ['no', 'nope', 'nah', 'nahi', 'naahi', 'never', 'kabhi nahi', 'not yet', 'none', 'false'];

      if (noWords.some(w => cleanSpeech === w || cleanSpeech.startsWith(w + ' ') || cleanSpeech.endsWith(' ' + w) || cleanSpeech.includes('not used') || cleanSpeech.includes('never used'))) {
        return NextResponse.json({ resolvedValue: 'no', confidence: 'high' });
      }
      if (yesWords.some(w => cleanSpeech === w || cleanSpeech.startsWith(w + ' ') || cleanSpeech.endsWith(' ' + w) || cleanSpeech.includes('have used') || cleanSpeech.includes('used it'))) {
        return NextResponse.json({ resolvedValue: 'yes', confidence: 'high' });
      }
    }

    if (questionType === 'single' && Array.isArray(options)) {
      for (const opt of options) {
        const optLower = opt.toLowerCase();
        if (cleanSpeech === optLower || cleanSpeech.includes(optLower)) {
          return NextResponse.json({ resolvedValue: opt, confidence: 'high' });
        }
      }
    }

    // 2. LLM Intent Classifier for nuanced speech
    const systemInstruction = `You are a medical speech-parsing assistant for Hair Vitals Hair & Scalp Clinic.
Your job is to analyze the patient's spoken/typed answer to a single question and map it onto the structured schema options.

The question details:
- Key: "${questionKey}"
- Title/Prompt: "${questionTitle}"
- Type: "${questionType}"
- Allowed options list: ${JSON.stringify(options || [])}
- Detected baseline language of conversation: "${detectedLanguage || 'English'}"

Strictly return a JSON object with:
1. "resolvedValue": The extracted value matching the schema requirements, or null if the response is ambiguous, empty, or does not match the schema options.
   - For "yesno" type: resolvedValue must be "yes", "no", or null. (E.g. "haan", "kiya tha", "used" -> "yes"; "nahi", "never", "not yet", "no i have not" -> "no").
   - For "single" type: resolvedValue must be EXACTLY one of the items from the allowed options list, or null.
   - For "multi" type: resolvedValue must be an array of strings selected from the allowed options list, or null.
   - For "number" type: resolvedValue must be an integer, or null.
2. "confidence": "high" | "low" (Set to "high" whenever the patient's intent is clear).

If the patient's response maps to one of the options (even in Hindi/Hinglish/abbreviations), return the exact English string from the options list.`;

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
          { role: 'user', content: `Patient's answer text: "${userSpeech}"` }
        ],
        temperature: 0.1
      })
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('Groq follow-up parse failed:', errorText);
      return NextResponse.json({ error: 'Failed to communicate with LLM provider.' }, { status: 502 });
    }

    const data = await groqResponse.json();
    const resultString = data.choices[0]?.message?.content;
    const resultJson = JSON.parse(resultString || '{}');

    return NextResponse.json(resultJson);
  } catch (error: unknown) {
    console.error('Error in parse-followup route:', error);
    return NextResponse.json({ error: (error as Error).message || 'Internal Server Error' }, { status: 500 });
  }
}
