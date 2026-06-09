import express from "express";
import {
  getMemories,
  captureMemory,
  searchMemories,
  semanticSearchMemories,
  getStats,
  getMemoryById,
  updateMemory,
  toggleArchive,
  deleteMemory,
} from "../controllers/memory.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
  captureSchema,
  updateMemorySchema,
  deleteMemorySchema,
} from "../validators/memory.validator.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/memories - Paginated list
router.get("/", getMemories);

// POST /api/memories/capture - Capture memory (validated)
router.post("/capture", validate(captureSchema), captureMemory);

// GET /api/memories/search - Search memories
router.get("/search", searchMemories);

// GET /api/memories/semantic - Semantic search memories
router.get("/semantic", semanticSearchMemories);

// GET /api/memories/stats - Category stats counts
router.get("/stats", getStats);

// GET /api/memories/:id - Get single memory by ID
router.get("/:id", getMemoryById);

// PATCH /api/memories/:id - Update memory (validated)
router.patch("/:id", validate(updateMemorySchema), updateMemory);

// PATCH /api/memories/:id/archive - Toggle archive state
router.patch("/:id/archive", toggleArchive);

// DELETE /api/memories/:id - Hard delete memory (validated confirmation)
router.delete("/:id", validate(deleteMemorySchema), deleteMemory);

export default router;
