import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import './config/env.js';
import errorHandler from './middlewares/errorHandler.middleware.js';
import notFoundMiddleware from './middlewares/notFound.middleware.js';
import authRouter from './routes/auth.routes.js';
import chatRouter from './routes/chat.routes.js';
import memoryRouter from './routes/memory.routes.js';
import digestRouter from './routes/digest.routes.js';


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

app.use(express.json({ limit: '50kb' }));
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.static('./public'));

app.use('/api/auth', authRouter);
app.use('/api/chats', chatRouter);
app.use('/api/memories', memoryRouter);
app.use('/api/digest', digestRouter);


app.get(/.*/, (req, res) => {
  res.sendFile('index.html', { root: './public' });
});

app.use(notFoundMiddleware);
app.use(errorHandler);


export default app;