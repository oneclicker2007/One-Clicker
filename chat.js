// api/chat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ text: "Method not allowed" });
  }

  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    
    // Extract the text from Gemini's specific response format
    const aiText = data.candidates[0].content.parts[0].text;
    
    res.status(200).json({ text: aiText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ text: "Error communicating with Gemini API." });
  }
}
