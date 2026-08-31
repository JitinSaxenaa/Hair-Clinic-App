import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Groq API Key is not configured on the server.' }, { status: 500 });
    }

    const { answers } = await req.json();
    if (!answers) {
      return NextResponse.json({ error: 'Form answers are required' }, { status: 400 });
    }

    const systemInstruction = `You are a professional trichologist and clinical assistant.
Your task is to review a structured patient intake form JSON and generate a 3-4 sentence plain-English clinical summary.

Keep it professional, objective, and brief.
Mention:
1. Patient's age of onset and duration of hair loss.
2. Key genetic markers (family history) and visual patterns (e.g., thinning crown, receding hairline).
3. Hormonal or environmental triggers (e.g., diagnosed PCOS, high stress, dieting, smoking, hard water).
4. Major past treatments tried (with efficacy/side-effects), and their consent/sampling status.

Format your output as a JSON object with a single key "summary":
{
  "summary": "Your 3-4 sentence clinical summary here."
}`;

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
          { role: 'user', content: `Here is the completed intake data: ${JSON.stringify(answers, null, 2)}` }
        ],
        temperature: 0.3
      })
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('Groq summarize request failed:', errorText);
      return NextResponse.json({ error: 'Failed to communicate with LLM provider.' }, { status: 502 });
    }

    const data = await groqResponse.json();
    const resultString = data.choices[0]?.message?.content;
    const resultJson = JSON.parse(resultString || '{}');

    return NextResponse.json(resultJson);
  } catch (error: unknown) {
    console.error('Error in summarize route:', error);
    return NextResponse.json({ error: (error as Error).message || 'Internal Server Error' }, { status: 500 });
  }
}
