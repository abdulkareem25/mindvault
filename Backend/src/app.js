import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import './config/env.js';
import errorMiddleware from './middlewares/error.middleware.js';
import notFoundMiddleware from './middlewares/notFound.middleware.js';
import authRouter from './routes/auth.routes.js';
import chatRouter from './routes/chat.routes.js';

const app = express();

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

app.get('/', (req, res) => {
  res.send('Welcome to the MindVault API!');
});

app.get("*", (req, res) => {
  res.sendFile("./public/index.html", { root: "./" });
});

app.use(notFoundMiddleware);
app.use(errorMiddleware);


export default app;