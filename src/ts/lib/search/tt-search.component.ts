/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import {IComponentOptions} from 'angular';

export const ttSearchComponent: IComponentOptions = {
    require: {
        tableTools: '^tableTools'
    },
    controllerAs: 'vm',
    template: '<div class="form-group">'
        + '<input type="text" class="form-control" ng-model="vm.tableTools.ttSearch.search" '
        + 'ng-change="vm.tableTools.filterData()" placeholder="{{::vm.tableTools.lang.search}}"/>'
        + '</div>'
};
