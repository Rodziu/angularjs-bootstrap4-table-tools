/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import {IComponentOptions} from 'angular';

export const ttPaginationComponent: IComponentOptions = {
    require: {
        tableTools: '^tableTools'
    },
    controllerAs: 'vm',
    transclude: true,
    templateUrl: 'src/templates/pagination.html'
};
