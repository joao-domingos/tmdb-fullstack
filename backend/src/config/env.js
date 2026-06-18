import 'dotenv/config';

function required(name) {
  const v = process.env[name];
  if (!v || !String(v).trim()) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return v;
}

const isProd = process.env.NODE_ENV === 'production';

export const env = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProd,

  mongoUri: required('MONGO_URI'),
  redisUrl: required('REDIS_URL'),

  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',

  tmdbApiKey: required('TMDB_API_KEY'),
  tmdbBaseUrl: process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3',
  tmdbImageBase: process.env.TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p/w500',
  tmdbLanguage: process.env.TMDB_LANGUAGE || 'en-US',

  seedUsername: process.env.SEED_USERNAME || 'admin',
  seedPassword: process.env.SEED_PASSWORD || 'admin123',

  loginRateLimitMax: Number(process.env.LOGIN_RL_MAX) || 5,
  loginRateLimitWindowMs: Number(process.env.LOGIN_RL_WINDOW_MS) || 60_000,
};
