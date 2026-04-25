import { ChatMistralAI } from '@langchain/mistralai';
import { HumanMessage, SystemMessage } from 'langchain';

const mistralModel = new ChatMistralAI({
  model: 'mistral-small-latest'
});

const mistralLargeModel = new ChatMistralAI({
  model: 'mistral-large-latest'
});

export const generateChatTitle = async (initialMessage) => {
  const systemPrompt = `You are a helpful assistant that creates concise and descriptive titles for user conversations. The title should capture the main topic or theme of the conversation in a few words. Avoid generic titles and focus on the specific content of the initial message.`;

  const humanPrompt = `Based on the following initial message, generate a concise and descriptive title for the conversation:\n\n"${initialMessage}"\n\nThe title should be no more than 5 words.`;

  const response = await mistralModel.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(humanPrompt)
  ]);

  return response.text.trim();
};

export const generateAIResponse = async (conversationHistory, category) => {  
  const systemPrompt = `You are a helpful assistant that provides thoughtful and relevant responses to user messages. The conversation is categorized as "${category}", so tailor your response to fit that context. Use the conversation history to understand the user's needs and provide a meaningful reply.`;

  const humanPrompt = `Here is the conversation history:\n\n${conversationHistory}\n\nBased on this conversation, provide a helpful and relevant response to the user's latest message.`;

  const response = await mistralLargeModel.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(humanPrompt)
  ]);

  return response.text.trim();
};