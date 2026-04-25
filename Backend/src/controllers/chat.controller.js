import * as chatService from "../services/chat.service.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createChatController = asyncHandler(async (req, res) => {

  const { category, initialMessage } = req.body;

  const chat = await chatService.createChat(
    req.user._id,
    category,
    initialMessage
  );

  res.status(201).json(chat);
});