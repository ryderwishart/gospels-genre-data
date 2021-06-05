module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push({
      test: /\.xml$/,
      use: [
        //   options.defaultLoaders.babel,
        {
          loader: 'xml-loader',
          // options: pluginOptions.options,
        },
      ],
    });

    return config;
  },
  env: {
    someKey:
      'not in use but can be accessed at build using process.env.someKey',
  },
};
