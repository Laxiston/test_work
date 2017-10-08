/**
 * Created by Labtec on 07.06.2017.
 */

if (__DEV__) {
    require.ensure([], require => require('./index.pug'), 'index.tpl');
}

import { run } from './index.ctrl';

import './index.scss';

((document, window, $) => $(document).ready(run))(document, window, jQuery);
