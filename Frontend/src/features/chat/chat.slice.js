import { createSlice } from "@reduxjs/toolkit"

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    activeChatId: null,
    messageHistory: [],
    loading: false,
    error: null
  },
  reducers: {
    setChats(state, action) {
      state.chats = action.payload;
    },
    setActiveChatId(state, action) {
      state.activeChatId = action.payload;
    },
    setMessageHistory(state, action) {
      state.messageHistory = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setInjectedMemories(state, action) {
      const { chatId, memories } = action.payload;
      state.chats = state.chats.map(chat => 
        chat._id === chatId ? { ...chat, injectedMemories: memories } : chat
      );
      if (!state.injectedMemories) {
        state.injectedMemories = {};
      }
      state.injectedMemories[chatId] = memories;
    },
    incrementMessageCount(state, action) {
      const { chatId, amount = 1 } = action.payload;
      state.chats = state.chats.map(chat => 
        chat._id === chatId ? { ...chat, messageCount: (chat.messageCount || 0) + amount } : chat
      );
    }
  }
});

export const { 
  setChats, 
  setActiveChatId, 
  setMessageHistory, 
  setError, 
  setLoading,
  setInjectedMemories,
  incrementMessageCount
} = chatSlice.actions;
export default chatSlice.reducer;