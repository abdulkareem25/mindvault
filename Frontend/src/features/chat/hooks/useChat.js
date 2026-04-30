import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../shared/components/Toast";
import { setActiveChatId, setChats, setError, setLoading, setMessageHistory } from "../chat.slice";
import {
  fetchChats,
  fetchMessageHistory,
  sendMessage,
  createChat,
  deleteChat
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
      console.log("Load chats failed:", error);
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
      console.log("Load message history failed:", error);
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
      console.log("Send message failed:", error);
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
      console.log("Create chat failed:", error);
      showToast("error");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      dispatch(setLoading(true));
      const response = await deleteChat(chatId);
      showToast("success", response.message);
      initialState();
      loadChats();
    } catch (error) {
      console.log("Delete chat failed:", error);
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
    initialState,
    handleDeleteChat
  };
};
