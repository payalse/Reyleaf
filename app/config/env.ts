type AppEnvironment = 'development' | 'production';

const CURRENT_ENV: AppEnvironment = 'production';

interface AppConfig {
  BASE_URL: string;
  APP_NAME: string;
  STRIPE_KEY: string;
  ENABLE_DEBUGGING: boolean;
}

const CONFIG_MAP: Record<AppEnvironment, AppConfig> = {
  development: {
    BASE_URL: 'https://dev-reyleaf-api.flynautstaging.com',
    APP_NAME: 'ReyLeaf Dev',
    STRIPE_KEY:
      'pk_test_51OcfYUEJs3bbNiuc0gCyyArVknf1IsZQbxXRWFHEFGmbflpPGPIHf2kAOIcdlc6bdmc1aicyV7VPjfe50IJn6VDi00coecLuIo',
    ENABLE_DEBUGGING: true,
  },
  production: {
    BASE_URL: 'https://api.reyleaf.com',
    APP_NAME: 'ReyLeaf',
    STRIPE_KEY:
      'pk_live_51OcfYUEJs3bbNiucZZXsDHvPXnXUVit1gAOv6VRJ7JAS6IVU40DjPqmW8Ea5MHLJMsqUDn2qDtZhtrROqwRzK1dQ0022i5oY5k',
    ENABLE_DEBUGGING: false,
  },
};

const AppConfig: AppConfig = CONFIG_MAP[CURRENT_ENV];

export {CURRENT_ENV, AppConfig};
