import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth.slice";
import chatReducer from "../features/chat/chat.slice";
import vaultReducer from "../features/vault/vaultSlice";
import captureReducer from "../features/capture/captureSlice";
import { vaultApi } from "../features/vault/vaultApi";
import { authApi } from "../features/auth/services/authApi";
import { digestApi } from "../features/digest/digestApi";

const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    vault: vaultReducer,
    capture: captureReducer,
    [vaultApi.reducerPath]: vaultApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [digestApi.reducerPath]: digestApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(vaultApi.middleware, authApi.middleware, digestApi.middleware),
});


export default store;