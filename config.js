/**
 * Created by Labtec on 04.05.2017.
 */
'use strict';
/*eslint no-process-env:0*/
const path = require('path');
/*jshint -W079 */

// All configurations will extend these options
// ============================================

const all = {
    env: process.env.NODE_ENV,

    production: (process.env.NODE_ENV === 'production'),
    development: (process.env.NODE_ENV === 'development'),

    // Root path of server
    root: path.normalize(__dirname),

    // Server port
    port: (process.env.NODE_ENV === 'production') ? process.env.PORT || 8080 : process.env.PORT || 3001,

    // Server IP
    ip: process.env.IP || '0.0.0.0',

    paths: {
        build: 'build',
        source: 'source',
        components: 'components',
        pages: 'pages',
        static: 'static',
        fonts: 'fonts',
        js: 'js',
        img: 'images',
        misc: 'misc',
        scss: 'scss'
    }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = all;
