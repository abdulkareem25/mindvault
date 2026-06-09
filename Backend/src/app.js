import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import './config/env.js';
import errorMiddleware from './middlewares/error.middleware.js';
import notFoundMiddleware from './middlewares/notFound.middleware.js';
import authRouter from './routes/auth.routes.js';
import chatRouter from './routes/chat.routes.js';

const app = express();

const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { success: false, message: "Too many attempts, please try again later." }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { success: false, message: "Too many login attempts, please try again later." }
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { success: false, message: "Too many attempts, please try again later." }
});

app.use('/api/auth/signup', signupLimiter);
app.use('/api/auth/login', loginLimiter);
app.use('/api/auth/forgot-password', forgotPasswordLimiter);

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.static('./public'));

app.use('/api/auth', authRouter);
app.use('/api/chats', chatRouter);

app.get(/.*/, (req, res) => {
  res.sendFile('index.html', { root: './public' });
});

app.use(notFoundMiddleware);
app.use(errorMiddleware);


export default app;