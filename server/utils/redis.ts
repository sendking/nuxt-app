import Redis from 'ioredis';

// Using a singleton pattern to ensure we only have one client instance
let redis: Redis;

export function useRedis() {
  if (!redis) {
    const config = useRuntimeConfig();
    if (!config.redisUrl) {
      throw new Error('REDIS_URL is not defined in runtime config.');
    }
    redis = new Redis(config.redisUrl);
  }
  return redis;
}
