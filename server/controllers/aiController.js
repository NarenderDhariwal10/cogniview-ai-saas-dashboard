import fs from "fs";
import csv from "csv-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const SITE_URL = process.env.SITE_URL ;
const SITE_NAME = process.env.SITE_NAME ;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// Role-based helper: check if user has Pro or Enterprise plan
const checkPlanAccess = (user) => ["pro", "enterprise"].includes(user.plan);

// Call OpenRouter API
async function callOpenRouter(messages) {
  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": SITE_URL,
      "X-Title": SITE_NAME,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3.3-70b-instruct",
      messages,
      max_tokens: 800,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenRouter API error: ${errText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "No response generated";
}

// Upload CSV and generate insights
export const uploadCSVAndAnalyze = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "CSV file required" });
    if (!checkPlanAccess(req.user)) return res.status(403).json({ message: "Upgrade to Pro plan to use AI features" });

    const filePath = req.file.path;
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          const sample = JSON.stringify(results.slice(0, 50));
          const prompt = `You are a data analyst. Provide high-level insights, trends, and anomalies for the dataset:\n${sample}`;

          const reply = await callOpenRouter([{ role: "user", content: prompt }]);
          res.json({ insights: reply });

          fs.existsSync(filePath) && fs.unlinkSync(filePath);
        } catch (err) {
          console.error("OpenRouter error:", err);
          fs.existsSync(filePath) && fs.unlinkSync(filePath);
          res.status(500).json({ message: "Error generating AI insights", error: err.message });
        }
      });
  } catch (err) {
    res.status(500).json({ message: "Error processing CSV", error: err.message });
  }
};

// Chat assistant
export const chatAssistant = async (req, res) => {
  try {
    if (!req.body.message) return res.status(400).json({ message: "Message is required" });
    if (!checkPlanAccess(req.user)) return res.status(403).json({ message: "Upgrade to Pro plan to use AI features" });

    const reply = await callOpenRouter([{ role: "user", content: req.body.message }]);
    res.json({ reply });
  } catch (err) {
    console.error("AI chat error:", err);
    res.status(500).json({ message: "Error with AI chat", error: err.message });
  }
};
