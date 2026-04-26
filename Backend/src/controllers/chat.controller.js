import * as chatService from "../services/chat.service.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createChatController = asyncHandler(async (req, res) => {

  const { category, initialMessage } = req.body;

  if (!category || !initialMessage) {
    return res.status(400).json({
      success: false,
      message: "Category and initial message are required",
    });
  }

  const chat = await chatService.createChat(
    req.user._id,
    category,
    initialMessage
  );

  if (!chat) {
    return res.status(500).json({
      success: false,
      message: "Failed to create chat",
    });
  }

  res.status(201).json({
    success: true,
    message: "Chat created successfully",
    data: chat,
  });
});

export const getChatsController = asyncHandler(async (req, res) => {

  const chats = await chatService.getChats(req.user._id);

  if (!chats) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve chats",
    });
  }

  res.status(200).json({
    success: true,
    message: "Chats retrieved successfully",
    data: chats,
  });
});

export const getChatByIdController = asyncHandler(async (req, res) => {

  const chatId = req.params.id;

  const chat = await chatService.getChatById(chatId, req.user._id);

  if (!chat) {
    return res.status(404).json({
      success: false,
      message: "Chat not found",
    });
  } 

  res.status(200).json({
    success: true,
    message: "Chat retrieved successfully",
    data: chat,
  });
});

export const deleteChatController = asyncHandler(async (req, res) => {

  const chatId = req.params.id;

  const chat = await chatService.deleteChat(chatId, req.user._id);

  if (!chat) {
    return res.status(404).json({
      success: false,
      message: "Chat not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Chat deleted successfully",
  });
});

export const sendMessageController = asyncHandler(async (req, res) => {

  const chatId = req.params.id;
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({
      success: false,
      message: "Message is required",
    });
  }

  const response = await chatService.sendMessage(chatId, req.user._id, message);

  if (!response) {
    return res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }

  res.status(200).json({
    success: true,
    message: "Message sent successfully",
    data: response,
  });
});