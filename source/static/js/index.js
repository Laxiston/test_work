/**
 * Created by Labtec on 04.05.2017.
 */
'use strict';
/**
 * Styles
 */
import '../scss/plugins.scss';
import '../scss/main.scss';

/**
 * Plugins
 */
import $ from 'jquery';
import _ from 'lodash';
import Breakpoints from 'breakpoints-js';

/**
 * Core
 */
import Base from './global/base';

/**
 * Core plugins
 */
import './plugin/animsition';
import './plugin/material';
import './plugin/select2';
import './plugin/mask';
import './plugin/modal';

/**
 * Core components
 */

let DOC = document;
let $DOC = $(document);
//let WIN = window;
let $WIN = $(window);
let $BODY = $('body');

/**
 * Core Initialization
 */
class App extends Base {
    willProcess() {
        App.startLoading();
        this.initializePluginAPIs();
        this.initializePlugins();

        /* eslint-disable no-new */
        new Breakpoints({
            xs: {
                min: 0,
                max: 767
            },
            sm: {
                min: 768,
                max: 991
            },
            md: {
                min: 992,
                max: Infinity
            }
        });
    }

    processed() {
        this.polyfillIEWidth();
        this.initBootstrap();
        this.getCurrentBreakpoint();
        this.windowResizeHandler();
    }

    getCurrentBreakpoint() {
        let bp = Breakpoints.current();
        return bp ? bp.name : 'md';
    }

    initBootstrap() {
        // Tooltip setup
        // =============
        $DOC.tooltip({
            selector: '[data-tooltip=true]',
            container: 'body'
        });

        $('[data-toggle="tooltip"]').tooltip({
            placement: 'auto',
            template: '<div class="b-tooltip tooltip" role="tooltip"><div class="b-tooltip__arrow arrow"></div><div class="b-tooltip__inner tooltip-inner"></div></div>'
        });

        $('a[href*="#"]:not([href="#"])')
            .click(function (e) {
                if (location.pathname.replace(/^\//, '') === e.pathname.replace(/^\//, '') && location.hostname === e.hostname) {
                    let target = $(e.hash);
                    e.preventDefault();
                    target = target.length ? target : $('[name=' + e.hash.slice(1) + ']');

                    if (target.length) {
                        $('html, body')
                            .stop(true, true)
                            .animate({
                                scrollTop: target.offset().top
                            }, 500);

                        return false;
                    }
                }
            });
    }

    polyfillIEWidth() {
        if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
            let msViewportStyle = DOC.createElement('style');

            msViewportStyle.appendChild(
                DOC.createTextNode('@-ms-viewport{width:auto!important}')
            );

            DOC.querySelector('head')
                .appendChild(msViewportStyle);
        }
    }

    windowResizeHandler() {
        $WIN.resize(() => {
            this.getCurrentBreakpoint();
        });
    }

    static startLoading() {
        if (__DEV__ || _.isUndefined($.fn.animsition)) {
            return false;
        }

        $BODY.animsition({
            inDuration: 1500,
            outDuration: 800,
            loadingClass: 'b-loader__overlay',
            loadingParentElement: 'html',
            loadingInner:
                `<div class="b-loader">
                    <img src="${require('../images/general/logo-full.svg')}">
                    <div class="b-loader__inner">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>`
        });
    }
}

let instance = null;

function getInstance() {
    if (!instance) {
        instance = new App();
    }
    return instance;
}

function run() {
    let site = getInstance();
    site.run();
}

export default App;

export {
    App,
    run,
    getInstance
};
