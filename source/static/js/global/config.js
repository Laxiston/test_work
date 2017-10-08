/**
 * Created by Labtec on 08.06.2017.
 */
'use strict';

import $ from 'jquery';
import _ from 'lodash';

let values = {
    fontFamily: 'Noto Sans, sans-serif',
    primaryColor: 'blue',
    assets: '../assets'
};

function get(...names) {
    let data = values;
    let callback = (data, name) => data[name];

    for (let i = 0; i < names.length; i++) {
        let name = names[i];

        data = callback(data, name);
    }

    return data;
}

function set(name, value) {
    if (_.isString(name) && !_.isUndefined(value)) {
        values[name] = value;
    } else if (_.isObject(name)) {
        values = $.extend(true, {}, values, name);
    }
}

function getColor(name, level) {
    if (name === 'primary') {
        name = get('primaryColor');

        if (!name) {
            name = 'red';
        }
    }

    if (_.isUndefined(values.colors)) {
        return null;
    }

    if (!_.isUndefined(values.colors[name])) {
        if (level && !_.isUndefined(typeof values.colors[name][level])) {
            return values.colors[name][level];
        }

        if (_.isUndefined(level)) {
            return values.colors[name];
        }
    }

    return null;
}

function colors(name, level) {
    return getColor(name, level);
}

export {
    get,
    set,
    getColor,
    colors
};
