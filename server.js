const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Nayi Key ke saath setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
  try {
    const { question, type } = req.body;

    // FIX: Yahan 'v1beta' likhna hi sabse bada solution hai
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash" 
    }, { apiVersion: 'v1beta' }); 

    const prompt = `Student wants info about ${type} for ${question} in Hindi.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ answer: text });

  } catch (error) {
    console.error("ERROR:", error.message);
    res.status(500).json({ answer: "API Error: " + error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
