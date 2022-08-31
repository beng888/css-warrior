import 'dotenv/config';

export default {
  name: 'css-warrior',
  version: '1.0.0',
  slug: 'css-warrior',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
  },
  android: {
    package: 'com.lawrence.css_warrior',
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FFFFFF',
    },
  },
  web: {
    favicon: './assets/favicon.png',
  },
  extra: {
    enableComments: process.env.COOLAPP_COMMENTS === 'true',
    eas: {
      projectId: 'a7fdecbe-5498-4362-804f-646fab2f0b8c',
    },
  },
};
