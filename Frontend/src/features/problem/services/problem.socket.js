import { io } from "socket.io-client";

export const initSocketConnection = () => {
  const socket = io("http://localhost:3000", {
    withCredentials: true,
  });

  socket.on("connect", () => {
    console.log("Connected to problem socket server");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from problem socket server");
  });

  return socket;
};