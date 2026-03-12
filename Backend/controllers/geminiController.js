import fs from 'fs/promises';
import path from 'path';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
            // DYNAMIC IMPORT: This is the most reliable way for ESM
            const pdf = (await import('pdf-parse')).default;
            const data = await pdf(fileBuffer);
            fullText = data.text;
        } else if (extension === '.docx') {
            const mammoth = (await import('mammoth')).default;
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

export const predictDiagnosisGEMINI = async (req, res) => {
    const { complaint } = req.body;
    if (!complaint) return res.status(400).json({ error: "No complaint provided" });

    try {
        const { context, source } = await getLocalContext(complaint);
        
        // We'll stick with 2.0-flash as it's the 2026 standard
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
            You are a Clinical Diagnostic Assistant. Use the provided REFERENCE DATA if applicable.
            
            REFERENCE DATA:
            ${context || "No specific guidelines found."}

            USER SYMPTOMS: "${complaint}"

            Return ONLY a JSON object:
            {
                "diagnosis": "string",
                "riskLevel": "low" | "medium" | "high",
                "reasoning": "string",
                "dataSource": "${source}"
            }
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            res.json(JSON.parse(jsonMatch[0]));
        } else {
            throw new Error("Invalid AI Response Format");
        }

    } catch (error) {
        console.error("--- AI ERROR ---");
        console.error(error.message);

        // Friendly error message for Quota issues
        const isQuota = error.message.includes("429") || error.message.includes("quota");
        res.status(isQuota ? 429 : 500).json({ 
            error: isQuota ? "AI is busy (Quota Exceeded). Try again in 1 minute." : "Internal AI failure", 
            details: error.message 
        });
    }
};