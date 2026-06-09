import { ChatMistralAI } from '@langchain/mistralai';
import { HumanMessage, SystemMessage } from 'langchain';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { EXTRACTION } from '../utils/prompts.js';
import logger from '../utils/logger.js';

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
 * Extracts memory nodes from a conversation using Google Gemini 2.5 Flash Lite
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