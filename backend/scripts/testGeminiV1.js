async function test(model) {
  const apiKey = 'AQ.Ab8RN6LinHe4nKx8tPvxzgFkUXT5IWWRDwlbLrrmEOcIuyHUUQ';
  const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;
  console.log(`Testing ${model} with v1...`);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Hello' }] }]
      })
    });
    const status = res.status;
    const json = await res.json();
    console.log(`Status: ${status}`);
    console.log(JSON.stringify(json, null, 2));
  } catch (err) {
    console.error(err);
  }
}

test('gemini-1.5-flash');
