'use strict';
import check_versions from './check-versions';
check_versions();

import run from '../run';

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}

import config from '../config';
import opn from 'opn';
import path from 'path';
import cls from 'cli-color';
import express from 'express';
import morgan from 'morgan';
import webpack from 'webpack';
import proxyMiddleware from 'http-proxy-middleware';
import webpackConfig from './webpack.dev.conf';
import webpack_dev_middleware from 'webpack-dev-middleware';
import webpack_hot_middleware from 'webpack-hot-middleware';
import connect_history_api_fallback from 'connect-history-api-fallback';

const port = run().port;
const uri = 'http://localhost:' + port;
const proxyTable = run().proxyTable;
const autoOpenBrowser = run().autoOpenBrowser;

const app = express();
const compiler = webpack(webpackConfig);

const devMiddleware = webpack_dev_middleware(compiler, {
    publicPath: run().assetsPublicPath,
    stats: {
        colors: true,
        timings: true,
        modules: false,
        version: false,
        chunks: false
    }
});
const hotMiddleware = webpack_hot_middleware(compiler, {
    log: false,
    heartbeat: 2000
});

// reload page when views are changed
compiler.plugin('compilation', compilation => compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
    hotMiddleware.publish({ action: 'reload' });
    cb();
}));

// proxy api requests
Object.keys(proxyTable)
    .forEach(context => {
        let options = proxyTable[context];

        if (typeof options === 'string') {
            options = { target: options };
        }

        app.use(proxyMiddleware(options.filter || context, options));
    });

app.use(morgan('dev'));
app.use(connect_history_api_fallback());
app.use(devMiddleware);
app.use(hotMiddleware);

const staticPath = path.posix.join(run().assetsPublicPath, run().assetsSubDirectory);
app.use(staticPath, express.static('./static'));

devMiddleware.waitUntilValid(() => {
    console.info(cls.green('======================================================================='));
    console.info(cls.cyan(`Webpack Dev Server listening on port ${port}, in ${config.env} mode.`));
    console.info(cls.cyan(`Open up `) + cls.white(`${uri}`) + cls.cyan(' in your browser.'));
    console.info(cls.green('======================================================================='));

    if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
        opn(uri);
    }

    // tell dev.js that webpack has completed compilation
    process.send('webpack-compilation-complete');
});

export default app.listen(port, err => {
    if (err) {
        console.log(err);
        process.exit();
    }
});
