import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import { generateChatTitle, generateAIResponse } from "./ai.service.js";

export const createChat = async (userId, category, initialMessage) => {

  const title = await generateChatTitle(initialMessage);

  const chat = await Chat.create({
    userId,
    category,
    title
  });
  
  await addMessageToChat(chat._id, userId, "user", initialMessage);

  const response = await generateAIResponse(initialMessage, category);

  await addMessageToChat(chat._id, userId, "assistant", response);

  return chat.populate("messages");
};

export const getChats = async (userId) => {
  const chats = await Chat.find({ userId });
  return chats;
};

export const getChatById = async (chatId, userId) => {
  const chat = await Chat.findOne({ _id: chatId, userId }).populate("messages");
  return chat;
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

  await addMessageToChat(chatId, userId, "user", message);

  const response = await generateAIResponse(message, chat.category);

  await addMessageToChat(chatId, userId, "assistant", response);

  return response;
};

const addMessageToChat = async (chatId, userId, sender, content) => {

  const message = await Message.create({
    chatId,
    userId,
    sender,
    content,
  });

  await Chat.findByIdAndUpdate(chatId, { $push: { messages: message._id } });
  
  return message;
};