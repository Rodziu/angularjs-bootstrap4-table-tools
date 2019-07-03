/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

angular.module('tableTools.pagination').component('ttPerPage', {
	require: {
		tableTools: '^tableTools'
	},
	controllerAs: 'vm',
	template: '<div class="form-group">' +
		'<label>{{::vm.tableTools.lang.perPage}}&nbsp;</label>' +
		'<select class="form-control" ng-model="vm.tableTools.perPage" ng-change="vm.tableTools.filterData()"' +
		' ng-options="o.number as o.text for o in vm.tableTools.perPageOptions"></select>' +
		'</div>'
});
