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
      if (action.payload && typeof action.payload === 'object' && 'messages' in action.payload) {
        state.messageHistory = action.payload.messages;
      } else {
        state.messageHistory = action.payload || [];
      }
    },
    prependMessageHistory(state, action) {
      const messagesToPrepend = Array.isArray(action.payload)
        ? action.payload
        : (action.payload && action.payload.messages) || [];
      const existingIds = new Set(state.messageHistory.map(m => m._id));
      const newMessages = messagesToPrepend.filter(m => !existingIds.has(m._id));
      state.messageHistory = [...newMessages, ...state.messageHistory];
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
    },
    updateStreamingMessage(state, action) {
      const { fullResponse } = action.payload;
      // Find the last assistant message and update it
      const lastAssistantIndex = state.messageHistory.length - 1;
      if (lastAssistantIndex >= 0 && state.messageHistory[lastAssistantIndex].sender === 'assistant') {
        state.messageHistory[lastAssistantIndex].content = fullResponse;
      }
    },
    addStreamingMessage(state, action) {
      const { tempId } = action.payload;
      state.messageHistory.push({
        _id: tempId,
        sender: 'assistant',
        content: '',
        isStreaming: true,
        createdAt: new Date().toISOString()
      });
    }
  }
});

export const {
  setChats,
  setActiveChatId,
  setMessageHistory,
  prependMessageHistory,
  setError,
  setLoading,
  setInjectedMemories,
  incrementMessageCount,
  removePill,
  addMessageOptimistic,
  updateStreamingMessage,
  addStreamingMessage
} = chatSlice.actions;
export default chatSlice.reducer;