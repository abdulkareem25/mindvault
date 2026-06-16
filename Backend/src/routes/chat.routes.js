import express from "express";
import {
  createChatController,
  deleteChatController,
  getChatByIdController,
  getChatsController,
  getMessageHistoryController,
  sendMessageAndGetResponseController,
  sendMessageAndStreamResponseController
} from "../controllers/chat.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import contextInjection from "../middlewares/contextInjection.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
  createChatSchema,
  idSchema,
  sendMessageSchema
} from "../validators/chat.validator.js";

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
  validate(createChatSchema),
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
  validate(idSchema, 'params'),
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
  validate(idSchema, 'params'),
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
  validate(sendMessageSchema),
  contextInjection,
  sendMessageAndGetResponseController
);

/**
 * @route POST /api/chats/:id/messages/stream
 * @desc Send a message and stream AI response (SSE)
 * @access Private
 * @param { id } - Chat ID
 * @body { message: String }
 * @returns { stream }
 */

router.post(
  "/:id/messages/stream",
  authMiddleware,
  validate(sendMessageSchema),
  contextInjection,
  sendMessageAndStreamResponseController
);

/**
 * @route DELETE /api/chats/:id
 * @desc Delete a specific chat by ID
 * @access Private
 * @param { id } - Chat ID
 * @returns { success: Boolean, message: String }
 */

router.delete(
  "/:id",
  authMiddleware,
  validate(idSchema, 'params'),
  deleteChatController
);

export default router;
