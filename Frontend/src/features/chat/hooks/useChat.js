import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../shared/components/Toast";
import { setActiveChatId, setChats, setInjectedMemories, setLoading, setMessageHistory } from "../chat.slice";
import {
  createChat,
  deleteChat,
  fetchChatById,
  fetchChats,
  fetchMessageHistory,
  sendMessage
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

  const loadChatMemories = async (chatId) => {
    try {
      const chatData = await fetchChatById(chatId);
      if (chatData?.data?.injectedMemoryIds && chatData.data.injectedMemoryIds.length > 0) {
        const memories = chatData.data.injectedMemoryIds.map(m => ({
          _id: m._id,
          content: m.content,
          category: m.category,
          type: m.type
        }));
        dispatch(setInjectedMemories({ chatId, memories }));
      }
    } catch (error) {
      console.log("Load chat memories failed:", error);
    }
  };

  const sendMessageToChat = async (chatId, message) => {
    try {
      dispatch(setLoading(true));
      const response = await sendMessage(chatId, message);
      if (response && response.injectedMemories) {
        dispatch(setInjectedMemories({ chatId, memories: response.injectedMemories }));
      }
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
      const response = await createChat(category, initialMessage);
      if (response?.data?._id && response?.injectedMemories) {
        dispatch(setInjectedMemories({ chatId: response.data._id, memories: response.injectedMemories }));
      }
      return response;
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
    loadChatMemories,
    sendMessageToChat,
    handleCreateChat,
    initialState,
    handleDeleteChat
  };
};
