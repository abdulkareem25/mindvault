import { io } from "socket.io-client";

export const initSocketConnection = () => {
  const socket = io("https://mindvault-6exy.onrender.com", {
    withCredentials: true,
  });

  socket.on("connect", () => {
    console.log("Connected to chat socket server");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from chat socket server");
  });

  return socket;
};
