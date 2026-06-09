import { GoogleGenerativeAI } from '@google/generative-ai';

const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  console.warn('GEMINI_API_KEY is not configured. Gemini features will be unavailable.');
}

const gemini = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

export default gemini;