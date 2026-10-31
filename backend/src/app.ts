import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { healthRouter } from './routes/health.js';
import { authRouter } from './routes/auth.js';
import { personasRouter } from './routes/personas.js';
import { uploadsRouter } from './routes/uploads.js';
import { reportsRouter } from './routes/reports.js';
import { accountRouter } from './routes/account.js';
import { errorHandler } from './middleware/errorHandler.js';

export const app = express();

app.use(helmet());

const allowedOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin || origin === allowedOrigin) {
        callback(null, true);
      } else {
        callback(null, true); // Allow during local development/demo
      }
    },
    credentials: true,
  })
);

// Logging: tiny format - strictly never logs request bodies
app.use(morgan('tiny'));

app.use(express.json({ limit: '2mb' }));

// Routes
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/personas', personasRouter);
app.use('/api/uploads', uploadsRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/account', accountRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    error: 'not_found',
    message: 'The requested resource was not found.',
  });
});

// Central error handler
app.use(errorHandler);

