import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../shared/components/Toast";
import { addStreamingMessage, prependMessageHistory, setActiveChatId, setChats, setInjectedMemories, setLoading, setMessageHistory, updateStreamingMessage } from "../chat.slice";
import {
  createChat,
  deleteChat,
  fetchChatById,
  fetchChats,
  fetchMessageHistory,
  sendMessage,
  sendMessageStream
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

  const loadMessageHistory = async (chatId, page = 1, limit = 20) => {
    try {
      dispatch(setLoading(true));
      const responseData = await fetchMessageHistory(chatId, page, limit);
      const data = responseData.data;

      // Extract details handling both paginated and legacy flat array formats
      const messages = (data && typeof data === 'object' && 'messages' in data) ? data.messages : data;
      const hasMore = (data && typeof data === 'object' && 'hasMore' in data) ? data.hasMore : false;
      const total = (data && typeof data === 'object' && 'total' in data) ? data.total : (messages ? messages.length : 0);

      if (page > 1) {
        dispatch(prependMessageHistory(messages));
      } else {
        dispatch(setMessageHistory(messages));
      }

      return { messages, hasMore, total };
    } catch (error) {
      console.log("Load message history failed:", error);
      showToast("error");
      return { messages: [], hasMore: false, total: 0 };
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

  const sendMessageToChatStream = async (chatId, message) => {
    try {
      const tempMessageId = `stream_${Date.now()}`;
      dispatch(addStreamingMessage({ tempId: tempMessageId }));

      await sendMessageStream(chatId, message, (data) => {
        dispatch(updateStreamingMessage({ fullResponse: data.fullResponse }));
      });

      // Reload message history to sync with server
      await loadMessageHistory(chatId);
    } catch (error) {
      console.log("Stream message failed:", error);
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
    sendMessageToChatStream,
    handleCreateChat,
    initialState,
    handleDeleteChat
  };
};
