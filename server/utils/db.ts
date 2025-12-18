import { Pool } from 'pg';

// Using a singleton pattern to ensure we only have one pool instance
let pool: Pool;

export function useDb() {
  if (!pool) {
    const config = useRuntimeConfig();
    if (!config.databaseUrl) {
      throw new Error('DATABASE_URL is not defined in runtime config.');
    }
    pool = new Pool({
      connectionString: config.databaseUrl,
    });
  }
  return pool;
}
