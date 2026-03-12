import Groq from "groq-sdk";
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Simple RAG helper: Reads local knowledge base (supports PDF/text)
const getLocalContext = async (complaint) => {
  try {
    const kbDir = path.join(process.cwd(), 'data', 'medical_kb');
    const files = await fs.readdir(kbDir);
    const targetFile = files.find(f => f.startsWith('BNS_RAG_TRAIN'));
    if (!targetFile) return "";

    const filePath = path.join(kbDir, targetFile);
    const extension = path.extname(targetFile).toLowerCase();
    let fullText = "";

    if (extension === '.pdf') {
      // dynamic import of pdf-parse (works in ESM and serverless)
      try {
        const pdf = (await import('pdf-parse')).default;
        const buffer = await fs.readFile(filePath);
        const data = await pdf(buffer);
        fullText = data.text || '';
      } catch (err) {
        console.error('PDF parse failed:', err?.message || err);
        fullText = '';
      }
    } else {
      // read as utf-8 text for .txt or other text formats
      fullText = await fs.readFile(filePath, 'utf-8');
    }

    const lines = fullText.split('\n');
    const keywords = complaint.toLowerCase().split(' ');
    const relevantLines = lines.filter(line => 
      keywords.some(word => word.length > 3 && line.toLowerCase().includes(word))
    );

    return relevantLines.slice(0, 5).join('\n');
  } catch (error) {
    console.error("Context Retrieval Error:", error);
    return "";
  }
};

export const predictDiagnosisGROQ = async (req, res) => {
  try {
    const { chiefComplaint } = req.body;

    if (!chiefComplaint) {
      return res.status(400).json({ message: "No complaint provided" });
    }

    // Version 2 Logic: Get local context first
    const context = await getLocalContext(chiefComplaint);

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a medical diagnostic assistant. 
          Use the following clinical guidelines if relevant: 
          ${context}
          
          Analyze the user's chief complaint.
          Return ONLY a JSON object with two fields: 
          "diagnosis" (a short 1-sentence assessment) and 
          "riskLevel" (strictly one of: "low", "medium", or "high").`
        },
        {
          role: "user",
          content: chiefComplaint,
        },
      ],
      model: "llama-3.1-8b-instant", // Updated Model
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(chatCompletion.choices[0].message.content);
    res.status(200).json(result);
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ message: "AI Prediction failed", error: error.message });
  }
};