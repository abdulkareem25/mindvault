import Memory from '../models/Memory.js';
import * as embeddingService from './embedding.service.js';
import cosineSimilarity from '../utils/cosineSimilarity.js';
import logger from '../utils/logger.js';

/**
 * Performs semantic search using vector embeddings and cosine similarity.
 * @param {Object} params - Search parameters
 * @param {string} params.userId - User ID to search memories for
 * @param {string} params.query - Search query text
 * @param {number} params.limit - Maximum number of results (default: 10)
 * @param {string} params.category - Optional category filter
 * @param {string} params.type - Optional type filter
 * @returns {Promise<Array>} - Array of memories with similarity scores
 */
export async function semanticSearch({ userId, query, limit = 10, category = null, type = null }) {
  // 1. Generate query embedding
  const queryEmbedding = await embeddingService.generateEmbedding(query);

  // 2. Fetch all non-archived user memories WITH embeddings
  const filter = { userId, isArchived: false, embedding: { $ne: null } };
  if (category && category !== 'all') filter.category = category;
  if (type && type !== 'all') filter.type = type;

  const memories = await Memory.find(filter);

  // 3. Handle case where no memories with embeddings exist
  if (memories.length === 0) {
    return [];
  }

  // 4. Compute cosine similarity for each memory
  const scored = memories.map(m => ({
    memory: m,
    score: cosineSimilarity(queryEmbedding, m.embedding)
  }));

  // 5. Sort descending by score, return top `limit` results
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ memory, score }) => ({ ...memory.toObject(), score }));
}

/**
 * Performs keyword-based search using regex matching.
 * @param {Object} params - Search parameters
 * @param {string} params.userId - User ID to search memories for
 * @param {string} params.query - Search query text
 * @param {string} params.category - Optional category filter
 * @param {string} params.type - Optional type filter
 * @returns {Promise<Array>} - Array of matching memories
 */
export async function keywordSearch({ userId, query, category = null, type = null }) {
  const filter = {
    userId,
    isArchived: false,
    content: { $regex: query, $options: 'i' }
  };
  if (category && category !== 'all') filter.category = category;
  if (type && type !== 'all') filter.type = type;

  return Memory.find(filter).sort({ createdAt: -1 }).limit(20);
}