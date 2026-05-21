export default async function handler(req, res) {
  // 1. Check if the request is a POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    // 2. Calling the official Gemini API URL
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }]
      }),
    });

    const data = await response.json();
    
    // 3. Extracting the text from Gemini's response structure
    if (data.candidates && data.candidates[0].content) {
      const botResponse = data.candidates[0].content.parts[0].text;
      res.status(200).json({ response: botResponse });
    } else {
      res.status(500).json({ error: "Invalid response from Google API", details: data });
    }

  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
}
