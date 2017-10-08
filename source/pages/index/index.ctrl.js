/**
 * Created by Labtec on 16.06.2017.
 */
'use strict';

import $ from 'jquery';

import App from '../../static/js/index';

/**
 * Components
 */
import PlanCard from '../../components/plan-card/plan-card';
import '../../components/title/title';
import Form from '../../components/form/form';

class Index extends App {
    processed() {
        super.processed();

        console.info('Главная страница');
    }

    getDefaultChildren() {
        let form = new Form({
            $el: $('#defaultForm'),
            $url: `${(__DEV__ ? '/api' : 'http://jsonplaceholder.typicode.com')}/posts`
        });

        let planCard = new PlanCard();

        return super.getDefaultChildren().concat(form, planCard);
    }
}

let instance = null;

function getInstance() {
    if (!instance) {
        instance = new Index();
    }

    return instance;
}

function run() {
    let app = getInstance();
    app.run();
}

export default Index;

export {
    Index,
    run,
    getInstance
};
