'use strict';

import run from '../run';
import config from '../config';
import path from 'path';
import webpack from 'webpack';
import postcssImport from 'postcss-import';
import cssmqpacker from 'css-mqpacker';
import csswring from 'csswring';
import pxtorem from 'postcss-pxtorem';
import sorting from 'postcss-sorting';
import autoprefixer from 'autoprefixer';
import merge from 'webpack-merge';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import StatsPlugin from 'stats-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import ZipPlugin from 'zip-webpack-plugin';
import baseConf from './webpack.base.conf';

const projectRoot = path.resolve(__dirname, '../');
const src = path.join(projectRoot, config.paths.source);

const styleOptions = scss => {
    let options = [{
        loader: 'css-loader',
        options: {
            sourceMap: true,
            minimize: {
                discardComments: { removeAll: true }
            },
            importLoaders: 1
        }
    }, {
        loader: 'postcss-loader',
        options: {
            sourceMap: true,
            plugins: loader => [
                cssmqpacker({ sort: true }),
                postcssImport,
                csswring,
                sorting,
                autoprefixer({
                    browsers: ['> 5%', 'last 2 versions', 'Firefox ESR', 'android 4']
                }),
                pxtorem({
                    unitPrecision: 4,
                    replace: false
                })
            ]
        }
    }];

    if (scss) {
        options.push({
            loader: 'sass-loader',
            options: {
                precision: 10,
                sourceComments: false,
                sourceMap: true,
                data: '@import "global";',
                includePaths: [
                    path.resolve(src, config.paths.static, config.paths.scss)
                ]
            }
        });
    }

    return options;
};

export default merge(baseConf, {
    output: {
        filename: run().assetsSubDirectory + '/js/[name].[chunkhash].js',
        chunkFilename: run().assetsSubDirectory + '/js/chunks/[id].[chunkhash].js'
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: styleOptions()
            })
        }, {
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: styleOptions(true)
            })
        }, {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url-loader',
            exclude: /favicons/,
            options: {
                limit: 10000,
                name: path.posix.join(run().assetsSubDirectory || '', 'images/[name].[hash:7].[ext]')
            }
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            __PROD__: config.production,
            __DEV__: config.development
        }),
        new webpack.HashedModuleIdsPlugin(),

        new StatsPlugin('stats/stats.json', {
            chunkModules: true,
            source: false
        }),
        new CompressionPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
        }),
        new UglifyJsPlugin({
            compress: {
                screw_ie8: true,
                unused: true,
                warnings: false,
                drop_debugger: true,
                drop_console: true
            },
            mangle: {
                screw_ie8: true,
                keep_fnames: true
            },
            minimize: true,
            output: {
                comments: false,
                beautify: false
            },
            sourceMap: true
        }),
        new ExtractTextPlugin({
            filename: run().assetsSubDirectory + '/css/[name].[contenthash].css',
            allChunks: true
        }),
        new ZipPlugin({
            filename: 'build.zip'
        })
    ]
});
