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

  const userMessage = await Message.create({
    chatId: chat._id,
    role: "user",
    content: initialMessage,
  });

  chat.messages.push(userMessage._id);
  chat.lastMessageAt = new Date();
  await chat.save();

  const response = await generateAIResponse(initialMessage, category);

  const assistantMessage = await Message.create({
    chatId: chat._id,
    role: "assistant",
    content: response,
  });

  chat.messages.push(assistantMessage._id);
  chat.lastMessageAt = new Date();
  await chat.save();

  return chat.populate("messages");
};