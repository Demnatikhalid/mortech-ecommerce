import '../src/loadEnv.js';

const apiKey = process.env.GEMINI_API_KEY;
console.log('GEMINI_API_KEY:', apiKey ? apiKey.substring(0, 20) + '...' : 'NON DÉFINI');

const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey;

fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ role: 'user', parts: [{ text: 'Bonjour' }] }]
  })
})
  .then(r => r.json())
  .then(d => console.log(JSON.stringify(d, null, 2)))
  .catch(e => console.error('Fetch error:', e));
