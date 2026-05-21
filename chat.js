// This file goes in: /api/chat.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // 1. Only allow the "POST" method (sending data)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Get your Secret Key from Vercel's Environment Variables
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const { prompt } = req.body;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // 3. Send the AI's answer back to your website
    return res.status(200).json({ text: response.text() });
  } catch (error) {
    return res.status(500).json({ error: 'The AI Bridge is broken.' });
  }
}

