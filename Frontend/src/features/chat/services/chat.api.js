import axios from "axios";
import { API_BASE_URL } from "../../../constants";
import store from "../../../app/app.store";
import { setToken, clearAuth } from "../../auth/auth.slice";

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
  const response = await api.post(`/${chatId}/messages`, { message });
  return response.data;
};

export const deleteChat = async (chatId) => {
  const response = await api.delete(`/${chatId}`);
  return response.data;
};