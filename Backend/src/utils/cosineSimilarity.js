/**
 * Computes the cosine similarity between two numeric vectors.
 * Returns a value between -1.0 and 1.0 (where 1.0 means identical direction).
 * 
 * @param {number[]} vectorA 
 * @param {number[]} vectorB 
 * @returns {number}
 */
export default function cosineSimilarity(vectorA, vectorB) {
  if (!vectorA || !vectorB || vectorA.length !== vectorB.length) {
    return 0.0;
  }
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    normA += vectorA[i] * vectorA[i];
    normB += vectorB[i] * vectorB[i];
  }
  if (normA === 0.0 || normB === 0.0) {
    return 0.0;
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
