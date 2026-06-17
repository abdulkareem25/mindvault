import agenda from '../config/agenda.js';
import { updateUserMemorySummary } from '../controllers/memory.controller.js';
import Chat from '../models/chat.model.js';
import Memory from '../models/Memory.js';
import Message from '../models/message.model.js';
import * as vaultSocket from '../socket/vault.socket.js';
import logger from '../utils/logger.js';
import * as aiService from './ai.service.js';
import * as embeddingService from './embedding.service.js';
import * as searchService from './search.service.js';

/**
 * Validates the structure and content of an extracted memory node.
 * @param {Object} node - The memory node to validate
 * @returns {boolean} - True if the node is valid, false otherwise
*/
function validateNode(node) {
  const validCategories = ['coding', 'deen', 'admin', 'life'];
  const validTypes = ['decision', 'preference', 'learning', 'goal', 'fact'];
  const validConfidence = ['high', 'medium', 'low'];

  return (
    node &&
    typeof node.content === 'string' &&
    node.content.length > 0 &&
    node.content.length <= 500 &&
    validCategories.includes(node.category) &&
    validTypes.includes(node.type) &&
    validConfidence.includes(node.confidence)
  );
}

/**
 * Main background pipeline to extract memory nodes from a completed chat conversation.
 * @param {Object} params - Extraction parameters
 * @param {string} params.chatId - ID of the Chat
 * @param {string} params.userId - ID of the User
*/ 
export async function extractFromChat({ chatId, userId }) {
  // 1. Guard: verify status is not already processing/completed
  const chat = await Chat.findById(chatId);
  if (!chat) {
    logger.extraction.warn('Chat not found on extraction job', { chatId });
    return;
  }

  if (['processing', 'completed'].includes(chat.extractionStatus)) {
    logger.extraction.info(`Extraction already ${chat.extractionStatus} for chat ${chatId}`);
    return;
  }

  if (chat.userId.toString() !== userId) {
    logger.extraction.error('UserId mismatch on extraction job', { chatUserId: chat.userId, jobUserId: userId });
    return;
  }

  // 2. Set status to processing and increment attempts
  await Chat.findByIdAndUpdate(chatId, {
    extractionStatus: 'processing',
    $inc: { extractionAttempts: 1 }
  });

  try {
    // 3. Fetch conversation messages
    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });

    // 4. Call AI to extract memory nodes
    const rawNodes = await aiService.extractMemories({ messages });

    // 5. Validate and filter nodes
    const validNodes = Array.isArray(rawNodes) ? rawNodes.filter(node => validateNode(node)) : [];

    // Log the validation results
    logger.extraction.info(`Extracted ${rawNodes ? rawNodes.length : 0} nodes from chat ${chatId}, ${validNodes.length} were valid.`);

    // 6. Write valid nodes to the vault database
    const createdMemories = [];
    for (const node of validNodes) {
      let embedding = null;
      try {
        embedding = await embeddingService.generateEmbedding(node.content);
      } catch (err) {
        logger.error('Embedding generation failed during extraction, skipping similarity check', { content: node.content, error: err.message });
      }

      if (embedding) {
        const similarMemories = await searchService.findSimilar({
          userId,
          embedding,
          category: node.category,
          threshold: parseFloat(process.env.SIMILARITY_WARN_THRESHOLD) || 0.75
        });

        const mergeThreshold = parseFloat(process.env.SIMILARITY_MERGE_THRESHOLD) || 0.90;
        const topSimilar = similarMemories[0];

        if (topSimilar && topSimilar.score >= mergeThreshold) {
          // Merge: increment reinforcement count, do not create new
          await Memory.findByIdAndUpdate(topSimilar.memory._id, {
            $inc: { reinforcementCount: 1 },
            updatedAt: new Date()
          });
          logger.extraction.info('Memory reinforced', { memoryId: topSimilar.memory._id, score: topSimilar.score });
          continue;
        }

        const isPossibleDuplicate = topSimilar && topSimilar.score >= 0.75;

        const memory = await Memory.create({
          userId,
          content: node.content,
          category: node.category,
          type: node.type,
          confidence: node.confidence,
          tags: node.tags || [],
          sourceChatId: chatId,
          source: 'extraction',
          embedding,
          isPossibleDuplicate,
          possibleDuplicateOf: isPossibleDuplicate ? topSimilar.memory._id : null
        });
        createdMemories.push(memory);
      } else {
        // No embedding: skip similarity check and create memory
        const memory = await Memory.create({
          userId,
          content: node.content,
          category: node.category,
          type: node.type,
          confidence: node.confidence,
          tags: node.tags || [],
          sourceChatId: chatId,
          source: 'extraction',
          embedding: null,
          isPossibleDuplicate: false,
          possibleDuplicateOf: null
        });
        createdMemories.push(memory);
      }
    }

    // 7. Update user memorySummary statistics
    await updateUserMemorySummary(userId);

    // 8. Mark chat extraction as complete
    await Chat.findByIdAndUpdate(chatId, {
      extractionStatus: 'completed',
      extractionCompletedAt: new Date(),
      lastExtractionAt: new Date()
    });

    // 9. Emit vault:updated notification to client if new memories were saved
    if (createdMemories.length > 0) {
      await vaultSocket.emitVaultUpdated(userId, createdMemories);
    } else {
      logger.extraction.info(`No memories were created for chat ${chatId}`);
    }

  } catch (error) {
    logger.extraction.error('Extraction failed', { chatId, error: error.message });

    // Get updated attempts count
    const currentChat = await Chat.findById(chatId);
    const attempts = currentChat ? currentChat.extractionAttempts : 1;
    const newStatus = attempts >= 3 ? 'failed' : 'pending';

    await Chat.findByIdAndUpdate(chatId, { extractionStatus: newStatus });

    // Retry once after 30 seconds if under maximum attempts
    if (attempts < 3) {
      logger.extraction.info(`Scheduling retry for chat ${chatId} in 30 seconds (Attempt ${attempts + 1}/3)`);
      await agenda.schedule('in 30 seconds', 'extract-memories', { chatId, userId });
    } else {
      logger.extraction.error(`Max extraction attempts reached for chat ${chatId}. Status set to failed.`);
    }
  }
}