import './config/env.js';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import notFoundMiddleware from './middlewares/notFound.middleware.js';
import errorMiddleware from './middlewares/error.middleware.js';
import authRouter from './routes/auth.routes.js';
import problemRouter from './routes/problem.routes.js';

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api/auth', authRouter);
app.use('/api/problems', problemRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the MindVault API!');
});

app.use(notFoundMiddleware);
app.use(errorMiddleware);


export default app;