import Digest from '../models/Digest.js';
import Memory from '../models/Memory.js';
import Chat from '../models/chat.model.js';
import { generateDigest } from './ai.service.js';
import logger from '../utils/logger.js';

export const checkAndScheduleDigest = async (userId) => {
  try {
    const latestDigest = await Digest.findOne({ userId }).sort({ createdAt: -1 });
    
    let shouldCheckMemories = false;
    if (!latestDigest) {
      shouldCheckMemories = true;
    } else {
      const daysDiff = (Date.now() - new Date(latestDigest.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      if (daysDiff > 7) {
        shouldCheckMemories = true;
      }
    }
    
    if (shouldCheckMemories) {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const memoryCount = await Memory.countDocuments({
        userId,
        createdAt: { $gte: sevenDaysAgo }
      });
      
      if (memoryCount >= 3) {
        logger.info(`Triggering digest generation check passed for user ${userId} (memoryCount: ${memoryCount})`);
        const agenda = (await import('../config/agenda.js')).default;
        await agenda.now('generate-digest', { userId });
      }
    }
  } catch (error) {
    logger.error(`Error in checkAndScheduleDigest for user ${userId}:`, error);
  }
};

export const generateAndSaveDigest = async ({ userId }) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const recentMemories = await Memory.find({
      userId,
      createdAt: { $gte: sevenDaysAgo }
    });
    
    const recentChats = await Chat.find({
      userId,
      lastMessageAt: { $gte: sevenDaysAgo }
    });
    
    logger.info(`Generating digest for user ${userId} using ${recentMemories.length} memories and ${recentChats.length} chats`);
    
    const content = await generateDigest({ recentMemories, recentChats });
    
    const digest = await Digest.create({
      userId,
      content,
      weekStartDate: sevenDaysAgo,
      isRead: false,
      isDismissed: false
    });
    
    logger.info(`Successfully saved weekly digest ${digest._id} for user ${userId}`);
    return digest;
  } catch (error) {
    logger.error(`Error in generateAndSaveDigest for user ${userId}:`, error);
    throw error;
  }
};
