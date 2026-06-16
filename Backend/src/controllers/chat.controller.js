import Chat from "../models/chat.model.js";
import { generateAIResponse, generateChatTitle } from "../services/ai.service.js";
import * as chatService from "../services/chat.service.js";
import * as contextService from "../services/context.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import * as prompts from "../utils/prompts.js";

export const createChatController = asyncHandler(async (req, res) => {

  const { category, initialMessage } = req.body;

  if (!category || !initialMessage) {
    return res.status(400).json({
      success: false,
      message: "Category and initial message are required",
    });
  }

  // Inject context from relevant vault memories on first message
  let contextPrefix = null;
  let injectedMemoryIds = [];
  let injectedMemories = [];

  try {
    const memories = await contextService.getRelevantMemories({
      userId: req.user._id,
      category,
      limit: parseInt(process.env.CONTEXT_MAX_MEMORIES) || 5,
      maxTokens: parseInt(process.env.CONTEXT_MAX_TOKENS) || 1000
    });

    if (memories && memories.length > 0) {
      contextPrefix = prompts.CONTEXT_PREFIX(memories);
      injectedMemoryIds = memories.map(m => m._id);
      injectedMemories = memories.map(m => ({
        _id: m._id,
        content: m.content,
        category: m.category,
        type: m.type
      }));
    }
  } catch (error) {
    console.error('Context injection failed during chat creation:', error);
    // Don't fail the chat creation if context injection fails
  }

  const chat = await chatService.createChat(
    req.user._id,
    category,
    initialMessage,
    contextPrefix,
    injectedMemoryIds
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
    injectedMemories
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
  const { page, limit } = req.query;

  const result = await chatService.getMessageHistory(chatId, req.user._id, page, limit);

  if (!result) {
    return res.status(404).json({
      success: false,
      message: "Chat not found",
    });
  }

  // If page and limit were not requested, send flat array for backward compatibility
  if (page === undefined && limit === undefined) {
    return res.status(200).json({
      success: true,
      message: "Message history retrieved successfully",
      data: result.messages,
    });
  }

  res.status(200).json({
    success: true,
    message: "Message history retrieved successfully",
    data: result,
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
  await Chat.findByIdAndUpdate(chatId, {
    $inc: { messageCount: 1, userMessageCount: 1 },
    lastUserMessageAt: new Date()
  });

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

export const sendMessageAndStreamResponseController = asyncHandler(async (req, res) => {

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
  await Chat.findByIdAndUpdate(chatId, {
    $inc: { messageCount: 1, userMessageCount: 1 },
    lastUserMessageAt: new Date()
  });

  // Get updated chat history to pass to AI
  const updatedChat = await Chat.findById(chatId).populate("messages");

  // Set SSE headers for streaming
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  // CORS is handled by app-level middleware, don't set it here

  // Accept optional contextPrefix
  const contextPrefix = req.contextPrefix || null;

  // Generate AI response (streams internally in OpenAI SDK)
  const aiResponseText = await generateAIResponse(updatedChat.messages, chat.category, contextPrefix);

  // Stream the response token by token
  const tokens = aiResponseText.split(/(\s+)/);
  let fullResponse = '';

  for (const token of tokens) {
    fullResponse += token;
    // Send token as SSE
    res.write(`data: ${JSON.stringify({ token, fullResponse })}\n\n`);

    // Small delay to simulate typing for demo purposes
    await new Promise(r => setTimeout(r, 5));
  }

  // Save AI message after streaming completes
  const savedAiMessage = await chatService.addMessageToChat(chatId, "assistant", fullResponse);
  await Chat.findByIdAndUpdate(chatId, { $inc: { messageCount: 1 } });

  // Send completion signal with saved message data
  res.write(`data: ${JSON.stringify({ done: true, message: savedAiMessage })}\n\n`);

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

  res.end();
});