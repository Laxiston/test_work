/**
 * Created by Labtec on 23.06.2017.
 */

'use strict';

import $ from 'jquery';

/**
 * Styles
 */
import './plan-card.scss';

/**
 * Core
 */
import Component from '../../static/js/global/component';

export default class extends Component {
    processed() {
        console.info('%cPlan card component', 'color: green');

        this.init();
        this.splitTitle();
    }

    init() {
        let $plan = $('[data-plan]');

        $.each($plan, (i, e) => {
            let current = $(e);
            let radio = current.find('input[type=radio]');

            current.find('.b-btn-holder__btn').on('click', ev => {
                ev.preventDefault();

                $plan.removeClass('is-active');
                radio.prop('checked', true);

                if (radio.is(':checked')) {
                    current.addClass('is-active');
                }
            });
        });
    }

    splitTitle() {
        let $title = $('[data-title]');

        $.each($title, (i, e) => {
            let replaced = $(e).text()
                .replace(/\s/ig, '')
                .split('')
                .map(s => `<span>${s}</span>`)
                .join('');

            $(e).html(replaced);
        });
    }
}
