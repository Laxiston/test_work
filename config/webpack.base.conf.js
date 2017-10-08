'use strict';

import run from '../run';
import fs from 'fs';
import glob from 'glob';
import _ from 'lodash';
import path from 'path';
import merge from 'webpack-merge';
import webpack from 'webpack';
import { CheckerPlugin } from 'awesome-typescript-loader';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import config from '../config';
import chunksMapRaw from '../run/chunks.babel';
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

const getFiles = filepath => {
    let files = glob.sync(filepath);
    let entries = [];

    files.map(item => {
        let pathname = path.basename(item, path.extname(item));
        entries.push(pathname);
    });

    return entries;
};

function isVendor({ resource }) {
    return resource &&
        resource.indexOf('node_modules') >= 0 &&
        resource.match(/\.js$/);
}

const projectRoot = path.resolve(__dirname, '../');
const src = path.join(projectRoot, config.paths.source);
const vendors = path.join(src, config.paths.static, config.paths.js, 'vendor.js');
const polyfills = path.join(src, config.paths.static, config.paths.js, 'polyfills.js');

// Read all .js files inside 'scripts' folder as entries
const chunks = getFiles(path.join(src, config.paths.pages, '**/!(_*|*.ctrl).js'));
// Read all .js files inside 'scripts' folder as entries
const entries = chunks.reduce((entries, chunk) => {
    entries[chunk] = path.join(src, config.paths.pages, chunk, `${chunk}.js`);
    return entries;
}, {});

if (Object.keys(entries).length === 0) {
    throw new Error(`Please add at lease one js files in ${config.paths.source}/${config.paths.pages}`);
}

// Read all .html and .pug as views
const chunksMap = new Map();

Object.keys(chunksMapRaw)
    .forEach(key => {
        if (!_.isArray(chunksMapRaw[key])) {
            chunksMapRaw[key] = [chunksMapRaw[key]];
        }

        const globs = glob.sync(path.join(src, config.paths.pages, key));

        globs.forEach(item => {
            if (chunksMap.has(item)) {
                chunksMap.get(item)
                    .push(...chunksMapRaw[key]);
            } else {
                chunksMap.set(item, chunksMapRaw[key]);
            }
        });
    });

const views = glob.sync(path.join(src, config.paths.pages, '**/!(_*).@(html|pug)'))
    .map(filename => {
        const name = path.basename(filename, path.extname(filename))
            .replace(/\.(html|pug)$/, '');

        return {
            //chunks: chunksMap.get(filename) || [name],
            chunks: (chunksMap.get(filename) || [name]).concat(['vendors']),
            filename,
            name
        };
    });

// Read all folders inside 'src' folder as alias
const alias = _.assign(fs.readdirSync(src)
    .reduce((dirs, filename) => {
        if (fs.statSync(path.join(src, filename))
                .isDirectory()) {
            dirs[filename] = path.join(src, filename);
        }

        return dirs;
    }, { src }), {
    modernizr$: path.resolve(projectRoot, '.modernizrrc'),
    'jquery': path.resolve(projectRoot, 'node_modules/jquery/dist/jquery'),
    'inputmask.dependencyLib': path.resolve(projectRoot, 'node_modules/inputmask/dist/inputmask/dependencyLibs/inputmask.dependencyLib.jquery'),
    'inputmask': path.resolve(projectRoot, 'node_modules/inputmask/dist/inputmask/inputmask'),
    'phone-codes': path.resolve(projectRoot, 'node_modules/inputmask/dist/inputmask/phone-codes/phone'),
    'phone-codes-ru': path.resolve(projectRoot, 'node_modules/inputmask/dist/inputmask/phone-codes/phone-ru'),
    'jquery.inputmask': path.resolve(projectRoot, 'node_modules/inputmask/dist/inputmask/jquery.inputmask'),
    'inputmask.extensions': path.resolve(projectRoot, 'node_modules/inputmask/dist/inputmask/inputmask.extensions'),
    'inputmask.phone.extensions': path.resolve(projectRoot, 'node_modules/inputmask/dist/inputmask/inputmask.phone.extensions'),
    'inputmask.numeric.extensions': path.resolve(projectRoot, 'node_modules/inputmask/dist/inputmask/inputmask.numeric.extensions')

});

