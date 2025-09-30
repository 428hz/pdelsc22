module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            // Este alias debe coincidir con el de tsconfig.json
            '@': './src',
          },
        },
      ],
    ],
  };
};