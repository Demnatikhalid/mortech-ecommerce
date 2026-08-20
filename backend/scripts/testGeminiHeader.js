async function test(model) {
  const apiKey = 'AQ.Ab8RN6LinHe4nKx8tPvxzgFkUXT5IWWRDwlbLrrmEOcIuyHUUQ';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  console.log(`Testing ${model} with x-goog-api-key header...`);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
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
