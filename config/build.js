'use strict';

import check_versions from './check-versions';
check_versions();

import rm from 'rimraf';
import path from 'path';
import cls from 'cli-color';
import webpack from 'webpack';
import run from '../run';
import { webpackProgress } from './utils';
import prodConf from './webpack.prod.conf';

rm(path.join(run().output), err => {
    if (err) throw err;
    webpackProgress(webpack(prodConf, (err, stats) => {
        if (err) throw err;

        process.stdout.write(stats.toString({
            colors: true,
            timings: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }) + '\n\n');

        if (stats.hasErrors()) {
            console.log(cls.red('  Build failed with errors.\n'));
            process.exit(1);
        }

        console.log(cls.cyan('  Build complete.\n'));
        console.log(cls.yellow(
            '  Tip: built files are meant to be served over an HTTP server.\n' +
            '  Opening index.html over file:// won\'t work.\n'
        ));
    }), 'Compiling frontend');
});
