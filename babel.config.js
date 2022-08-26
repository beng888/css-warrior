module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'transform-inline-environment-variables',
      [
        'module-resolver',
        {
          extensions: [
            '.json',
            '.js',
            '.jsx',
            '.ts',
            '.tsx',
            '.png',
            '.jpg',
            '.svg',
            '.android.js',
            '.android.tsx',
            'ios.js',
            'ios.tsx',
          ],
          alias: {
            // This needs to be mirrored in tsconfig.json
            src: './src',
            assets: './assets',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
