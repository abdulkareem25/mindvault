import { Server } from 'socket.io';

let io;

export const initSocketServer = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      withCredentials: true,
    },
  });
  console.log('Socket.io server initialized');
  
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

export const getIo = () => {
  if (!io) {
    throw new Error('Socket.io server not initialized');
  }

  return io;
};