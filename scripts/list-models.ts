import fs from 'fs';

async function listModels() {
  let apiKey = '';
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const match = envContent.match(/GROQ_API_KEY=(.*)/);
    if (match) {
      apiKey = match[1].trim();
    }
  } catch (e) {
    console.error(e);
  }

  if (!apiKey) {
    console.error('API key not found');
    return;
  }

  const res = await fetch('https://api.groq.com/openai/v1/models', {
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  });

  const data = await res.json();
  console.log('Available models:', data.data?.map((m: any) => m.id));
}

listModels();
