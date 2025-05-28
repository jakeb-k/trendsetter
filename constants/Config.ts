// config.ts

const isDev = __DEV__; // Expo flag

const Config = {
  API_URL: isDev ? 'https://trendsetter-core/api/v1' : 'https://your-prod-api.com/api',
  SENTRY_DSN: isDev ? '' : 'https://examplePublicKey@o0.ingest.sentry.io/0',
  ENABLE_DEV_TOOLS: isDev,
  VERSION: isDev ? 'dev-1.0.0' : '1.0.0',
};

export default Config;