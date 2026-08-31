import { POST } from '../src/app/api/parse-speech/route';
import fs from 'fs';

async function testExtraction() {
  const sampleParagraph = "I am a 45-year-old female, dealing with thinning hair at the crown for over a year now. My mother had similar hair loss. I don't smoke or drink, but I wash my hair daily. I've tried minoxidil but it didn't help.";
  
  // Load environment variables manually for this standalone tsx execution
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const match = envContent.match(/GROQ_API_KEY=(.*)/);
    if (match) {
      process.env.GROQ_API_KEY = match[1].trim();
    }
  } catch (e) {
    console.error('Warning: could not read .env.local', e);
  }

  if (!process.env.GROQ_API_KEY) {
    console.error('Error: GROQ_API_KEY is not set.');
    process.exit(1);
  }

  console.log('Invoking live /api/parse-speech POST handler...');
  
  const mockReq = new Request('http://localhost:3000/api/parse-speech', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: sampleParagraph })
  });

  try {
    const response = await POST(mockReq);
    const result = await response.json();

    console.log('\n======================================');
    console.log('LIVE RESPONSE FROM GROQ:');
    console.log(JSON.stringify(result, null, 2));
    console.log('======================================\n');

    // Expected keys to compare
    const expected = {
      age_hair_loss_began: 44, // 45 years old female, over a year -> onset age is 44 or 45
      duration: 'Over a year',
      pattern: ['Thinning at crown'],
      family_history: ['Mother had hair loss'],
      'habits.smoking': 'no',
      'habits.alcohol': 'no',
      'habits.hair_wash_frequency': 'Daily',
      'products.Topical Minoxidil.used': true,
      'products.Topical Minoxidil.helped': 'no'
    };

    const extracted = result.extracted || {};
    
    console.log('COMPARISON TABLE (Expected vs. Extracted):');
    console.log('-----------------------------------------------------------------------------------------------------');
    console.log('| Field                             | Expected Value                   | Actual Extracted Value            |');
    console.log('-----------------------------------------------------------------------------------------------------');

    // 1. age_hair_loss_began
    console.log(`| age_hair_loss_began               | ~44/45                           | ${extracted.age_hair_loss_began}                                 |`);
    
    // 2. duration
    console.log(`| duration                          | "Over a year"                    | "${extracted.duration}"                         |`);
    
    // 3. pattern
    console.log(`| pattern                           | ["Thinning at crown"]            | ${JSON.stringify(extracted.pattern)}             |`);
    
    // 4. family_history
    console.log(`| family_history                    | ["Mother had hair loss"]         | ${JSON.stringify(extracted.family_history)}         |`);
    
    // 5. habits.smoking
    console.log(`| habits.smoking                    | "no"                             | "${extracted.habits?.smoking}"                              |`);
    
    // 6. habits.alcohol
    console.log(`| habits.alcohol                    | "no"                             | "${extracted.habits?.alcohol}"                              |`);
    
    // 7. habits.hair_wash_frequency
    console.log(`| habits.hair_wash_frequency        | "Daily"                          | "${extracted.habits?.hair_wash_frequency}"                           |`);

    // 8. products.Topical Minoxidil.used
    const topicalMinox = extracted.products?.['Topical Minoxidil'] || {};
    console.log(`| products.Topical Minoxidil.used   | true                             | ${topicalMinox.used}                             |`);
    console.log(`| products.Topical Minoxidil.helped | "no"                             | "${topicalMinox.helped}"                              |`);
    console.log('-----------------------------------------------------------------------------------------------------');

  } catch (err) {
    console.error('Error during execution:', err);
    process.exit(1);
  }
}

testExtraction();
