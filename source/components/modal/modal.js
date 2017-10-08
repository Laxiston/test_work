/**
 * Created by Labtec on 09.06.2017.
 */
'use strict';

/**
 * Styles
 */
import './modal.scss';

/**
 * Core
 */
import $ from 'jquery';
import _ from 'lodash';

import Component from '../../static/js/global/component';
import {
    getDefaults
} from '../../static/js/global/plugin';

class Modal {
    constructor($el) {
        this.$el = $el;
        this.api = null;

        this.init();
    }

    init() {
        import(/* webpackChunkName: 'izimodal' */ 'izimodal').then(() => {
            this.api = this.$el.iziModal(_.assignIn({}, getDefaults('modal')));
        });
    }

    toggle() {
        if (this.api) {
            this.api.iziModal('toggle');
        }
    }

    open() {
        if (!this.api) {
            this.init();
        }
        if (this.api) {
            this.api.iziModal('open');
        }
    }

    close() {
        if (this.api) {
            this.api.iziModal('close');
        }
    }

    startLoading() {
        if (this.api) {
            this.api.iziModal('startLoading');
        }
    }

    stopLoading() {
        if (this.api) {
            this.api.iziModal('stopLoading');
        }
    }
}

export default class extends Component {
    constructor(...args) {
        super(...args);

        this.$el = $(this.$el);

        this.modal = new Modal(this.$el);
    }

    processed() {
        console.info('%cModal component', 'color: green');
    }

    getDefaultState() {
        return {
            modal: false
        };
    }

    getDefaultActions() {
        return {
            modal: 'toggle'
        };
    }

    open() {
        this.animate(() => {
            //this.$el.find('.iziModal-content').html(this.html);
        }, () => {
            this.modal.open();
        });
    }

    close() {
        this.animate(() => {

        }, () => {
            this.modal.close();
        });
    }

    toggle(opened) {
        if (opened) {
            this.open();
        } else {
            this.close();
        }
    }

    startLoading() {
        this.modal.startLoading();
    }

    stopLoading() {
        this.modal.stopLoading();
    }

    animate(doing, callback) {
        Reflect.apply(doing, this, []);
        this.$el.trigger('changing.site.modal');

        setTimeout(() => {
            Reflect.apply(callback, this, []);
            this.$el.trigger('changed.site.modal');
        }, 0);
    }
}
