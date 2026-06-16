import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    activeChatId: null,
    messageHistory: [],
    loading: false,
    error: null,
    injectedMemories: {},
    removedPillIds: {}
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
    },
    removePill(state, action) {
      const { chatId, memoryId } = action.payload;
      if (!state.removedPillIds[chatId]) {
        state.removedPillIds[chatId] = [];
      }
      if (!state.removedPillIds[chatId].includes(memoryId)) {
        state.removedPillIds[chatId].push(memoryId);
      }
    },
    addMessageOptimistic(state, action) {
      const { message } = action.payload;
      // Add message optimistically (with temporary ID if needed)
      state.messageHistory.push(message);
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
  incrementMessageCount,
  removePill,
  addMessageOptimistic
} = chatSlice.actions;
export default chatSlice.reducer;