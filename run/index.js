'use strict';

import devConfig from './development.babel';
import prodConfig from './production.babel';

export default function config(env = process.env.NODE_ENV || 'development') {
    if (env === 'production') {
        return prodConfig;
    } else {
        return devConfig;
    }
}
