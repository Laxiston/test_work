/**
 * Created by Labtec on 23.06.2017.
 */

'use strict';

/**
 * Styles
 */
import './navbar.scss';

/**
 * Core
 */
import Component from '../../static/js/global/component';

import Scrollbar from 'smooth-scrollbar';

const $BODY = $('body');

class Scrollable {
    constructor($el) {
        this.$el = $el;
        this.api = null;

        this.init();
    }

    init() {
        this.api = Scrollbar.init(this.$el[0], {
            alwaysShowTracks: true
        });
    }

    update() {
        if (this.api) {
            this.api.update();
        }
    }

    enable() {
        if (!this.api) {
            this.init();
        }

        if (this.api) {
            this.update();
        }
    }

    disable() {
        if (this.api) {
            this.api.stop();
        }
    }

    destroy() {
        if (this.api) {
            this.api.destroy();
        }
    }
}

export default class extends Component {
    constructor(...args) {
        super(...args);

        this.scrollable = new Scrollable(this.$target);
    }

    processed() {
        console.info('Navbar component');
    }

    getDefaultState() {
        return {
            menu: false // false = not open, true = open;
        };
    }

    getDefaultActions() {
        return {
            menu: 'toggle'
        };
    }

    open() {
        const that = this;

        this.animate(() => {
            that.$el.addClass('active');
            that.$toggle.addClass('active');

            $BODY.addClass('b-site_menu-active b-site_disable-scrolling');
        }, () => that.scrollable.enable);
    }

    close() {
        const that = this;

        this.animate(() => {
            that.$el.removeClass('active');
            that.$toggle.removeClass('active');

            $BODY.removeClass('b-site_menu-active b-site_disable-scrolling');
        }, () => that.scrollable.disable);
    }


    toggle(opened) {
        if (opened) {
            this.open();
        } else {
            this.close();
        }
    }

    animate(doing, callback) {
        Reflect.apply(doing, this, []);
        this.$target.trigger('changing.site.menu');

        setTimeout(() => {
            Reflect.apply(callback, this, []);

            this.$target.trigger('changed.site.menu');
        }, 500);
    }
}
