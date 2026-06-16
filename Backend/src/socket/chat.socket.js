import agenda from '../config/agenda.js';
import Chat from '../models/chat.model.js';
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
      if (chat.userMessageCount < minMessages) {
        await Chat.findByIdAndUpdate(chatId, { extractionStatus: 'skipped' });
        logger.extraction.info(`Skipped extraction for chat ${chatId}: userMessageCount ${chat.userMessageCount} < ${minMessages}`);
        return;
      }

      await Chat.findByIdAndUpdate(chatId, { extractionStatus: 'pending' });
      const delayMinutes = parseInt(process.env.EXTRACTION_DELAY_MINUTES) || 0;

      const jobData = {
        chatId: chat._id.toString(),
        userId: chat.userId.toString()
      };

      if (delayMinutes === 0) {
        await agenda.now('extract-memories', jobData);
        logger.extraction.info(`Scheduled immediate extraction job for chat ${chatId}`);
      } else {
        await agenda.schedule(`in ${delayMinutes} minutes`, 'extract-memories', jobData);
        logger.extraction.info(`Scheduled extraction job for chat ${chatId} in ${delayMinutes} minutes`);
      }
    } catch (error) {
      logger.extraction.error('Error handling chat:closed socket event', { chatId, error: error.message });
    }
  });
};
