import { io } from "socket.io-client";
import { SOCKET_URL } from "../../../constants";

let socket = null;

export const initSocketConnection = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Connected to chat socket server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from chat socket server");
    });
  }

  return socket;
};

export const getSocket = () => socket;
