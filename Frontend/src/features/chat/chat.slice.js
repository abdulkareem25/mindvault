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
    }
  }
});

export const { 
  setChats, 
  setActiveChatId, 
  setMessageHistory, 
  setError, 
  setLoading 
} = chatSlice.actions;
export default chatSlice.reducer;