import { useDb } from '../utils/db';
import { useRedis } from '../utils/redis';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async () => {
  const db = useDb();
  const redis = useRedis();
  const results: {
    postgres: { status: string; message?: string; time?: string };
    redis: { status: string; message?: string; pong?: string };
  } = {
    postgres: { status: 'failed', message: 'Not checked' },
    redis: { status: 'failed', message: 'Not checked' },
  };

  // Test PostgreSQL connection
  try {
    const { rows } = await db.query('SELECT NOW() as current_time');
    results.postgres.status = 'connected';
    results.postgres.time = rows[0].current_time;
  } catch (error: any) {
    results.postgres.status = 'failed';
    results.postgres.message = error.message;
    console.error('PostgreSQL health check failed:', error);
  }

  // Test Redis connection
  try {
    const pong = await redis.ping();
    results.redis.status = 'connected';
    results.redis.pong = pong;
  } catch (error: any) {
    results.redis.status = 'failed';
    results.redis.message = error.message;
    console.error('Redis health check failed:', error);
  }

  // Close connections in case they were opened (for pg, pool manages connections)
  // For ioredis, client is usually long-lived, but we handle errors above.

  return {
    message: 'Health check completed',
    ...results,
  };
});
