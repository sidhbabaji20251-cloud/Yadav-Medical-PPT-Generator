import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '20mb' }));

// Initialize Google GenAI on the server
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Endpoint for AI-powered lecture enrichment
app.post('/api/generate-ppt', async (req, res) => {
  try {
    const { topic, competencyCode, lectureDuration, customPrompt } = req.body;

    if (!ai) {
      // If no API key configured, notify client to use the built-in clinical curriculum generator
      return res.json({
        success: false,
        message: 'No GEMINI_API_KEY detected. Built-in clinical curriculum generator active.',
        useFallback: true,
      });
    }

    const promptText = `You are a Senior Professor of Medical Biochemistry and Dean of Curriculum under the National Medical Commission (NMC) CBME framework for MBBS First Professional.
The user requested a lecture deck on:
Topic: "${topic || 'Biochemistry Topic'}"
NMC Competency Code: "${competencyCode || 'BI3.1'}"
Lecture Duration: ${lectureDuration || 45} minutes
Custom Teacher Prompt: "${customPrompt || 'Create rich clinical pathways, speaker notes, and examination pearls.'}"

Generate an enriched educational payload containing:
1. "enhancedTitle": Clinical academic lecture title
2. "clinicalHook": A compelling 3-sentence emergency room clinical scenario
3. "deepKeyPoints": 4 high-yield points for university examinations
4. "examAlert": Critical trap or viva voce alert
5. "clinicalPearl": Bedside diagnostic pearl
6. "casePresentation": A 3-sentence clinical vignette (patient age, symptoms, vitals)

Return strictly valid JSON matching this schema:
{
  "enhancedTitle": "string",
  "clinicalHook": "string",
  "deepKeyPoints": ["string", "string", "string", "string"],
  "examAlert": "string",
  "clinicalPearl": "string",
  "casePresentation": "string"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const textOutput = response.text || '{}';
    let parsedData = {};
    try {
      parsedData = JSON.parse(textOutput);
    } catch {
      parsedData = {};
    }

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Gemini API generation error:', error);
    return res.json({
      success: false,
      error: error.message || 'Gemini generation failed',
      useFallback: true,
    });
  }
});

// Mount Vite or serve static files
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