export default merge({
    entry: _.assign({}, {
        polyfills: polyfills,
        vendors: vendors
        //app: path.resolve(src, config.paths.static, config.paths.js, 'index.js')
    }, entries),
    output: {
        path: run().output,
        publicPath: run().assetsPublicPath
    },
    devtool: run().devtool,
    resolve: {
        //unsafeCache: true,
        extensions: ['.js', '.ts', '.json'],
        modules: [
            path.join(__dirname, '../node_modules')
        ],
        alias
    },
    module: {
        rules: [{
            enforce: 'pre',
            test: /\.js$/,
            exclude: /(node_modules|bootstrap)/,
            use: [{ loader: 'eslint-loader' }]
        }, {
            test: /\.modernizrrc(\.json)?$/,
            use: [{
                loader: 'modernizr-loader'
            }, {
                loader: 'json-loader'
            }]
        }, {
            test: /\.ts$/,
            loader: 'awesome-typescript-loader',
            include: [src]
        }, {
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                }
            }]
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            include: [
                //path.resolve(projectRoot, 'node_modules/bootstrap'),
                //path.resolve(projectRoot, 'node_modules/foundation-sites'),
                src
            ],
            use: 'happypack/loader?id=js'
        }, {
            test: /\.json$/,
            exclude: /favicons/,
            loader: 'json-loader'
        }, {
            test: /\.html$/,
            use: [{
                loader: 'html-loader',
                options: {
                    minimize: false,
                    removeComments: config.production,
                    customAttrAssign: [/\)?\]?=/],
                    ignoreCustomFragments: [/\{\{.*?}}/],
                    root: src,
                    attrs: ['img:src', 'img:data-interchange', 'link:href']
                }
            }]
        }, {
            test: /\.tpl\.pug$/,
            include: path.join(src, 'components'),
            use: [{
                loader: 'pug-loader'
            }]
        }, {
            test: /\.pug$/,
            exclude: /\.tpl\.pug$/,
            use: [{
                loader: 'html-loader',
                options: {
                    minimize: false,
                    removeComments: config.production,
                    customAttrAssign: [/\)?\]?=/],
                    ignoreCustomFragments: [/\{\{.*?}}/],
                    root: src,
                    attrs: ['img:src', 'img:data-interchange', 'link:href']
                }
            }, {
                loader: 'pug-html-loader',
                options: {
                    pretty: '  ',
                    basedir: src,
                    exports: false,
                    debug: false,
                    compileDebug: false,
                    cache: true,
                    data: {
                        __DEV__: config.development,
                        __PROD__: config.production,
                        _: _
                    }
                }
            }]
        }, {
            test: /\.(png|ico|json|xml|svg)$/i,
            include: path.join(src, 'static', 'misc', 'favicons'),
            use: [{
                loader: 'file-loader',
                options: {
                    name: path.posix.join(run().assetsSubDirectory || '', 'misc/favicons/[name].[ext]')
                }
            }]
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: path.posix.join(run().assetsSubDirectory || '', 'fonts/[name].[hash:7].[ext]')
            }
        }]
    },
    node: {
        fs: 'empty',
        global: true,
        crypto: 'empty',
        process: true,
        module: false,
        clearImmediate: false,
        setImmediate: false
    },
    plugins: [
        new CheckerPlugin(),

        createHappyPlugin('js', [{
            loader: 'babel-loader'
        }]),

        new webpack.optimize.ModuleConcatenationPlugin(),

        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.jquery': 'jquery',

            Breakpoints: 'breakpoints-js',
            'window.Breakpoints': 'breakpoints-js',

            _: 'lodash',
            'window._': 'lodash',

            Popper: ['popper.js', 'default'],
            Util: 'exports-loader?Util!bootstrap/js/dist/util',
            Tooltip: 'exports-loader?Tooltip!bootstrap/js/dist/tooltip'
        }),

        new webpack.DefinePlugin({
            'process.env': run().env,
            __PROD__: config.production,
            __DEV__: config.development
        }),

        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),

        new webpack.optimize.CommonsChunkPlugin({
            name: ['vendors', 'polyfills']
        }),

        ...views.map(entry => {
            return new webpack.optimize.CommonsChunkPlugin({
                name: entry.name,
                async: true,
                minChunks: (module, count) => count >= 2 && isVendor(module)
            });
        }),

        ...views.map(entry => {
            return new HtmlWebpackPlugin({
                filename: `${entry.name}.html`,
                template: entry.filename,
                chunks: entry.chunks,
                includeDependent: true,
                inject: true,
                hash: false,
                cache: true,
                minify: config.production ? {
                    minimize: false,
                    preserveLineBreaks: true,
                    sortClassName: true,
                    sortAttributes: true
                } : false,
                chunksSortMode: 'dependency'
                //chunksSortMode: (a, b) => {
                //    let order = ['dependency', 'app', entry.name];
                //    return order.indexOf(a.names[0]) - order.indexOf(b.names[0]);
                //}
            });
        })
    ],
    performance: {
        hints: process.env.NODE_ENV === 'production' ? 'warning' : false
    }
});
