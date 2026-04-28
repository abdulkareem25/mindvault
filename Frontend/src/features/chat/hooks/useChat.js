import { initSocketConnection } from "../services/chat.socket";
import { 
  fetchChats, 
  createChat, 
  fetchChatById, 
  fetchMessageHistory, 
  sendMessage 
} from "../services/chat.api";
import { setChats, setLoading } from "../chat.slice";
import { useDispatch } from "react-redux";

export const useChat = () => {

  const dispatch = useDispatch();

  const loadChats = async () => {
    try {
      dispatch(setLoading(true));
      const chats = await fetchChats();
      dispatch(setChats(chats.data));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    } 
  };

  

  return {
    initSocketConnection,
    loadChats
  };
};
