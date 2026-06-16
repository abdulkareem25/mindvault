import { io } from "socket.io-client";
import { SOCKET_URL } from "../../../constants";

let socket = null;

export const initSocketConnection = (token = null) => {
  // Agar already connected hai aur token same hai — reuse karo
  if (socket && socket.connected) {
    return socket;
  }

  // Agar socket exist karta hai lekin connected nahi — disconnect karo
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  socket = io(SOCKET_URL, {
    withCredentials: true,
    auth: token ? { token } : {},
  });

  socket.on("connect", () => {
    console.log("Connected to chat socket server:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });

  socket.on("disconnect", (reason) => {
    console.log("Disconnected from chat socket server:", reason);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
