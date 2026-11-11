import { GoogleGenAI } from '@google/genai';

interface VercelRequest {
  method?: string;
  body?: any;
  headers?: Record<string, string | string[] | undefined>;
}

interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (data: any) => void;
  setHeader?: (name: string, value: string) => VercelResponse;
}

const SYSTEM_INSTRUCTION =
  "You are a math tutor. Solve step by step, show formulas, give a final answer on its own line starting with 'Answer:'. Refuse non-math requests politely.";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method && req.method.toUpperCase() !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ error: 'Invalid JSON body.' });
      }
    }

    if (!body || typeof body !== 'object') {
      return res.status(400).json({ error: 'Request body must be a JSON object.' });
    }

    const { prompt, expression, context } = body;

    const queryText = (prompt || expression || '').toString().trim();

    // Input validation
    if (!queryText) {
      return res.status(400).json({ error: 'Please provide a prompt or math expression to solve.' });
    }

    // Max prompt length enforcement (2000 chars)
    if (queryText.length > 2000) {
      return res.status(400).json({
        error: 'Prompt exceeds maximum length of 2000 characters.',
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'Gemini API key is not configured on the server. Please set GEMINI_API_KEY.',
      });
    }

    const modelName = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const userMessage = context
      ? `Calculation context: ${context}\n\nTask: ${queryText}`
      : queryText;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    const solution = response.text || 'No solution generated.';

    return res.status(200).json({
      ok: true,
      model: modelName,
      solution,
    });
  } catch (err: any) {
    // Return clean JSON error without exposing stack trace or internal secrets
    const errorMessage =
      err?.message && typeof err.message === 'string' && !err.message.includes('at ')
        ? err.message
        : 'Failed to process math request with AI. Please try again.';

    return res.status(500).json({
      error: errorMessage,
    });
  }
}
