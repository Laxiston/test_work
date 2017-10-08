'use strict';

//import $ from 'jquery';
import _ from 'lodash';
import Plugin from '../global/plugin';

const NAME = 'select2';

class Select2 extends Plugin {
    getName() {
        return NAME;
    }

    static getDefaults() {
        return {
            placeholder: '',
            width: 'style',
            minimumResultsForSearch: Infinity
        };
    }

    static async connect() {
        await import(/* webpackChunkName: 'select2' */'select2');
    }

    bindEvents() {
        let that = this;
        let parent = that.$el.closest('.b-select');

        that.$el
            .on('select2:open', () => parent.addClass('b-select_open b-select_focus'))
            .on('select2:select', () => {
                if (that.$el.val() !== '') {
                    parent.addClass('b-select_open');
                } else {
                    parent.removeClass('b-select_open');
                }
            })
            .on('select2:close', () => {
                if (that.$el.length && !_.isEmpty(that.$el.val())) {
                    parent.removeClass('b-select_focus');
                } else {
                    parent.removeClass('b-select_open b-select_focus');
                }
            })
            .on('select2:unselect', () => parent.removeClass('b-select_open'));

        //this.$el.val('').trigger('change');
    }

    render() {
        let $el = this.$el;
        let options = this.options;

        Select2.connect()
            .then(() => {
                //require('select2/dist/css/select2.min.css');

                $el.select2(options);
                this.bindEvents();
            })
            .catch(err => {
                console.log(`Failed to load ${NAME}`, err);
                return false;
            });
    }
}

Plugin.register(NAME, Select2);

export default Select2;
