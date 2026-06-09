import dotenv from 'dotenv';

// Load environment variables before any other imports
const nodeEnv = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${nodeEnv}` });

// Dynamic imports to ensure process.env variables are initialized prior to loading config files
const mongoose = (await import('mongoose')).default;
const Chat = (await import('../models/chat.model.js')).default;
const Message = (await import('../models/message.model.js')).default;
const agenda = (await import('../config/agenda.js')).default;
const logger = (await import('../utils/logger.js')).default;

/**
 * Main migration script to process existing v1 chats through the memory extraction pipeline.
 * Usage: node src/scripts/retroactiveExtraction.js [--limit=20] [--userId=<id>] [--execute]
 */
async function run() {
  const args = process.argv.slice(2);
  const LIMIT = parseInt(args.find(a => a.startsWith('--limit='))?.split('=')[1]) || 20;
  const TARGET_USER = args.find(a => a.startsWith('--userId='))?.split('=')[1];
  const EXECUTE = args.includes('--execute');

  console.log(EXECUTE ? "Running in EXECUTE mode (writes will be performed)..." : "Running in DRY-RUN mode (no writes will be performed). Use --execute to actually run.");

  try {
    const mongoUri = process.env.MONGODB_URI || process.env.DB_URI;
    if (!mongoUri) {
      throw new Error('Database URI (MONGODB_URI or DB_URI) is not defined in environment variables');
    }

    await mongoose.connect(mongoUri);
    logger.info('Connected to MongoDB');

    if (TARGET_USER && !mongoose.Types.ObjectId.isValid(TARGET_USER)) {
      throw new Error(`Invalid userId format: ${TARGET_USER}`);
    }

    // Step 1: Fix messageCount for chats where it's 0 or missing, but messages exist.
    const messageCountFilter = {
      $or: [
        { messageCount: { $exists: false } },
        { messageCount: { $lte: 0 } }
      ]
    };
    if (TARGET_USER) {
      messageCountFilter.userId = new mongoose.Types.ObjectId(TARGET_USER);
    }

    const chatsNeedingCount = await Chat.find(messageCountFilter);
    console.log(`Found ${chatsNeedingCount.length} chats needing messageCount check/fix`);

    const simulatedCounts = new Map();

    for (const chat of chatsNeedingCount) {
      const count = await Message.countDocuments({ chatId: chat._id });
      simulatedCounts.set(chat._id.toString(), count);

      if (EXECUTE) {
        await Chat.findByIdAndUpdate(chat._id, { messageCount: count });
        console.log(`Fixed messageCount to ${count} for chat ${chat._id}`);
      } else {
        console.log(`[Dry Run] Would fix messageCount to ${count} for chat ${chat._id}`);
      }
    }

    // Step 2: Retroactive Extraction.
    const minMessages = parseInt(process.env.EXTRACTION_MIN_MESSAGES) || 3;
    let chatsToProcess = [];

    if (EXECUTE) {
      const filter = {
        $or: [
          { extractionStatus: 'pending' },
          { extractionStatus: { $exists: false } }
        ],
        messageCount: { $gte: minMessages }
      };
      if (TARGET_USER) {
        filter.userId = new mongoose.Types.ObjectId(TARGET_USER);
      }

      chatsToProcess = await Chat.find(filter)
        .sort({ createdAt: -1 })
        .limit(LIMIT);
    } else {
      const filter = {
        $or: [
          { extractionStatus: 'pending' },
          { extractionStatus: { $exists: false } }
        ]
      };
      if (TARGET_USER) {
        filter.userId = new mongoose.Types.ObjectId(TARGET_USER);
      }

      // Fetch candidates sorted by createdAt: -1 and process until LIMIT is satisfied
      const candidates = await Chat.find(filter).sort({ createdAt: -1 });
      for (const chat of candidates) {
        if (chatsToProcess.length >= LIMIT) break;
        let count = chat.messageCount;
        if (count === undefined || count === null || count <= 0) {
          count = simulatedCounts.get(chat._id.toString()) || 0;
        }
        if (count >= minMessages) {
          chatsToProcess.push(chat);
        }
      }
    }

    console.log(`Found ${chatsToProcess.length} chats to process (LIMIT = ${LIMIT})`);

    // Step 3: Schedule/process the chats.
    for (let i = 0; i < chatsToProcess.length; i++) {
      const chat = chatsToProcess[i];
      let messageCount = chat.messageCount;
      if (messageCount === undefined || messageCount === null || messageCount <= 0) {
        messageCount = simulatedCounts.get(chat._id.toString()) || 0;
      }
      
      if (EXECUTE) {
        console.log(`Processing chat ${i + 1}/${chatsToProcess.length}: ${chat._id} (User: ${chat.userId}, messageCount: ${messageCount})`);
        
        await agenda.schedule('now', 'extract-memories', {
          chatId: chat._id.toString(),
          userId: chat.userId.toString()
        });

        // Stagger by 10 seconds to avoid API rate limits
        if (i < chatsToProcess.length - 1) {
          console.log(`Staggering for 10 seconds...`);
          await new Promise(resolve => setTimeout(resolve, 10000));
        }
      } else {
        console.log(`[Dry Run] Would schedule extraction for chat ${chat._id} (User: ${chat.userId}, messageCount: ${messageCount})`);
      }
    }

    console.log("Migration script execution completed successfully.");

  } catch (error) {
    logger.error('Retroactive extraction migration failed', { error: error.message });
    console.error('Migration failed:', error);
  } finally {
    try {
      await mongoose.disconnect();
      logger.info('Disconnected from MongoDB');
    } catch (err) {
      console.error('Error disconnecting Mongoose:', err);
    }
    
    try {
      if (agenda && typeof agenda.close === 'function') {
        await agenda.close();
        logger.info('Closed Agenda connection');
      }
    } catch (err) {
      console.error('Error closing Agenda:', err);
    }
    process.exit(0);
  }
}

run();
