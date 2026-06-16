import axios from "axios";
import store from "../../../app/app.store";
import { API_BASE_URL } from "../../../constants";
import { clearAuth, setToken } from "../../auth/auth.slice";

const api = axios.create({
  baseURL: `${API_BASE_URL}/chats`,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        const { accessToken } = refreshResponse.data;
        store.dispatch(setToken(accessToken));
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        store.dispatch(clearAuth());
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

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
  const response = await api.post(`/${chatId}/messages`, { content: message });
  return response.data;
};

export const sendMessageStream = async (chatId, message, onChunk) => {
  const token = store.getState().auth?.token;
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}/chats/${chatId}/messages/stream`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      credentials: 'include',
      body: JSON.stringify({ content: message })
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Streaming request failed');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.done) {
              return data.message;
            }
            if (data.fullResponse) {
              onChunk(data);
            }
          } catch (e) {
            console.error('Failed to parse SSE message:', e);
          }
        }
      }
    }
  } finally {
    reader.cancel();
  }
};

export const deleteChat = async (chatId) => {
  const response = await api.delete(`/${chatId}`);
  return response.data;
};