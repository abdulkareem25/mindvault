import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatMistralAI } from '@langchain/mistralai';
import Groq from 'groq-sdk';
import { HumanMessage, SystemMessage } from 'langchain';
import logger from '../utils/logger.js';
import * as prompts from '../utils/prompts.js';

const { EXTRACTION } = prompts;

// Initialize clients
const geminiApiKey = process.env.GEMINI_API_KEY;
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

const groqApiKey = process.env.GROQ_API_KEY;
const groq = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null;
const CHAT_MODEL = 'llama-3.3-70b-versatile';

const mistralModel = new ChatMistralAI({
  model: 'mistral-small-latest'
});

const mistralLargeModel = new ChatMistralAI({
  model: 'mistral-large-latest'
});

/**
 * Core chat completion function using Groq llama-3.3-70b-versatile
 */
export const chatCompletion = async ({ messages, category, contextPrefix = null }) => {
  if (!groq) {
    throw new Error('GROQ_API_KEY is not configured.');
  }

  const baseSystem = prompts.CHAT_SYSTEM(category);
  const fullSystem = contextPrefix ? `${contextPrefix}${baseSystem}` : baseSystem;

  const formattedMessages = [
    { role: 'system', content: fullSystem },
    ...messages.map(m => ({ role: m.role, content: m.content }))
  ];

  const response = await groq.chat.completions.create({
    model: CHAT_MODEL,
    max_tokens: 2048,
    messages: formattedMessages
  });

  return response.choices[0].message.content;
};

/**
 * Generates a concise title (no more than 5 words) for a new chat using Mistral
 */
export const generateChatTitle = async (params) => {
  const initialMessage = typeof params === 'string' ? params : params.firstMessage;
  const category = typeof params === 'object' ? params.category : null;

  const systemPrompt = `You are a helpful assistant that creates concise and descriptive titles for user conversations. The title should capture the main topic or theme of the conversation in a few words. Avoid generic titles and focus on the specific content of the initial message.${category ? ` The conversation is categorized as "${category}".` : ''}`;

  const humanPrompt = `Based on the following initial message, generate a concise and descriptive title for the conversation:\n\n"${initialMessage}"\n\nThe title should be no more than 5 words, and it should not include any quotation marks.`;

  const response = await mistralModel.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(humanPrompt)
  ]);

  return response.text.trim();
};

/**
 * Generates initial AI response when starting a chat using Groq
 */
export const generateInitialAIResponse = async (initialMessage, category, contextPrefix = null) => {
  const messages = [{ role: 'user', content: initialMessage }];
  return await chatCompletion({ messages, category, contextPrefix });
};

/**
 * Generates subsequent AI responses in an ongoing chat using Groq
 */
export const generateAIResponse = async (conversationHistory, category, contextPrefix = null) => {
  let messages = [];
  if (Array.isArray(conversationHistory)) {
    messages = conversationHistory.map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));
  } else {
    messages = [{ role: 'user', content: conversationHistory }];
  }

  return await chatCompletion({ messages, category, contextPrefix });
};

/**
 * Generates vector embeddings for a given text using Google's embedding-001
 */
export const generateEmbedding = async (text) => {
  if (!genAI) {
    throw new Error('GEMINI_API_KEY is not configured, cannot generate embeddings.');
  }

  const model = genAI.getGenerativeModel({ model: 'embedding-001' });
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
 * Classifies a quick-capture thought into category, type, and tags using gemini-2.5-flash-lite
 */
export const classifyCapture = async ({ content }) => {
  if (!genAI) throw new Error('GEMINI_API_KEY is not configured, cannot classify capture.');

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
      systemInstruction: prompts.CLASSIFY
    });
    const result = await model.generateContent(content);
    const responseText = result.response.text().trim();
    const cleanText = responseText.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    logger.extraction.error('Failed to classify capture, returning defaults', { error: error.message });
    return { category: 'life', type: 'fact', tags: [] };
  }
};

/**
 * Extracts memory nodes from a conversation using gemini-2.5-flash-lite
 */
export const extractMemories = async ({ messages }) => {
  if (!genAI) {
    throw new Error('GEMINI_API_KEY is not configured, cannot extract memories.');
  }

  if (!messages || messages.length === 0) {
    logger.extraction.info('No messages provided for memory extraction.');
    return [];
  }

  // Format the conversation history as a text log
  const conversationText = messages
    .map((msg) => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
    .join('\n');

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
      systemInstruction: EXTRACTION
    });

    const result = await model.generateContent(conversationText);
    const responseText = result.response.text().trim();

    // Clean response to parse JSON
    const cleanText = responseText.replace(/```json|```/g, '').trim();

    try {
      return JSON.parse(cleanText);
    } catch (e) {
      logger.extraction.error('Failed to parse extraction JSON response', {
        error: e.message,
        responseText
      });
      return [];
    }
  } catch (error) {
    logger.extraction.error('Gemini memory extraction call failed', { error: error.message });
    throw error; // Rethrow to trigger Agenda job retry
  }
};

/**
 * Generates a weekly digest from recent memories and chat topics using Groq
 */
export const generateDigest = async ({ recentMemories, recentChats }) => {
  const prompt = `Generate a brief weekly knowledge digest (max 200 words).
Review the user's recent activity and summarize:
- Key decisions made this week
- Recurring themes or topics
- Notable progress toward goals

Be conversational, insightful, and specific. Reference actual content.
Recent memories: ${JSON.stringify(recentMemories.map(m => m.content))}
Recent chat topics: ${recentChats.map(c => c.title).join(', ')}`;

  return await chatCompletion({
    messages: [{ role: 'user', content: prompt }],
    category: 'life'
  });
};