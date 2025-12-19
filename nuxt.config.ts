// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Enable the pages directory feature
  pages: true,

  // Define aliases using Nuxt's built-in syntax
  alias: {
    '@changelogs': '~~/changelogs',
  },

  runtimeConfig: {
    // The private keys which are only available on server-side
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    // Keys within public, will be also exposed to the client-side
    public: {},
  },
});
