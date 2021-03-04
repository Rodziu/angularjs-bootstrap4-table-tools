/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import {IComponentOptions} from 'angular';

export const ttFooterComponent: IComponentOptions = {
    require: {
        tableTools: '^tableTools'
    },
    template: '<div class="row">'
        + '<tt-results-count class="col align-self-center"></tt-results-count>'
        + '<tt-pagination class="col col-auto"></tt-pagination>'
        + '</div>'
};
