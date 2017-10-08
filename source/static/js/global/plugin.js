/**
 * Created by Labtec on 08.06.2017.
 */
'use strict';

import $ from 'jquery';
import _ from 'lodash';

let plugins = {};
let apis = {};

export default class Plugin {
    constructor($el, options = {}) {
        this.name = this.getName();
        this.$el = $el;
        this.options = options;
        this.isRendered = false;
    }

    getName() {
        return 'plugin';
    }

    render() {
        if ($.fn[this.name]) {
            this.$el[this.name](this.options);
        } else {
            return false;
        }
    }

    initialize() {
        if (this.isRendered) {
            return false;
        }
        this.render();
        this.isRendered = true;
    }

    static getDefaults() {
        return {};
    }

    static register(name, obj) {
        if (typeof obj === 'undefined') return;

        plugins[name] = obj;

        if (!_.isUndefined(obj.api)) {
            Plugin.registerApi(name, obj);
        }
    }

    static registerApi(name, obj) {
        let oApi = obj.api();

        if (_.isString(oApi)) {
            let api = obj.api()
                .split('|');
            let event = api[0] + `.plugin.${name}`;
            let func = api[1] || 'render';

            let callback = function (e) {
                /* eslint-disable no-invalid-this */
                let $el = $(this);
                let plugin = $el.data('pluginInstance');

                if (!plugin) {
                    plugin = new obj($el, $.extend(true, {}, getDefaults(name), $el.data()));
                    plugin.initialize();
                    $el.data('pluginInstance', plugin);
                }

                plugin[func](e);
            };

            apis[name] = (selector, context) => {
                if (context) {
                    $(context)
                        .off(event);

                    $(context)
                        .on(event, selector, callback);
                } else {
                    $(selector)
                        .on(event, callback);
                }
            };
        } else if (_.isFunction(oApi)) {
            apis[name] = oApi;
        }
    }
}

function getPluginAPI(name) {
    if (_.isUndefined(name)) {
        return apis;
    } else {
        return apis[name];
    }
}

function getPlugin(name) {
    if (!_.isUndefined(plugins[name])) {
        return plugins[name];
    } else {
        console.warn('Plugin:' + name + ' has no wrapped class.');
        return false;
    }
}

function getDefaults(name) {
    let PluginClass = getPlugin(name);

    if (PluginClass) {
        return PluginClass.getDefaults();
    } else {
        return {};
    }
}

function pluginFactory(name, $el, options = {}) {
    let PluginClass = getPlugin(name);

    if (PluginClass && _.isUndefined(PluginClass.api)) {
        return new PluginClass($el, $.extend(true, {}, getDefaults(name), options));
    } else if ($.fn[name]) {
        let plugin = new Plugin($el, options);
        plugin.getName = function () {
            return name;
        };
        plugin.name = name;
        return plugin;
    } else if (!_.isUndefined(PluginClass.api)) {
        console.log('Plugin:' + name + ' use api render.');
        return false;
    } else {
        console.warn('Plugin:' + name + ' script is not loaded.');
        return false;
    }
}

export {
    Plugin,
    getPluginAPI,
    getPlugin,
    getDefaults,
    pluginFactory
};
