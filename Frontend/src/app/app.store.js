import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth.slice";
import chatReducer from "../features/chat/chat.slice";
import { vaultApi } from "../features/vault/vaultApi";
import { authApi } from "../features/auth/services/authApi";

const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    [vaultApi.reducerPath]: vaultApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(vaultApi.middleware, authApi.middleware),
});

export default store;