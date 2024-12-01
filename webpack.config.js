const path = require('path');

module.exports = {
  resolve: {
    fallback: {
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      stream: require.resolve("stream-browserify"),
      zlib: require.resolve("browserify-zlib"),
      util: require.resolve("util/"),
      assert: require.resolve("assert/"),
      url: require.resolve("url/"),
      zlib: require.resolve("browserify-zlib"),
      xhr: require.resolve("xhr")
    },
  },
  // Diğer webpack ayarların
};
