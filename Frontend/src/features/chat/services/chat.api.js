import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/chats",
  withCredentials: true
});

export const fetchChats = async () => {
  const response = await api.get("/");
  return response.data;
}

export const createChat = async (category, initialMessage) => {
  const response = await api.post("/", { category, initialMessage });
  return response.data;
}

export const fetchChatById = async (chatId) => {
  const response = await api.get(`/${chatId}`);
  return response.data;
}

export const fetchMessageHistory = async (chatId) => {
  const response = await api.get(`/${chatId}/messages`);
  return response.data;
}

export const sendMessage = async (chatId, message) => {
  const response = await api.post(`/${chatId}/messages`, { message });
  return response.data;
};

export const deleteChat = async (chatId) => {
  const response = await api.delete(`/${chatId}`);
  return response.data;
};