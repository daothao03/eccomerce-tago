const webpack = require("webpack");

module.exports = function override(config) {
    const fallback = config.resolve.fallback || {};

    Object.assign(fallback, {
        path: require.resolve("path-browserify"),
        stream: require.resolve("stream-browserify"),
        zlib: require.resolve("browserify-zlib"),
        crypto: require.resolve("crypto-browserify"),
        http: require.resolve("stream-http"),
        querystring: require.resolve("querystring-es3"),
        url: require.resolve("url/"),
        buffer: require.resolve("buffer/"),
        util: require.resolve("util/"),
        fs: false,
        net: false,
        assert: require.resolve("assert/"),
        process: require.resolve("process/browser.js"),
    });
    config.resolve.fallback = fallback;
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: "process/browser.js",
        }),
    ]);
    return config;
};
