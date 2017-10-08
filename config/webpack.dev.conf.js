'use strict';

import run from '../run';
import config from '../config';
import path from 'path';
import merge from 'webpack-merge';
import webpack from 'webpack';
import FriendlyErrors from 'friendly-errors-webpack-plugin';
import WebpackNotifierPlugin from 'webpack-notifier';
import webpackConfig from './webpack.base.conf';
import HappyPack from 'happypack';

const happyThreadPool = HappyPack.ThreadPool({ size: 5 });

const createHappyPlugin = (id, loaders) => {
    return new HappyPack({
        id: id,
        loaders: loaders,
        threadPool: happyThreadPool,
        verbose: process.env.HAPPY_VERBOSE === '1'
    });
};

const projectRoot = path.resolve(__dirname, '../');
const src = path.join(projectRoot, config.paths.source);

Object.keys(webpackConfig.entry)
    .forEach(key => {
        webpackConfig.entry[key] = [path.join(__dirname, 'dev-client.js')].concat(webpackConfig.entry[key]);
    });

export default merge(webpackConfig, {
    output: {
        filename: '[name].js',
        chunkFilename: '[name].chunk.js'
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader?importLoaders=1'
            ]
        }, {
            test: /\.scss$/,
            use: 'happypack/loader?id=scss'
        }, {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            exclude: /favicons/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: path.posix.join(run().assetsSubDirectory || '', 'images/[name].[hash:7].[ext]')
                }
            }, {
                loader: 'image-webpack-loader',
                options: {
                    mozjpeg: {
                        progressive: true,
                        quality: 85
                    },
                    gifsicle: {
                        interlaced: false
                    },
                    optipng: {
                        optimizationLevel: 7
                    },
                    pngquant: {
                        quality: '80-100',
                        speed: 4
                    },
                    svgo: {
                        plugins: [{
                            removeViewBox: false
                        }, {
                            removeEmptyAttrs: false
                        }]
                    }
                }
            }]
        }]
    },
    plugins: [
        createHappyPlugin('scss', [{
            loader: 'style-loader'
        }, {
            loader: 'css-loader'
        }, {
            loader: 'sass-loader',
            options: {
                data: '@import "global";',
                sourceMap: true,
                includePaths: [
                    path.resolve(src, config.paths.static, config.paths.scss)
                ]
            }
        }]),

        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new FriendlyErrors(),
        new WebpackNotifierPlugin({
            alwaysNotify: true
        })
    ]
});
