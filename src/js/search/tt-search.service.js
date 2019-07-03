/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
!function(){
	'use strict';

	function ttSearchService(){
		const compareWithOperator = function(variable, search, operator){
				if(angular.isObject(search)){
					for(let s in search){
						if(search.hasOwnProperty(s) && compareWithOperator(variable, search[s], operator)){
							return true;
						}
					}
					return false;
				}
				if(angular.isObject(variable)){
					for(const v in variable){
						if(
							variable.hasOwnProperty(v)
							&& v !== '$$hashKey'
							&& compareWithOperator(variable[v], search, operator)
						){
							return true;
						}
					}
					return false;
				}
				if(angular.isUndefined(operator) || operator === 'like'){
					return !!~variable.toLowerCase().indexOf(search.toLowerCase())
				}else{
					switch(operator){
						case '>':
							return variable > search;
						case '<':
							return variable < search;
						case '>=':
							return variable >= search;
						case '<=':
							return variable <= search;
						case '==':
							// noinspection EqualityComparisonWithCoercionJS
							return variable == search;
						default:
							return true;
					}
				}
			},
			hasSearchString = function(variable, search){
				if(angular.isObject(variable)){
					for(const v in variable){
						if(
							variable.hasOwnProperty(v)
							&& v !== "$$hashKey"
							&& hasSearchString(variable[v], search)
						){
							return true;
						}
					}
				}else{ // noinspection EqualityComparisonWithCoercionJS
					if(
						(angular.isNumber(variable) && variable == search)
						|| (angular.isString(variable) && !!~variable.toLowerCase().indexOf(search))
					){
						return true;
					}
				}
				return false;
			};
		return function(){
			const self = this,
				filters = {};
			/**
			 * @type {string}
			 */
			self.search = "";
			/**
			 * @param field
			 * @param controller
			 */
			self.registerFilter = function(field, controller){
				if(!(field in filters)){
					filters[field] = [];
				}
				filters[field].push(controller);
			};
			/**
			 * @param field
			 * @param controller
			 */
			self.unregisterFilter = function(field, controller){
				filters[field].splice(filters[field].indexOf(controller), 1);
				if(!filters[field].length){
					delete filters[field];
				}
			};
			/**
			 */
			self.getFiltersArray = function(){
				const result = {};
				for(const f in filters){
					if(filters.hasOwnProperty(f)){
						result[f] = [];
						for(let i = 0; i < filters[f].length; i++){
							const filter = filters[f][i],
								value = filter.getValue();
							// noinspection EqualityComparisonWithCoercionJS
							if(
								angular.isUndefined(value)
								|| value == filter.ttFilterEmpty
								|| (angular.isDefined(filter.length) && !filter.length)
							){ // skip empty filters
								continue;
							}
							result[f].push({
								value: value,
								operator: filter.ttFilterOperator,
								isOr: filter.ttFilterOr
							});
						}
					}
				}
				return result;
			};
			/**
			 * @param {Array} data
			 * @returns {Array}
			 */
			self.doSearch = function(data){
				if(
					!data.length
					|| (
						(
							(!angular.isString(self.search) && !angular.isNumber(self.search))
							|| self.search === ''
						)
						&& !Object.keys(filters).length
					)
				){
					return data;
				}
				const results = [],
					search = angular.isString(self.search)
						? self.search.toLowerCase()
						: (angular.isNumber(self.search) ? self.search : '');
				angular.forEach(data, (row) => {
					if(search === "" || hasSearchString(row, search)){
						for(const f in filters){
							if(filters.hasOwnProperty(f) && angular.isDefined(row[f])){
								let filterResult = true,
									anyPass = false,
									orCondition = false;
								for(let i = 0; i < filters[f].length; i++){
									const filter = filters[f][i],
										value = filter.getValue();
									// noinspection EqualityComparisonWithCoercionJS
									if(
										angular.isUndefined(value)
										|| value == filter.ttFilterEmpty
										|| (angular.isDefined(filter.length) && !filter.length)
									){ // skip empty filters
										continue;
									}
									if(!compareWithOperator(row[f], value, filter.ttFilterOperator)){
										if(filter.ttFilterOr){
											orCondition = true;
										}else{
											filterResult = false;
											break;
										}
									}else{
										anyPass = true;
									}
								}
								if(orCondition && !anyPass){ // or filter passes if any other filter has passed
									filterResult = false;
								}
								if(!filterResult){
									return;
								}
							}
						}
						results.push(row);
					}
				});
				return results;
			};
		};
	}

	/**
	 * @ngdoc factory
	 * @name ttSearch
	 */
	angular.module('tableTools.search').factory('ttSearch', ttSearchService);
}();
