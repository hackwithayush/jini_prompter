const url = 'http://localhost:3000/api/generate/section';

async function testSection(sectionName) {
  console.log(`Sending request for ${sectionName}...`);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: "Build an AI-powered fitness coaching app that creates personalized workout plans using computer vision to analyze form and provide real-time feedback",
        section: sectionName,
        imageAnalysis: null
      })
    });
    console.log(`${sectionName} Status: ${res.status}`);
    const text = await res.text();
    console.log(`${sectionName} Output length: ${text.length} chars`);
    if (text.length < 100) {
      console.log(`${sectionName} Output:`, text);
    }
  } catch (err) {
    console.error(`Error during fetch for ${sectionName}:`, err);
  }
}

async function testAll() {
  await Promise.all([
    testSection('executiveSummary'),
    testSection('architecture'),
    testSection('features'),
    testSection('roadmap')
  ]);
}

testAll();
