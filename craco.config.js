module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            webpackConfig.module.rules.push({
                test: /\.html$/,
                use: "html-loader",
            });
            return webpackConfig;
        },
    },
};
