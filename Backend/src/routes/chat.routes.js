import express from "express";
import { createChatController, getChatByIdController, getChatsController, getMessageHistoryController, sendMessageAndGetResponseController } from "../controllers/chat.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validateMiddleware from "../middlewares/validate.middleware.js";
import { createChatValidator, idValidator, sendMessageValidator } from "../validators/chat.validator.js";

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

router.get(
  "/",
  authMiddleware,
  getChatsController
);

/**
 * @route GET /api/chats/:id
 * @desc Get a specific chat by ID
 * @access Private
 * @param { id } - Chat ID
 * @returns { chat }
 */

router.get(
  "/:id",
  authMiddleware,
  idValidator,
  validateMiddleware,
  getChatByIdController
);

/**
 * @route GET /api/chats/:id/messages
 * @desc Get message history for a specific chat
 * @access Private
 * @param { id } - Chat ID
 * @returns { messages[] }
 */

router.get(
  "/:id/messages",
  authMiddleware,
  idValidator,
  validateMiddleware,
  getMessageHistoryController
);

/**
 * @route POST /api/chats/:id/messages
 * @desc Send a message in a specific chat and get AI response
 * @access Private
 * @param { id } - Chat ID
 * @body { message: String }
 * @returns { response }
 */

router.post(
  "/:id/messages",
  authMiddleware,
  sendMessageValidator,
  validateMiddleware,
  sendMessageAndGetResponseController
);

export default router;
