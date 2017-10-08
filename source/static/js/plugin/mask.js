'use strict';

//import $ from 'jquery';
//import _ from 'lodash';
import Plugin from '../global/plugin';

const NAME = 'mask';

class Mask extends Plugin {
    getName() {
        return NAME;
    }

    static getDefaults() {
        return {
            rightAlign: false,
            showMaskOnFocus: false,
            showMaskOnHover: false,
            clearMaskOnLostFocus: true,
            clearIncomplete: true
        };
    }

    static async connect() {
        return await Promise.all([
            import(/* webpackChunkName: 'inputmask' */ 'inputmask'),
            import(/* webpackChunkName: 'inputmask' */ 'inputmask.extensions'),
            import(/* webpackChunkName: 'inputmask' */ 'inputmask.numeric.extensions'),
            import(/* webpackChunkName: 'inputmask' */ 'inputmask.phone.extensions'),
            import(/* webpackChunkName: 'inputmask' */ 'phone-codes')
        ]);
    }

    render() {
        //if (_.isUndefined($.fn.inputmask)) return;

        let $mask;
        let $el = this.$el;
        let options = this.options;

        Mask.connect().then(([mask]) => {
            $mask = new mask(options);
            $mask.mask($el[0]);
        }).catch(err => {
            console.log(`Failed to load ${NAME}`, err);
            return false;
        });
    }
}

Plugin.register(NAME, Mask);

export default Mask;
