/**
 * Created by Labtec on 08.06.2017.
 */
'use strict';

import Component from './component';
import {
    pluginFactory,
    getPluginAPI
} from './plugin';

export default class extends Component {
    initializePlugins(context = false) {
        $('[data-plugin]', context || this.$el)
            .each((i, e) => {
                let $this = $(e);
                let name = $this.data('plugin');
                let plugin = pluginFactory(name, $this, $this.data());

                if (plugin) {
                    plugin.initialize();
                }
            });
    }

    initializePluginAPIs(context = document) {
        let apis = getPluginAPI();

        for (let name in apis) {
            if (apis.hasOwnProperty(name)) {
                getPluginAPI(name)(`[data-plugin=${name}]`, context);
            }
        }
    }
}
