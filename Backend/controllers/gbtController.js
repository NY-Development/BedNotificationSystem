import fs from 'fs/promises';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// FIX: Explicitly handle the PDF library's weird export behavior
const pdfParser = require('pdf-parse');
const mammoth = require('mammoth');

import OpenAI from "openai";

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const getLocalContext = async (complaint) => {
    try {
        const kbDir = path.join(process.cwd(), 'data', 'medical_kb');
        const files = await fs.readdir(kbDir);
        const targetFile = files.find(f => f.startsWith('BNS_RAG_TRAIN'));
        
        if (!targetFile) return { context: "", source: "General Knowledge" };

        const filePath = path.join(kbDir, targetFile);
        const extension = path.extname(targetFile).toLowerCase();
        const fileBuffer = await fs.readFile(filePath);
        let fullText = "";

        if (extension === '.txt') {
            fullText = fileBuffer.toString('utf-8');
        } else if (extension === '.pdf') {
            // THE FIX: Try calling it directly, then try .default if that fails
            try {
                const data = await pdfParser(fileBuffer);
                fullText = data.text;
            } catch (e) {
                const data = await pdfParser.default(fileBuffer);
                fullText = data.text;
            }
        } else if (extension === '.docx') {
            const result = await mammoth.extractRawText({ buffer: fileBuffer });
            fullText = result.value;
        }

        const lines = fullText.split('\n');
        const keywords = complaint.toLowerCase().split(' ').filter(w => w.length > 3);
        const relevantLines = lines.filter(line => 
            keywords.some(word => line.toLowerCase().includes(word))
        );

        return { 
            context: relevantLines.slice(0, 10).join('\n'), 
            source: `Local File (${targetFile})` 
        };
    } catch (error) {
        console.error("RAG Context Error:", error.message);
        return { context: "", source: "General Knowledge (Context Error)" };
    }
};

export const predictDiagnosisGBT = async (req, res) => {
    const { complaint } = req.body;
    if (!complaint) return res.status(400).json({ error: "No complaint provided" });

    try {
        const { context, source } = await getLocalContext(complaint);
        
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Fast, cheap, and very accurate
            messages: [
                { role: "system", content: "You are a Clinical Diagnostic Assistant. Answer only in JSON." },
                { role: "user", content: `
                    REFERENCE DATA: ${context || "None"}
                    USER SYMPTOMS: "${complaint}"
                    
                    Return a JSON object with: diagnosis, riskLevel (low/medium/high), reasoning, and dataSource: "${source}"
                `}
            ],
            response_format: { type: "json_object" } // OpenAI forces the response to be valid JSON
        });

        const result = JSON.parse(completion.choices[0].message.content);
        res.json(result);

    } catch (error) {
        console.error("--- OPENAI ERROR ---");
        console.error(error.message);
        res.status(500).json({ error: "AI failure", details: error.message });
    }
};