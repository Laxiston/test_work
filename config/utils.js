'use strict';

import cls from 'cli-color';
import path from 'path';
import ProgressPlugin from 'webpack/lib/ProgressPlugin';
import ProgressBar from 'progress';

// Display a progress bar in the console output when compiling a webpack project
export function webpackProgress(compiler, headingMessage) {
    let bar = new ProgressBar(cls.green(headingMessage) + ` [:bar] ${cls.cyan(':percent')} :etas : :message`, {
            complete: '=',
            incomplete: ' ',
            width: 35,
            total: 100
        }),
        lastPercentage = 0;

    compiler.apply(new ProgressPlugin((percentage, msg) => {
        if (percentage > lastPercentage) {
            bar.update(percentage, { 'message': cls.bold.magenta(msg) });
            lastPercentage = percentage;
        } else {
            bar.update(lastPercentage, { 'message': cls.bold.magenta(msg) });
        }
        if (lastPercentage === 1) {
            lastPercentage = 0;
        }
    }));
}
