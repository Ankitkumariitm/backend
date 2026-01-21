const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// YAHAN DHAYAN DEIN: Hum API Key ke saath v1beta version specify kar rahe hain
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
  try {
    const { question, type } = req.body;

    // YAHAN FIX HAI: v1beta endpoint specify kiya hai
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash" 
    }, { apiVersion: 'v1beta' }); 

    const prompt = `Provide ${type} for the exam "${question}" in Hindi. Use bullet points.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ answer: text });

  } catch (error) {
    console.error("LOG:", error.message);
    res.status(500).json({ answer: "API Error: " + error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
