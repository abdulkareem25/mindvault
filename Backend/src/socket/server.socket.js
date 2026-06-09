import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { chatSocket } from './chat.socket.js';

let io;

const parseCookies = (cookieString) => {
  if (!cookieString) return {};
  const cookies = {};
  cookieString.split(';').forEach(cookie => {
    const parts = cookie.trim().split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      cookies[key] = decodeURIComponent(val);
    }
  });
  return cookies;
};

export const initSocketServer = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });
  console.log('Socket.io server initialized');

  // Socket Authentication Middleware
  io.use(async (socket, next) => {
    try {
      let token = null;

      // 1. Try to get token from handshake auth
      if (socket.handshake.auth && socket.handshake.auth.token) {
        token = socket.handshake.auth.token;
      }
      // 2. Try to get token from handshake query
      else if (socket.handshake.query && socket.handshake.query.token) {
        token = socket.handshake.query.token;
      }
      // 3. Try to get token from cookie
      else if (socket.handshake.headers.cookie) {
        const cookies = parseCookies(socket.handshake.headers.cookie);
        token = cookies.token;
      }

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id, 'User:', socket.userId);

    // Join private room on connection
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
      console.log(`Socket ${socket.id} joined room user:${socket.userId}`);
    }

    // Register handlers
    chatSocket(socket);

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