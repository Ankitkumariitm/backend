const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); // Frontend connection allow karne ke liye
app.use(express.json());

// Gemini API Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).send({ error: "Prompt zaroori hai!" });
    }

    // Model select karein (Gemini 1.5 Flash fast aur efficient hai)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.send({ reply: text });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ error: "Kuch galat ho gaya, phir se koshish karein." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});