import { ChatMistralAI } from '@langchain/mistralai';
import { HumanMessage, SystemMessage } from 'langchain';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize clients
const geminiApiKey = process.env.GEMINI_API_KEY;
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

const mistralModel = new ChatMistralAI({
  model: 'mistral-small-latest'
});

const mistralLargeModel = new ChatMistralAI({
  model: 'mistral-large-latest'
});

/**
 * Generates a concise title (no more than 5 words) for a new chat using Mistral
 */
export const generateChatTitle = async (initialMessage) => {
  const systemPrompt = `You are a helpful assistant that creates concise and descriptive titles for user conversations. The title should capture the main topic or theme of the conversation in a few words. Avoid generic titles and focus on the specific content of the initial message.`;

  const humanPrompt = `Based on the following initial message, generate a concise and descriptive title for the conversation:\n\n"${initialMessage}"\n\nThe title should be no more than 5 words, and it should not include any quotation marks.`;

  const response = await mistralModel.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(humanPrompt)
  ]);

  return response.text.trim();
};

/**
 * Generates initial AI response when starting a chat using Mistral
 */
export const generateInitialAIResponse = async (initialMessage, category) => {
  const systemPrompt = `You are a helpful assistant that provides thoughtful and relevant responses to user messages. The conversation is categorized as "${category}", so tailor your response to fit that context. Based on the initial message, provide a meaningful reply that encourages further conversation.`;

  const humanPrompt = `Here is the initial message:\n\n"${initialMessage}"\n\nBased on this message, provide a helpful and relevant response that encourages further conversation.`;

  const response = await mistralModel.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(humanPrompt)
  ]);

  return response.text.trim();
};

/**
 * Generates subsequent AI responses in an ongoing chat using Mistral Large
 */
export const generateAIResponse = async (conversationHistory, category) => {
  const systemPrompt = `You are a helpful assistant that provides thoughtful and relevant responses to user messages. The conversation is categorized as "${category}", so tailor your response to fit that context. Use the conversation history to understand the user's needs and provide a meaningful reply.`;

  let historyText = '';
  if (Array.isArray(conversationHistory)) {
    historyText = conversationHistory
      .map((msg) => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');
  } else {
    historyText = conversationHistory;
  }

  const humanPrompt = `Here is the conversation history:\n\n${historyText}\n\nBased on this conversation, provide a helpful and relevant response to the user's latest message.`;

  const response = await mistralLargeModel.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(humanPrompt)
  ]);

  return response.text.trim();
};

/**
 * Generates vector embeddings for a given text using Google's text-embedding-004
 */
export const generateEmbedding = async (text) => {
  if (!genAI) {
    throw new Error('GEMINI_API_KEY is not configured, cannot generate embeddings.');
  }

  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
  const result = await model.embedContent(text);
  
  if (!result || !result.embedding || !result.embedding.values) {
    throw new Error('Embedding generation returned an empty result.');
  }

  return result.embedding.values;
};

/**
 * Auto-classifies a user note into category, type, and tags using gemini-2.5-flash-lite
 */
export const classifyNote = async (text) => {
  const systemPrompt = `Classify the following user note into a structured memory note.
Return ONLY valid JSON. No preamble, no markdown.

{
  "category": "coding" | "deen" | "admin" | "life",
  "type": "decision" | "preference" | "learning" | "goal" | "fact",
  "tags": ["tag1", "tag2", "tag3"]
}

Choose the category that best fits the note's subject matter.
Choose the type that best describes the nature of the information.
Tags should be 2–3 short lowercase topic words.`;

  if (!genAI) {
    throw new Error('GEMINI_API_KEY is not configured, cannot classify note.');
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
      systemInstruction: systemPrompt
    });
    const result = await model.generateContent(text);
    const responseText = result.response.text().trim();
    const cleanText = responseText.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Failed to classify note using AI, returning default category:', error);
    return {
      category: 'life',
      type: 'fact',
      tags: []
    };
  }
};

/**
 * Extracts memory nodes from a conversation using Mistral Large
 */
export const extractMemories = async (conversationText) => {
  const systemPrompt = `You are a memory extraction system. Your task is to read a conversation
between a user and an AI assistant and extract structured memory nodes about the USER.

A memory node represents something specific and personal about the user:
- A decision they made about their work, life, or projects
- A preference or opinion they expressed
- A fact about their situation (tech stack, life circumstances, etc.)
- A goal or intention they stated
- Something they learned or understood in this conversation

Rules:
1. Extract ONLY information about the user — not general knowledge, not AI explanations
2. Write each node in first person: "Prefer X over Y" not "The user prefers X over Y"
3. Be specific: "Using Supabase for auth + DB on the MindVault project" not "Uses a database"
4. Extract 1–4 nodes per conversation. Quality over quantity.
5. If the conversation is too short, generic, or contains no user-specific information, return []
6. Return ONLY a valid JSON array. No preamble, no explanation, no markdown fences.

JSON structure:
[
  {
    "content": "string (max 100 words, first person, specific)",
    "category": "coding" | "deen" | "admin" | "life",
    "type": "decision" | "preference" | "learning" | "goal" | "fact",
    "confidence": "high" | "medium" | "low",
    "tags": ["tag1", "tag2"]
  }
]`;

  try {
    const response = await mistralLargeModel.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(conversationText)
    ]);
    const responseText = response.text.trim();
    const cleanText = responseText.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Failed to extract memories from conversation:', error);
    return [];
  }
};