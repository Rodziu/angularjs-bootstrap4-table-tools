/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
!function(){
	'use strict';

	function ttSortService(){
		const isObject = function(value){
				return value !== null && angular.isObject(value);
			},
			isNumeric = function(n){
				return !isNaN(parseFloat(n)) && isFinite(n);
			},
			compare = function(v1, v2){
				if(v1.type === v2.type){
					if(v1.type === 'string'){
						if(isNumeric(v1.value) && isNumeric(v2.value)){
							return parseFloat(v1.value) < parseFloat(v2.value) ? -1 : 1;
						}
						// Compare strings case-insensitively
						v1.value = v1.value.toLowerCase();
						v2.value = v2.value.toLowerCase();
					}else if(v1.type === 'object'){
						// For basic objects, use the position of the object
						// in the collection instead of the value
						if(isObject(v1.value)){
							v1.value = v1.index;
						}
						if(isObject(v2.value)){
							v2.value = v2.index;
						}
					}
					if(v1.value !== v2.value){
						if(angular.isFunction(v1.value.localeCompare)){
							return v1.value.localeCompare(v2.value);
						}else{
							return v1.value < v2.value ? -1 : 1;
						}
					}
				}else{
					return v1.type < v2.type ? -1 : 1;
				}
			};
		return function(){
			const self = this,
				sortItems = {},
				parseOrderItem = function(orderItem, parsed){
					if(orderItem[0] === '-'){
						parsed[orderItem.substring(1)] = 'desc';
					}else{
						parsed[orderItem] = 'asc';
					}
				},
				parseOrder = function(orderValue){
					const parsed = {};
					if(angular.isDefined(orderValue)){
						if(angular.isString(orderValue)){
							parseOrderItem(orderValue, parsed);
						}else if(angular.isDefined(orderValue.length)){
							for(let i = 0; i < orderValue.length; i++){
								parseOrderItem(orderValue[i], parsed);
							}
						}
					}
					return parsed;
				};
			let lastOrder,
				sortItemsId = 0,
				lastSortItems = 0;
			self.compareFn = compare;
			/**
			 * @param field
			 * @param controller
			 */
			self.register = function(field, controller){
				if(!(field in sortItems)){
					sortItems[field] = [];
				}
				sortItems[field].push(controller);
				sortItemsId++;
			};
			/**
			 * @param field
			 * @param controller
			 */
			self.unregister = function(field, controller){
				sortItems[field].splice(sortItems[field].indexOf(controller), 1);
				if(!sortItems[field].length){
					delete sortItems[field];

				}
				sortItemsId++;
			};
			/**
			 * @param orderValue
			 * @returns {Array}
			 */
			self.getOrder = function(orderValue){
				const order = [],
					parsed = parseOrder(orderValue);
				for(const p in parsed){
					if(parsed.hasOwnProperty(p)){
						order.push({
							col: p,
							dir: parsed[p]
						});
					}
				}
				return order;
			};
			/**
			 * Propagate order change to all child sort directives
			 * @param orderValue
			 */
			self.orderUpdate = function(orderValue){
				if(!angular.equals(orderValue, lastOrder) || lastSortItems !== sortItemsId){
					const parsed = parseOrder(orderValue);
					//
					for(let field in sortItems){
						if(sortItems.hasOwnProperty(field)){
							for(let i = 0; i < sortItems[field].length; i++){
								sortItems[field][i].updateState(
									parsed[field]
								);
							}
						}
					}
					lastOrder = angular.copy(orderValue);
					lastSortItems = sortItemsId;
					return true;
				}
				return false;
			};
		};
	}

	/**
	 * @ngdoc factory
	 * @name ttSort
	 */
	angular.module('tableTools.sort').factory('ttSort', ttSortService);
}();
