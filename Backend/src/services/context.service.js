import Memory from '../models/Memory.js';

/**
 * Retrieves memories for a user in a specific category with a token limit.
 * 
 * @param {Object} params
 * @param {string} params.userId - The user's ID
 * @param {string} params.category - The memory category (coding, deen, admin, life)
 * @param {number} [params.limit=5] - Maximum number of memories to return
 * @param {number} [params.maxTokens=1000] - Hard cap on token budget
 * @returns {Promise<Array>} List of relevant memories
 */
export async function getRelevantMemories({ userId, category, limit = 5, maxTokens = 1000 }) {
  if (category === 'global') {
    const allCategories = ['coding', 'deen', 'admin', 'life'];
    const results = [];
    for (const cat of allCategories) {
      const mems = await Memory.find({ userId, category: cat, isArchived: false })
        .sort({ createdAt: -1 }).limit(2);
      results.push(...mems);
    }
    return results;
  }

  // Phase 1: Recency-based retrieval (semantic ranking is Phase 2)
  const memories = await Memory.find({
    userId,
    category,
    isArchived: false,
    embedding: null // In Phase 1, only memories without embeddings (all of them)
  })
  .sort({ createdAt: -1 })
  .limit(limit * 2); // Fetch more than needed to allow token filtering

  // Apply token budget
  const selected = [];
  let tokenCount = 0;
  for (const memory of memories) {
    const approxTokens = Math.ceil(memory.content.length / 4);
    if (tokenCount + approxTokens > maxTokens) break;
    selected.push(memory);
    tokenCount += approxTokens;
    if (selected.length >= limit) break;
  }

  return selected;
}
