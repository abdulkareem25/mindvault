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
      const now = new Date();

      // Check 1: Must have at least minimum user messages
      if (chat.userMessageCount < minMessages) {
        logger.extraction.info(`Skipped extraction for chat ${chatId}: userMessageCount ${chat.userMessageCount} < ${minMessages}`);
        return;
      }

      // Check 2: Prevent duplicate extraction jobs (only check if already triggered)
      if (chat.extractionTriggeredAt) {
        const timeSinceLastTrigger = now.getTime() - chat.extractionTriggeredAt.getTime();
        const MIN_RETRY_INTERVAL = 5 * 60 * 1000; // 5 minute minimum between retry attempts
        if (timeSinceLastTrigger < MIN_RETRY_INTERVAL) {
          logger.extraction.info(`Skipped extraction for chat ${chatId}: Extraction already triggered ${Math.round(timeSinceLastTrigger / 1000)}s ago`);
          return;
        }
      }

      // All conditions met — schedule extraction
      await Chat.findByIdAndUpdate(chatId, {
        extractionStatus: 'pending',
        extractionTriggeredAt: now
      });

      const jobData = {
        chatId: chat._id.toString(),
        userId: chat.userId.toString()
      };

      const delayMinutes = parseInt(process.env.EXTRACTION_DELAY_MINUTES) || 0;

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
