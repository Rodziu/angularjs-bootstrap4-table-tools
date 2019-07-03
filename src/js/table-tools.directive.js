/*
* AngularJS TableTools Plugin
*  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
*  License: MIT
*/
!function(){
	'use strict';

	function tableToolsDirective($window){
		const scrollTo = function(target, duration){
			const cur = $window.scrollY,
				start = performance.now(),
				step = function(ts){
					const elapsed = ts - start;
					if(elapsed >= 1000){
						$window.scrollTo(0, target);
						return;
					}
					$window.scrollTo(0, cur - Math.sin((Math.PI / 2) / (duration / elapsed)) * (cur - target));
					$window.requestAnimationFrame(step);
				};
			$window.requestAnimationFrame(step);
		};
		return {
			restrict: 'A',
			scope: true,
			bindToController: {
				tableTools: '<',
				perPage: '<',
				perPageOptions: '<',
				order: '=?',
				ttUrl: '@',
				ttResolver: '<'
			},
			controllerAs: 'tableTools',
			controller: tableToolsDirectiveController
		};

		function tableToolsDirectiveController(
			$element, $document, $window, $filter, $q, $http, $timeout, $log,
			tableTools, ttPagination, ttSearch, ttSort, ttSelect
		){
			const ctrl = this;
			/**
			 */
			ctrl.$onInit = function(){
				ctrl.data = [];
				ctrl.dataLength = 0;
				ctrl.$element = $element;
				ctrl.lang = tableTools.lang;
				ctrl.ttSearch = new ttSearch();
				ctrl.pagination = new ttPagination();
				ctrl.ttSort = new ttSort();
				ctrl.ttSelect = new ttSelect(ctrl);
				if(angular.isUndefined(ctrl.perPage)){
					ctrl.perPage = tableTools.perPage;
				}
				if(angular.isUndefined(ctrl.perPageOptions)){
					ctrl.perPageOptions = tableTools.perPageOptions;
				}
				if(angular.isDefined(ctrl.ttUrl) && !angular.isFunction(ctrl.ttResolver)){
					if(angular.isFunction(tableTools['defaultTableToolsResolver'])){
						ctrl.ttResolver = tableTools['defaultTableToolsResolver'];
					}else{
						ctrl.ttResolver = function(limit, offset, order, search, filters, url){
							const deferred = $q.defer();
							$http.post(url, {
								getTableToolsData: 1,
								limit: limit,
								offset: offset,
								order: order,
								search: search,
								filters: filters
							}).then(function(response){
								deferred.resolve(response.data);
							}).catch(function(){
								deferred.reject();
							});
							return deferred.promise;
						};
					}
				}
				ctrl.filterData();
			};
			/**
			 * @param changes
			 */
			ctrl.$onChanges = function(changes){
				if('tableTools' in changes){
					ctrl.filterData();
				}
			};
			/**
			 */
			ctrl.$doCheck = function(){
				if(ctrl.ttSort.orderUpdate(ctrl.order)){
					ctrl.filterData();
				}
			};
			let lastResolve = {id: 0, timeout: null};
			/**
			 */
			ctrl.filterData = function(){
				if(angular.isUndefined(ctrl.ttSearch)){ // tableTools are not yet fully initialized
					return;
				}
				let timeout;
				ctrl.loading = true;
				if(angular.isFunction(ctrl.ttResolver)){
					timeout = 0;
					if(lastResolve.timeout !== null){
						$timeout.cancel(lastResolve.timeout);
						timeout = 750;
					}
					let id = ++lastResolve.id;
					lastResolve.timeout = $timeout(function(){
						ctrl.ttResolver(
							ctrl.perPage, (ctrl.pagination.page - 1) * ctrl.perPage,
							ctrl.ttSort.getOrder(ctrl.order),
							ctrl.ttSearch.search, ctrl.ttSearch.getFiltersArray(), ctrl.ttUrl
						).then(function(result){
							/** @var {{data: Array, count: number, countFiltered: number}} result */
							if(
								angular.isUndefined(result.data)
								|| !angular.isNumber(result.count)
								|| !angular.isNumber(result.countFiltered)
							){
								throw new Error("TableTools - wrong result format");
							}
							if(lastResolve.id === id){
								ctrl.data = result.data;
								ctrl.dataLength = result.count;
								ctrl.filteredCount = result.countFiltered;
							}
						}).catch(function(e){
							$log.error(e);
							if(lastResolve.id === id){
								ctrl.data = [];
								ctrl.dataLength = 0;
								ctrl.filteredCount = 0;
							}
						}).finally(function(){
							if(lastResolve.id === id){
								ctrl.pagination.paginate(ctrl.filteredCount, ctrl.perPage);
								ctrl.ttSelect.change();
								ctrl.loading = false;
								lastResolve.timeout = null;
							}
						});
					}, timeout);
					return;
				}
				timeout = 0;
				if(lastResolve.timeout !== null){
					$timeout.cancel(lastResolve.timeout);
					timeout = 50;
				}
				lastResolve.timeout = $timeout(function(){
					ctrl.data = angular.copy(ctrl.tableTools);
					ctrl.dataLength = ctrl.data.length;
					ctrl.data = ctrl.ttSearch.doSearch(ctrl.data);
					ctrl.filteredCount = ctrl.data.length;
					ctrl.data = $filter('orderBy')(ctrl.data, ctrl.order, false, ctrl.ttSort.compareFn);
					ctrl.pagination.paginate(ctrl.data.length, ctrl.perPage);
					ctrl.data = $filter('limitTo')(ctrl.data, ctrl.perPage, ctrl.pagination.start - 1);
					ctrl.ttSelect.change();
					lastResolve.timeout = null;
					ctrl.loading = false;
				}, timeout);
			};
			/**
			 * @param {number|string} page - number of page to change to, or 'prev|next' string
			 */
			ctrl.changePage = function(page){
				const originalPage = ctrl.pagination.page;
				if(page === 'prev'){
					if(ctrl.pagination.page > 1){
						ctrl.pagination.page--;
					}
				}else if(page === 'next'){
					if(ctrl.pagination.page < ctrl.pagination.pages){
						ctrl.pagination.page++;
					}
				}else if(!isNaN(page)){
					ctrl.pagination.page = page;
				}
				if(originalPage !== ctrl.pagination.page){
					ctrl.filterData();
				}
				scrollTo(
					Math.round(
						$element[0].getBoundingClientRect().top
						+ ($window.pageYOffset || $document[0].documentElement.scrollTop)
					) + tableTools.scrollOffset,
					1000
				);
			};
		}
	}

	/**
	 * @ngdoc directive
	 * @name tableTools
	 *
	 * @param {expression|Array} tableTools
	 * @param {expression|number} perPage
	 * @param {expression} perPageOptions
	 * @param {expression|number} order
	 * @param {expression|string} ttUrl
	 * @param ttResolver
	 */
	angular.module('tableTools').directive('tableTools', tableToolsDirective);

}();
