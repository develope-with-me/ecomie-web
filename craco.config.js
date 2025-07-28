const path = require('path');

module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            webpackConfig.module.rules.push({
                test: /\.html$/,
                use: "html-loader",
            });
            
            // Add alias configuration
            webpackConfig.resolve.alias = {
                ...webpackConfig.resolve.alias,
                '@': path.resolve(__dirname, 'src'),
            };
            
            return webpackConfig;
        },
    },
};
