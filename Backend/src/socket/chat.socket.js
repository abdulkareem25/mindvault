import Chat from '../models/chat.model.js';
import agenda from '../config/agenda.js';
import logger from '../utils/logger.js';

export const chatSocket = (socket) => {
  socket.on('chat:closed', async ({ chatId }) => {
    try {
      if (!chatId) return;

      const chat = await Chat.findOne({ _id: chatId, userId: socket.userId });
      if (!chat) {
        logger.extraction.warn('Chat not found or userId mismatch in chat:closed event', { chatId, userId: socket.userId });
        return;
      }

      const minMessages = parseInt(process.env.EXTRACTION_MIN_MESSAGES) || 3;
      if (chat.messageCount < minMessages) {
        await Chat.findByIdAndUpdate(chatId, { extractionStatus: 'skipped' });
        logger.extraction.info(`Skipped extraction for chat ${chatId}: messageCount ${chat.messageCount} < ${minMessages}`);
        return;
      }

      await Chat.findByIdAndUpdate(chatId, { extractionStatus: 'pending' });
      const delayMinutes = parseInt(process.env.EXTRACTION_DELAY_MINUTES) || 5;
      
      await agenda.schedule(`in ${delayMinutes} minutes`, 'extract-memories', {
        chatId: chat._id.toString(),
        userId: chat.userId.toString()
      });

      logger.extraction.info(`Scheduled extraction job for chat ${chatId} in ${delayMinutes} minutes`);
    } catch (error) {
      logger.extraction.error('Error handling chat:closed socket event', { chatId, error: error.message });
    }
  });
};
