import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '../utils/logger.js';

const geminiApiKey = process.env.GEMINI_API_KEY;
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

/**
 * Generates a vector embedding for a single text using Gemini's embedding-001 model.
 * @param {string} text - The text to generate an embedding for
 * @returns {Promise<number[]>} - 768-dimensional float array
 */
export async function generateEmbedding(text) {
  if (!genAI) {
    throw new Error('GEMINI_API_KEY is not configured, cannot generate embeddings.');
  }

  const model = genAI.getGenerativeModel({ model: 'embedding-001' });
  const truncatedText = text.substring(0, 8000); // Truncate to avoid token limit
  const result = await model.embedText(truncatedText);

  if (!result || !result.embedding || !result.embedding.values) {
    throw new Error('Embedding generation returned an empty result.');
  }

  return result.embedding.values;
}

/**
 * Generates vector embeddings for multiple texts in batches.
 * @param {string[]} texts - Array of texts to generate embeddings for
 * @returns {Promise<number[][]>} - Array of 768-dimensional float arrays
 */
export async function batchGenerateEmbeddings(texts) {
  if (!genAI) {
    throw new Error('GEMINI_API_KEY is not configured, cannot generate embeddings.');
  }

  const BATCH_SIZE = 100;
  const results = [];
  const model = genAI.getGenerativeModel({ model: 'embedding-001' });

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);

    // Process each text in the batch sequentially to avoid API issues
    for (const text of batch) {
      try {
        const truncatedText = text.substring(0, 8000);
        const result = await model.embedContent(truncatedText);

        if (!result || !result.embedding || !result.embedding.values) {
          throw new Error('Embedding generation returned an empty result.');
        }

        results.push(result.embedding.values);
      } catch (error) {
        logger.error('Embedding generation failed for text', { error: error.message });
        // Push a zero vector to maintain array alignment
        results.push(new Array(768).fill(0));
      }
    }

    // Add delay between batches to respect rate limits
    if (i + BATCH_SIZE < texts.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return results;
}