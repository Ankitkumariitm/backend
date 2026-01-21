const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get('/', (req, res) => res.send("Server is Live"));

app.post('/chat', async (req, res) => {
  try {
    const { question, type } = req.body;
    
    // v1beta humne isliye use kiya tha kyunki v1 404 de raha tha
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: 'v1beta' });

    const result = await model.generateContent(`Tell me about ${type} for ${question} in Hindi.`);
    const response = await result.response;
    res.json({ answer: response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ answer: "Error: " + error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Running on ${PORT}`));
