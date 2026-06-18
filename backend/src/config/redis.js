import Redis from 'ioredis';
import { env } from './env.js';
import { logger } from './logger.js';

export const redis = new Redis(env.redisUrl, {
  lazyConnect: false,
  maxRetriesPerRequest: 3,
});

redis.on('connect', () => logger.info('redis connected'));
redis.on('error', (err) => logger.error({ err: err.message }, 'redis error'));

// Cache helpers — used by routes/movies.js. Kept here (config) because
// they depend on the redis client lifecycle.
export async function cacheGet(key) {
  try {
    const raw = await redis.get(key);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    logger.warn({ key, err: err.message }, 'cacheGet failed');
    return null;
  }
}

export async function cacheSet(key, value, ttlSeconds) {
  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  } catch (err) {
    logger.warn({ key, err: err.message }, 'cacheSet failed');
  }
}

export async function cacheDel(pattern) {
  try {
    if (!pattern.includes('*')) {
      await redis.del(pattern);
      return;
    }
    const stream = redis.scanStream({ match: pattern, count: 100 });
    for await (const keys of stream) {
      if (keys.length) await redis.del(...keys);
    }
  } catch (err) {
    logger.warn({ pattern, err: err.message }, 'cacheDel failed');
  }
}
