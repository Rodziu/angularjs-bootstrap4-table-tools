/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
!function(){
	'use strict';
	angular.module('exampleApp', ['tableTools'])
		.controller('exampleCtrl', ['$http', '$log', function($http, $log){
			const vm = this;
			vm.exampleData = [];
			$http.get('mock_data.json').then(function(response){
				vm.exampleData = response.data;
			});
			vm.showSelected = function(data){
				$log.log(data);
			};

			vm.filters = {
				name: '',
				lastName: '',
				idMore: 0,
				idLess: 1001,
				male: true,
				female: true
			};
		}]);
}();
