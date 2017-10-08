'use strict';

export default {
    env: { NODE_ENV: '"development"' },
    port: process.env.PORT || 3001,
    devtool: 'eval',
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    cssSourceMap: false,
    proxyTable: {
        '/api': {
            target: 'http://jsonplaceholder.typicode.com',
            changeOrigin: true,
            pathRewrite: {
                '^/api': ''
            }
        }
    }
};
