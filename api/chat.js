// api/chat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ text: "Method not allowed" });
  }

  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ text: "API Key is missing in Vercel settings." });
  }

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`   // ✅ critical fix
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      const aiText = data.candidates[0].content.parts[0].text;
      res.status(200).json({ text: aiText });
    } else {
      res.status(500).json({ text: "The AI returned an empty response. Check your API quota." });
    }
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ text: "Connection error. Check Vercel logs." });
  }
}
