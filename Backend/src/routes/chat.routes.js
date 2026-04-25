import express from "express";
import { createChatController } from "../controllers/chat.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validateMiddleware from "../middlewares/validate.middleware.js";
import { createChatValidator } from "../validators/chat.validator.js";

const router = express.Router();

/**
 * @route POST /api/chats
 * @desc Create a new chat
 * @access Private
 * @body { category: String, message: String }
 * @returns { chat }
 */

router.post(
  "/",
  authMiddleware,
  createChatValidator,
  validateMiddleware,
  createChatController
);

/**
 * @route GET /api/chats
 * @desc Get all chats for the authenticated user
 * @access Private
 * @returns { chats[] }
 */

// router.get(
//   "/",
//   authMiddleware,
//   getChatsController
// );

export default router;
