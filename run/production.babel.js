'use strict';

import path from 'path';

export default {
    env: { NODE_ENV: '"production"' },
    output: path.resolve(__dirname, '../dist'),
    devtool: '#source-map',
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: true,
    productionGzip: true,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report
};
