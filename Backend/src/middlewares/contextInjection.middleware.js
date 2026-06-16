import Chat from '../models/chat.model.js';
import * as contextService from '../services/context.service.js';
import logger from '../utils/logger.js';
import * as prompts from '../utils/prompts.js';

async function contextInjection(req, res, next) {
  try {
    // Securely query using userId to ensure user owns the chat
    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user._id });
    if (!chat) return next();

    // Only inject on the FIRST user message of the conversation
    if (chat.userMessageCount !== 0) {
      req.contextPrefix = null;
      req.injectedMemoryIds = [];
      req.injectedMemories = [];
      return next();
    }

    const memories = await contextService.getRelevantMemories({
      userId: req.user._id,
      category: chat.category,
      limit: parseInt(process.env.CONTEXT_MAX_MEMORIES) || 5,
      maxTokens: parseInt(process.env.CONTEXT_MAX_TOKENS) || 1000
    });

    if (memories.length === 0) {
      req.contextPrefix = null;
      req.injectedMemoryIds = [];
      req.injectedMemories = [];
      return next();
    }

    req.contextPrefix = prompts.CONTEXT_PREFIX(memories);
    req.injectedMemoryIds = memories.map(m => m._id);
    req.injectedMemories = memories.map(m => ({
      _id: m._id, content: m.content, category: m.category, type: m.type
    }));

    next();
  } catch (error) {
    // Context injection failure must NEVER block message sending
    logger.context.error('Context injection failed', { error: error.message });
    req.contextPrefix = null;
    req.injectedMemoryIds = [];
    req.injectedMemories = [];
    next();
  }
}

export default contextInjection;
