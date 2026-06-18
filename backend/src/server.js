import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import pinoHttp from 'pino-http';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { connectDB } from './config/db.js';
import { redis } from './config/redis.js';
import { authRouter } from './routes/auth.js';
import { moviesRouter } from './routes/movies.js';
import { watchlistRouter } from './routes/watchlist.js';

const app = express();

// Security & infra middleware
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(pinoHttp({ logger, autoLogging: { ignore: (req) => req.url === '/api/health' } }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/movies', moviesRouter);
app.use('/api/watchlist', watchlistRouter);
app.get('/api/health', async (req, res) => {
  const mongo = mongoose.connection.readyState === 1 ? 'ok' : 'down';
  const redisStatus = redis.status === 'ready' ? 'ok' : 'down';
  res.json({ status: 'ok', mongo, redis: redisStatus, env: env.nodeEnv });
});

// 404
app.use((req, res) => res.status(404).json({ error: 'not_found', path: req.path }));

// Error handler (4-arg signature required by Express)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  logger.error({ err: err.message, stack: err.stack }, 'unhandled error');
  res.status(err.status || 500).json({ error: err.code || 'internal_error', message: err.message });
});

async function start() {
  try {
    await connectDB();
    app.listen(env.port, () => logger.info({ port: env.port }, 'backend listening'));
  } catch (err) {
    logger.fatal({ err: err.message }, 'failed to start');
    process.exit(1);
  }
}

start();

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('shutting down');
  process.exit(0);
});
