/**
 * Created by Labtec on 23.06.2017.
 */

'use strict';

import $ from 'jquery';
import _ from 'lodash';

/**
 * Styles
 */
import './form.scss';

/**
 * Core
 */
import Component from '../../static/js/global/component';
import { getDefaults } from '../../static/js/global/plugin';

class Modal {
    constructor($el) {
        this.$el = $el;
        this.api = null;

        this.init();
    }

    static async connect() {
        return await Promise.all([
            import(/* webpackChunkName: 'modal' */ 'izimodal')
        ]);
    }

    init() {
        Modal.connect().then(() => {
            this.api = this.$el.iziModal(_.assign(getDefaults('modal'), {
                group: 'alerts',
                width: 600,
                timeout: 5000,
                pauseOnHover: true,
                timeoutProgressbar: true,
                onOpening: () => this.startLoading(),
                onClosed: () => this.api.iziModal('setBackground', '#fff')
            }));
        });
    }

    toggle() {
        if (this.api) this.api.iziModal('toggle');
    }

    open() {
        if (!this.api) this.init();
        if (this.api) this.api.iziModal('open');
    }

    success() {
        if (this.api) {
            this.api.iziModal('setHeader', false);
            this.api.iziModal('setContent', {
                content: '<p class="success">Your message has been sent successfully</p>'
            });
            this.api.iziModal('setBackground', '#007b81');
        }
    }

    error(textStatus, errorThrown) {
        if (this.api) {
            this.api.iziModal('setHeader', false);
            this.api.iziModal('setContent', {
                content: `<p class="error">${errorThrown}</p>`
            });
            this.api.iziModal('setBackground', '#bd5b5b');
        }
    }

    close() {
        if (this.api) this.api.iziModal('close');
    }

    startLoading() {
        if (this.api) this.api.iziModal('startLoading');
    }

    stopLoading() {
        if (this.api) this.api.iziModal('stopLoading');
    }
}

export default class extends Component {
    processed() {
        console.info('%cForm component', 'color: green');

        this.modal = new Modal($('#successModal'));
        this.init();
        this.toggleContact();
    }

    get data() {
        let that = this;
        let $el = that.$el;
        let $url = that.$url;

        return {
            value: $el.serializeArray(),
            method: 'POST',
            url: $url
        };
    }

    init() {
        this.$el.submit(e => {
            e.preventDefault();

            this._animate(() => this.send());
        });
    }

    toggleContact() {
        let $checkbox = $('#forAdviser');
        let $toggleInput = $('[data-adviser]').find('input');

        $checkbox.on('change', () => {
            if ($checkbox.is(':checked')) {
                $toggleInput.prop('disabled', true);
            } else {
                $toggleInput.prop('disabled', false);
            }
        });
    }

    send() {
        let api = this.data;

        if (!_.isUndefined(api)) {
            $.ajax({
                type: api.method,
                url: api.url,
                data: api.value,
                cache: false,
                contentType: false,
                processData: false,
                beforeSend: (jqXHR, settings) => this._beforeSend(jqXHR, settings)
            })
                .done((data, textStatus, jqXHR) => this._success(data, textStatus, jqXHR))
                .fail((jqXHR, textStatus, errorThrown) => this._error(jqXHR, textStatus, errorThrown));
        }
    }

    _beforeSend() {
        this.modal.open();
    }

    _success(data, textStatus, jqXHR) {
        this._animate(() => this.modal.stopLoading(), this.modal.success(data, textStatus, jqXHR));
    }

    _error(textStatus, errorThrown) {
        this._animate(() => this.modal.stopLoading(), this.modal.error(textStatus, errorThrown));
    }

    _animate(doing, callback) {
        Reflect.apply(doing, this, []);

        if (callback) setTimeout(() => Reflect.apply(callback, this, []), 500);
    }
}
