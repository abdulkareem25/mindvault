import mongoose from "mongoose";
import Memory from "../models/Memory.js";
import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { classifyCapture } from "../services/ai.service.js";
import * as embeddingService from "../services/embedding.service.js";
import * as searchService from "../services/search.service.js";

/**
 * Updates the user's memory summary by grouping all non-archived memories
 * of the user by category and counting them.
 */
export const updateUserMemorySummary = async (userId) => {
  const stats = await Memory.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        isArchived: false,
      },
    },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
  ]);

  const summary = { coding: 0, deen: 0, admin: 0, life: 0 };
  stats.forEach((stat) => {
    if (stat._id in summary) {
      summary[stat._id] = stat.count;
    }
  });

  await User.findByIdAndUpdate(userId, { memorySummary: summary });
  return summary;
};

/**
 * Get memories for the authenticated user, supporting optional pagination
 * and filtering by category, type, and isArchived status.
 */
export const getMemories = asyncHandler(async (req, res) => {
  const { category, type, isArchived, page = 1, limit = 20 } = req.query;

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 20;
  const skip = (pageNum - 1) * limitNum;

  const filter = { userId: req.user._id };

  if (category && category !== "all") {
    filter.category = category;
  }
  if (type && type !== "all") {
    filter.type = type;
  }
  if (isArchived !== undefined) {
    filter.isArchived = isArchived === "true" || isArchived === true;
  } else {
    filter.isArchived = false;
  }

  const total = await Memory.countDocuments(filter);
  const memories = await Memory.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const pages = Math.ceil(total / limitNum) || 1;

  res.status(200).json({
    memories,
    total,
    page: pageNum,
    pages,
  });
});

/**
 * Captures (creates) a new memory for the authenticated user.
 */
export const captureMemory = asyncHandler(async (req, res) => {
  const { content, category, type, tags, source, confidence } = req.body;

  if (!category) {
    const classification = await classifyCapture({ content });
    return res.status(200).json({ classification });
  }

  const memory = await Memory.create({
    userId: req.user._id,
    content,
    category: category || "life",
    type: type || "fact",
    tags: tags || [],
    source: source || "quick_capture",
    confidence: confidence || "medium",
  });

  await updateUserMemorySummary(req.user._id);

  // Fire async embedding generation (non-blocking)
  setImmediate(async () => {
    try {
      const embedding = await embeddingService.generateEmbedding(memory.content);
      await Memory.findByIdAndUpdate(memory._id, { embedding });
    } catch (err) {
      console.error('Embedding generation failed for quick capture:', { memoryId: memory._id, error: err.message });
    }
  });

  res.status(201).json(memory);
});

/**
 * Searches the user's memories using semantic or keyword search based on feature flag.
 */
export const searchMemories = asyncHandler(async (req, res) => {
  const { q, category, type } = req.query;
  
  if (!q) {
    return res.status(200).json({ memories: [] });
  }

  const useSemanticSearch = process.env.VITE_ENABLE_SEMANTIC_SEARCH === 'true';

  const results = useSemanticSearch
    ? await searchService.semanticSearch({ userId: req.user._id, query: q, category, type })
    : await searchService.keywordSearch({ userId: req.user._id, query: q, category, type });

  res.status(200).json({ memories: results });
});

/**
 * Performs semantic search using vector embeddings and cosine similarity.
 */
export const semanticSearchMemories = asyncHandler(async (req, res) => {
  const { q, category, type } = req.query;
  
  if (!q) {
    return res.status(200).json({ memories: [] });
  }

  const results = await searchService.semanticSearch({ userId: req.user._id, query: q, category, type });
  res.status(200).json({ memories: results });
});

/**
 * Gets memory statistics (counts of non-archived memories per category)
 * and syncs them to the User document.
 */
export const getStats = asyncHandler(async (req, res) => {
  const summary = await updateUserMemorySummary(req.user._id);
  res.status(200).json(summary);
});

/**
 * Retrieves a single memory by ID for the authenticated user.
 */
export const getMemoryById = asyncHandler(async (req, res) => {
  const memory = await Memory.findOne({ _id: req.params.id, userId: req.user._id });
  if (!memory) {
    return res.status(404).json({ success: false, message: "Memory not found" });
  }
  res.status(200).json(memory);
});

/**
 * Updates a memory by ID.
 */
export const updateMemory = asyncHandler(async (req, res) => {
  const memory = await Memory.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!memory) {
    return res.status(404).json({ success: false, message: "Memory not found" });
  }
  await updateUserMemorySummary(req.user._id);
  res.status(200).json(memory);
});

/**
 * Toggles the archived status of a memory.
 */
export const toggleArchive = asyncHandler(async (req, res) => {
  const memory = await Memory.findOne({ _id: req.params.id, userId: req.user._id });
  if (!memory) {
    return res.status(404).json({ success: false, message: "Memory not found" });
  }
  memory.isArchived = !memory.isArchived;
  await memory.save();
  await updateUserMemorySummary(req.user._id);
  res.status(200).json(memory);
});

/**
 * Deletes a memory by ID (requires confirmation in the body).
 */
export const deleteMemory = asyncHandler(async (req, res) => {
  if (!req.body || req.body.confirm !== true) {
    return res.status(400).json({ success: false, message: "Confirmation required to delete memory" });
  }
  const memory = await Memory.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!memory) {
    return res.status(404).json({ success: false, message: "Memory not found" });
  }
  await updateUserMemorySummary(req.user._id);
  res.status(200).json({ success: true, message: "Memory deleted successfully" });
});
