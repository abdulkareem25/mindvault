import { getIo } from './server.socket.js';

/**
 * Emits a vault:updated event to a specific user's private socket room
 * @param {string} userId - ID of the user
 * @param {Array} newMemories - Array of newly created Memory documents
 */
export async function emitVaultUpdated(userId, newMemories) {
  try {
    const io = getIo();
    const payload = {
      newCount: newMemories.length,
      previews: newMemories.slice(0, 3).map(m => ({
        id: m._id ? m._id.toString() : m.id,
        content: m.content.substring(0, 80),
        category: m.category
      }))
    };
    
    io.to(`user:${userId}`).emit('vault:updated', payload);
  } catch (error) {
    console.error('Error emitting vault:updated event:', error);
  }
}
