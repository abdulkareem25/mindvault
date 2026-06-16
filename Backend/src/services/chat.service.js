import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import { generateAIResponse, generateChatTitle, generateInitialAIResponse } from "./ai.service.js";

export const createChat = async (userId, category, initialMessage, contextPrefix = null, injectedMemoryIds = []) => {

  const title = await generateChatTitle({ firstMessage: initialMessage, category });

  const chat = await Chat.create({
    userId,
    category,
    title,
    injectedMemoryIds
  });

  await addMessageToChat(chat._id, "user", initialMessage);
  await Chat.findByIdAndUpdate(chat._id, { $inc: { messageCount: 1, userMessageCount: 1 } });

  const response = await generateInitialAIResponse(initialMessage, category, contextPrefix);

  await addMessageToChat(chat._id, "assistant", response);
  await Chat.findByIdAndUpdate(chat._id, { $inc: { messageCount: 1 } });

  return chat.populate("messages");
};

export const getChats = async (userId) => {
  const chats = await Chat.find({ userId })
    .populate("injectedMemoryIds")
    .sort({ lastMessageAt: -1 });
  return chats;
};

export const getChatById = async (chatId, userId) => {
  const chat = await Chat.findOne({ _id: chatId, userId })
    .populate("messages")
    .populate("injectedMemoryIds");
  return chat;
};

export const getMessageHistory = async (chatId, userId) => {
  const chat = await Chat.findOne({ _id: chatId, userId }).populate("messages");
  if (!chat) {
    throw new Error("Chat not found");
  }
  return chat.messages;
};

export const deleteChat = async (chatId, userId) => {
  const chat = await Chat.findOneAndDelete({ _id: chatId, userId });
  if (chat) {
    await Message.deleteMany({ chatId: chat._id });
  }
  return chat;
};

export const sendMessage = async (chatId, userId, message) => {

  const chat = await Chat.findOne({ _id: chatId, userId });

  if (!chat) {
    throw new Error("Chat not found");
  }

  await addMessageToChat(chatId, "user", message);
  await Chat.findByIdAndUpdate(chatId, { $inc: { messageCount: 1 } });

  const updatedChat = await Chat.findById(chatId).populate("messages");

  const response = await generateAIResponse(updatedChat.messages, chat.category);

  await addMessageToChat(chatId, "assistant", response);
  await Chat.findByIdAndUpdate(chatId, { $inc: { messageCount: 1 } });

  return response;
};

export const addMessageToChat = async (chatId, sender, content) => {

  const message = await Message.create({
    chatId,
    sender,
    content,
  });

  const updateFields = {
    $push: { messages: message._id },
    lastMessageAt: new Date()
  };

  await Chat.findByIdAndUpdate(chatId, updateFields);

  return message;
};