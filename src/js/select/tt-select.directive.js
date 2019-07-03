/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
!function(){
	'use strict';

	function ttSelectDirective(){
		return {
			restrict: 'AE',
			require: '^tableTools',
			template: '<input type="checkbox" ng-model="row.ttSelected" ng-disabled="!row.ttSelectable" ' +
				'ng-change="tableTools.ttSelect.change()"/>',
			replace: true,
			scope: {
				row: '=ttSelect'
			},
			link(scope, element, attr, tableTools){
				/**
				 * Reference to tableTools controller.
				 */
				scope.tableTools = tableTools;
				if(angular.isUndefined(scope.row.ttSelectable)){
					scope.row['ttSelectable'] = true;
				}
			}
		};
	}

	angular.module('tableTools.select').directive('ttSelect', ttSelectDirective);
}();
