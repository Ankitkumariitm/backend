import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const HF_API_KEY = process.env.HF_API_KEY; // 🔐 env variable

app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ answer: "Question missing" });
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-base",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: question
        })
      }
    );

    const data = await response.json();
    console.log("HF raw response:", data);

    // HuggingFace response handling
    if (Array.isArray(data) && data[0]?.generated_text) {
      res.json({ answer: data[0].generated_text });
    } else if (data.error) {
      res.json({ answer: "Model loading, try again in 10 sec" });
    } else {
      res.json({ answer: "No answer from HuggingFace" });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ answer: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log("✅ Backend running on port", PORT);
});
