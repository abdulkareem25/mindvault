import * as chatService from "../services/chat.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import Chat from "../models/chat.model.js";
import { generateAIResponse, generateChatTitle } from "../services/ai.service.js";

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

export const getMessageHistoryController = asyncHandler(async (req, res) => {

  const chatId = req.params.id;
  const messages = await chatService.getMessageHistory(chatId, req.user._id);

  if (!messages) {
    return res.status(404).json({
      success: false,
      message: "Chat not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Message history retrieved successfully",
    data: messages,
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

export const sendMessageAndGetResponseController = asyncHandler(async (req, res) => {

  const chatId = req.params.id;
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({
      success: false,
      message: "Content is required",
    });
  }

  const chat = await Chat.findOne({ _id: chatId, userId: req.user._id });
  if (!chat) {
    return res.status(404).json({
      success: false,
      message: "Chat not found",
    });
  }

  const isFirstMessage = (chat.messageCount === 0);

  // After saving user message:
  await chatService.addMessageToChat(chatId, "user", content);
  await Chat.findByIdAndUpdate(chatId, { $inc: { messageCount: 1 } });

  // Get updated chat history to pass to AI
  const updatedChat = await Chat.findById(chatId).populate("messages");

  // Accept optional contextPrefix from req.contextPrefix
  const contextPrefix = req.contextPrefix || null;
  const aiResponseText = await generateAIResponse(updatedChat.messages, chat.category, contextPrefix);

  // Save AI message:
  const savedAiMessage = await chatService.addMessageToChat(chatId, "assistant", aiResponseText);
  await Chat.findByIdAndUpdate(chatId, { $inc: { messageCount: 1 } });

  // Asynchronously generate chat title (first message only):
  if (isFirstMessage) {
    generateChatTitle({ firstMessage: content, category: chat.category })
      .then(async (title) => {
        await Chat.findByIdAndUpdate(chatId, { title });
      })
      .catch((err) => {
        console.error("Failed to generate chat title asynchronously:", err);
      });
  }

  // After AI responds (first message only):
  if (req.injectedMemoryIds && req.injectedMemoryIds.length > 0) {
    await Chat.findByIdAndUpdate(chatId, {
      injectedMemoryIds: req.injectedMemoryIds
    });
  }

  // Response format (first message/all):
  return res.json({
    message: savedAiMessage,
    injectedMemories: req.injectedMemories || []
  });
});