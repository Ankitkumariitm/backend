const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. CORS Setup (Taaki frontend se connection block na ho)
app.use(cors());

// 2. JSON Parser (Taaki frontend ka bheja hua data read ho sake)
app.use(express.json());

// 3. Gemini API Configuration
// Dhyan rakhein: Render ki settings mein GEMINI_API_KEY zaroori hai
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 4. Test Route (Browser mein check karne ke liye)
app.get('/', (req, res) => {
  res.send("Result Reader AI Backend is Live!");
});

// 5. Main Chat Route (Frontend isi par request bhej raha hai)
app.post('/chat', async (req, res) => {
  try {
    // Frontend se 'question' aur 'type' nikalna
    const { question, type } = req.body;

    if (!question) {
      return res.status(400).send({ answer: "Please enter an exam name." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // AI ke liye instruction/prompt
    const prompt = `Student wants to know about "${type}" for the exam: "${question}". 
                    Provide the syllabus, pattern, or tips in Hindi with clear points.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Frontend 'data.answer' dhoond raha hai, isliye 'answer' naam se bhej rahe hain
    res.send({ answer: text });

  } catch (error) {
    console.error("Error details:", error);
    res.status(500).send({ answer: "Maafi chahta hoon, AI se sampark nahi ho pa raha hai." });
  }
});

// 6. Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
