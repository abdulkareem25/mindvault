/**
 * Approximates token count for English text.
 * Rule of thumb: 1 token ≈ 4 characters.
 * 
 * @param {string} text 
 * @returns {number}
 */
export default function countTokens(text) {
  if (!text || typeof text !== 'string') {
    return 0;
  }
  return Math.ceil(text.length / 4);
}
