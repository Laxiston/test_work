'use strict';

import $ from 'jquery';
import _ from 'lodash';

export default class {
    constructor(states) {
        this._states = Object.assign({}, states);
        this._values = {};
        this._relations = {};
        this._callbacks = {};
        this._define();
    }

    _define() {
        let that = this;
        let keys = Object.keys(this._states);
        let obj = {};
        let tmpRelations = [];
        let composites = [];
        let getKeys = key => {
            tmpRelations.push(key);
            return that._states[key];
        };
        let getComposites = (object, key) => {
            let value = Reflect.apply(that._states[key], object, []);
            that._addRelation(key, tmpRelations);
            tmpRelations = [];
            that._values[key] = value;
            return value;
        };

        for (let i = 0, l = keys.length; i < l; i++) {
            let key = keys[i];
            let value = this._states[key];

            if (!_.isFunction(value)) {
                Reflect.defineProperty(obj, key, {
                    set: () => false,
                    get: () => getKeys(key),
                    enumerable: true,
                    configurable: true
                });

                this._values[key] = this._states[key];
                this._relations[key] = [];
            } else {
                composites.push(key);
            }
        }

        for (let i = 0, l = composites.length; i < l; i++) {
            let key = composites[i];

            Reflect.defineProperty(obj, key, {
                set: () => false,
                get: () => getComposites(obj, key),
                enumerable: true,
                configurable: true
            });

            // use get function to create the relationship
            obj[key];
        }
    }

    _compare(state) {
        if (this._states[state] !== this._values[state]) {
            let value = this._values[state];
            this._values[state] = this._states[state];
            this._dispatch(state, value, this._states[state]);
            this._compareComposite(state);
        }
    }

    _compareComposite(state) {
        let relations = this.getRelation(state);

        if (relations && relations.length > 0) {
            for (let i = 0, l = relations.length; i < l; i++) {
                let oState = relations[i];
                let value = this._states[oState]();

                if (value !== this._values[oState]) {
                    this._dispatch(oState, this._values[oState], value);
                    this._values[oState] = value;
                }
            }
        }
    }

    _addRelation(state, relations) {
        for (let i = 0, l = relations.length; i < l; i++) {
            let pros = relations[i];
            this._relations[pros].push(state);
        }
    }

    _dispatch(state, origValue, newValue) {
        if (this._callbacks[state]) {
            this._callbacks[state].fire([newValue, origValue]);
        }
    }

    getRelation(state) {
        return this._relations[state].length > 0 ? this._relations[state] : null;
    }

    on(state, callback) {
        if (_.isFunction(state)) {
            callback = state;
            state = 'all';
        }

        if (!this._callbacks[state]) {
            this._callbacks[state] = $.Callbacks();
        }
        this._callbacks[state].add(callback);
    }

    off(state, callback) {
        if (this._callbacks[state]) {
            this._callbacks[state].remove(callback);
        }
    }

    set(state, value, isDeep = false) {
        if (_.isString(state) && !_.isUndefined(value) && !_.isFunction(this._states[state])) {
            this._states[state] = value;
            if (!isDeep) this._compare(state);
        } else if (_.isObject(state)) {
            for (let key in state) {
                if (state.hasOwnProperty(key) && !_.isFunction(state[key])) {
                    this.set(key, state[key], true);
                    this._compare(key);
                }
            }
            /*
            for (let key in state) {
                if (typeof state[key] !== 'function') {
                    this._compare(key);
                }
            }
            */
        }

        return this._states[state];
    }

    get(state) {
        if (state) {
            return this._values[state];
        } else {
            return this._values;
        }
    }
}
