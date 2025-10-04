import express from 'express';
import logger from './config/logger.js';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim())} }));
app.use(cors());
app.use(cookieParser());
app.get('/', (req, res) => {
  logger.info("Hello from Acquisitions!!");
  res.status(200).send('Hello from acqusitions api');
});
app.get('/health', (req, res) => {
  res.status(200).json({status:'OK', timestamp: new Date().toISOString(), uptime:process.uptime()});
});

app.get('/api', (req, res) => {
  res.status(200).json({message: 'Acquisitions API is running'});
});

app.use('/api/auth', authRoutes);
export default app;
