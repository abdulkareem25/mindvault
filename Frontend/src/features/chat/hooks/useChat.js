import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../shared/components/Toast";
import { setActiveChatId, setChats, setError, setLoading, setMessageHistory } from "../chat.slice";
import {
  fetchChats,
  fetchMessageHistory,
  sendMessage,
  createChat
} from "../services/chat.api";
import { initSocketConnection } from "../services/chat.socket";

export const useChat = () => {

  const dispatch = useDispatch();

  const { messageHistory } = useSelector((state) => state.chat);

  const loadChats = async () => {
    try {
      dispatch(setLoading(true));
      const chats = await fetchChats();
      dispatch(setChats(chats.data));
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to load chats";
      dispatch(setError(errorMessage));
      showToast("error");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const loadMessageHistory = async (chatId) => {
    try {
      dispatch(setLoading(true));
      const messages = await fetchMessageHistory(chatId);
      dispatch(setMessageHistory(messages.data));
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to load messages";
      dispatch(setError(errorMessage));
      showToast("error");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const sendMessageToChat = async (chatId, message) => {
    try {
      dispatch(setLoading(true));
      await sendMessage(chatId, message);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to send message";
      dispatch(setError(errorMessage));
      showToast("error");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleCreateChat = async (category, initialMessage) => {
    try {
      dispatch(setLoading(true));
      const chat = await createChat(category, initialMessage);
      return chat;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to create chat";
      dispatch(setError(errorMessage));
      showToast("error");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const initialState = () => {
    dispatch(setActiveChatId(null));
    dispatch(setMessageHistory([]));
  };

  return {
    initSocketConnection,
    loadChats,
    loadMessageHistory,
    sendMessageToChat,
    handleCreateChat,
    initialState
  };
};
