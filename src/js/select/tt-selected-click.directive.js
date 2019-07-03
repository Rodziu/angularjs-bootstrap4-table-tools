/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
!function(){
	'use strict';

	function ttSelectedClickDirective(){
		return {
			restrict: 'AE',
			require: '^tableTools',
			replace: true,
			scope: {
				ttSelectedClick: '<'
			},
			link(scope, element, attr, tableTools){
				scope.isDisabled = function(){
					return !tableTools.ttSelect.hasSelected();
				};
				scope.$watch('isDisabled()', function(nV){
					element.attr('disabled', nV);
				});
				element.on('click', function(){
					const selected = tableTools.ttSelect.getSelected();
					if(selected.length){
						scope.ttSelectedClick(selected);
						scope.$apply();
					}
				});
			}
		};
	}

	angular.module('tableTools.select').directive('ttSelectedClick', ttSelectedClickDirective);
}();
