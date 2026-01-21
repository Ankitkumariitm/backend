import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 API KEY SERVER SIDE ONLY
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ answer: "Question missing" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: question }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content.parts[0].text
    ) {
      res.json({
        answer: data.candidates[0].content.parts[0].text,
      });
    } else {
      console.log("Gemini response:", data);
      res.status(500).json({ answer: "No answer from Gemini" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ answer: "Server error" });
  }
});

app.listen(3000, () => {
  console.log("✅ Backend running on port 3000");
});
