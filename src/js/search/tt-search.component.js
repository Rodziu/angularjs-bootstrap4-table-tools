/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

angular.module('tableTools.search').component('ttSearch', {
    require: {
        tableTools: '^tableTools'
    },
    controllerAs: 'vm',
    template: '<div class="form-group">'
		+ '<input type="text" class="form-control" ng-model="vm.tableTools.ttSearch.search" '
		+ 'ng-change="vm.tableTools.filterData()" placeholder="{{::vm.tableTools.lang.search}}"/>'
		+ '</div>'
});
