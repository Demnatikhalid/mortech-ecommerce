import '../src/loadEnv.js';

const apiKey = process.env.GEMINI_API_KEY;

const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
const data = await res.json();

if (data.error) {
  console.error('API Error:', JSON.stringify(data.error, null, 2));
} else {
  const models = (data.models || [])
    .filter(m => (m.supportedGenerationMethods || []).includes('generateContent'))
    .map(m => m.name);
  console.log('Modèles disponibles avec generateContent :');
  console.log(models.join('\n'));
}
