/**
 * Created by Labtec on 23.06.2017.
 */

'use strict';

/**
 * Styles
 */
import './title.scss';

/**
 * Core
 */

import Component from '../../static/js/global/component';


export default class extends Component {
    processed() {
        console.info('%cTitle component', 'color: green');
    }
}
