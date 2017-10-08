'use strict';

import $ from 'jquery';
import _ from 'lodash';
import Plugin from '../global/plugin';

const NAME = 'modal';

class ModalPlugin extends Plugin {
    getName() {
        return NAME;
    }

    static getDefaults() {
        return {
            bodyOverflow: true,
            restoreDefaultContent: true,
            icon: 'b-icon',
            iconText: 'home',
            width: 1200,
            borderBottom: false,
            radius: 0,
            padding: 20,
            zindex: 1007
        };
    }

    static async connect() {
        await import(/* webpackChunkName: 'modal' */ 'izimodal');
    }

    render() {
        if (_.isUndefined($.fn.iziModal)) {
            return;
        }

        let $el = this.$el;
        let options = this.options;

        ModalPlugin.connect().then(() => {
            $el.iziModal(options);
        });
    }
}

Plugin.register(NAME, ModalPlugin);

export default ModalPlugin;
