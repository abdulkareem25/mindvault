import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Memory from '../models/Memory.js';
import * as embeddingService from '../services/embedding.service.js';
import logger from '../utils/logger.js';

// Load environment variables
const envFile = `.env.${process.env.NODE_ENV}`;
dotenv.config({ path: envFile });

/**
 * Migration script to generate embeddings for all existing memories.
 * Run ONCE after deploying Phase 2: node src/scripts/migrateEmbeddings.js
 */
async function migrateEmbeddings() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI environment variable is not set');
    }
    
    await mongoose.connect(mongoUri);
    logger.info('Connected to MongoDB');

    // Find all memories without embeddings
    const memoriesWithoutEmbeddings = await Memory.find({ embedding: null });
    logger.info(`Found ${memoriesWithoutEmbeddings.length} memories to embed`);

    if (memoriesWithoutEmbeddings.length === 0) {
      logger.info('No memories need embedding. Migration complete.');
      await mongoose.disconnect();
      return;
    }

    // Extract texts from memories
    const texts = memoriesWithoutEmbeddings.map(m => m.content);
    
    // Generate embeddings in batches
    logger.info('Generating embeddings...');
    const embeddings = await embeddingService.batchGenerateEmbeddings(texts);
    
    // Update memories with their embeddings
    let updatedCount = 0;
    for (let i = 0; i < memoriesWithoutEmbeddings.length; i++) {
      try {
        await Memory.findByIdAndUpdate(memoriesWithoutEmbeddings[i]._id, {
          embedding: embeddings[i]
        });
        updatedCount++;
        
        // Log progress every 100 memories
        if (updatedCount % 100 === 0) {
          logger.info(`Updated ${updatedCount}/${memoriesWithoutEmbeddings.length} memories`);
        }
      } catch (error) {
        logger.error('Failed to update memory embedding', {
          memoryId: memoriesWithoutEmbeddings[i]._id,
          error: error.message
        });
      }
    }

    logger.info(`Migration complete. Updated ${updatedCount}/${memoriesWithoutEmbeddings.length} memories`);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
    
  } catch (error) {
    logger.error('Migration failed', { error: error.message });
    process.exit(1);
  }
}

// Run the migration
migrateEmbeddings();