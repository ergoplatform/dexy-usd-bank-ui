const path = require('path');
const rewireTypingsForCssModule = require('react-app-rewire-typings-for-css-module');
const addLessLoader = require('customize-cra-less-loader');

module.exports = function override(config) {
  /**
   * Add WASM support
   */

  // Make file-loader ignore WASM files
  const wasmExtensionRegExp = /\.wasm$/;
  config.resolve.extensions.push('.wasm');
  config.experiments = {
    asyncWebAssembly: false,
    lazyCompilation: true,
    syncWebAssembly: true,
    topLevelAwait: true,
  };
  config.resolve.fallback = {
    buffer: require.resolve('buffer/'),
  };
  config.module.rules.forEach((rule) => {
    (rule.oneOf || []).forEach((oneOf) => {
      if (oneOf.type === 'asset/resource') {
        oneOf.exclude.push(wasmExtensionRegExp);
      }
    });
  });

  // Add a dedicated loader for WASM
  config.module.rules.push({
    test: wasmExtensionRegExp,
    include: path.resolve(__dirname, 'src'),
    use: [{ loader: require.resolve('wasm-loader'), options: {} }],
  });

  config.module.rules.push({
    test: /\.m?js$/,
    resolve: {
      fullySpecified: false,
    },
  });

  config = rewireTypingsForCssModule.factory({})(config);
  config = addLessLoader({
    lessLoaderOptions: { lessOptions: { javascriptEnabled: true } },
  })(config);

  config.ignoreWarnings = [
    function ignoreSourcemapsloaderWarnings(warning) {
      return (
        warning.module &&
        warning.module.resource.includes('node_modules') &&
        warning.details &&
        warning.details.includes('source-map-loader')
      );
    },
  ];

  return config;
};
