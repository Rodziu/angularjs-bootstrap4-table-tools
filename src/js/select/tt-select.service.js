/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
!function(){
	'use strict';

	function ttSelectService(){
		return function(tableTools){
			const self = this;
			self.selectAll = false;
			self.changeAll = function(){
				for(let d = 0; d < tableTools.data.length; d++){
					tableTools.data[d].ttSelected = tableTools.data[d].ttSelectable !== false
						? self.selectAll : false;
				}
			};
			self.change = function(){
				for(let d = 0; d < tableTools.data.length; d++){
					if(!tableTools.data[d].ttSelected && tableTools.data[d].ttSelectable !== false){
						self.selectAll = false;
						return;
					}
				}
				self.selectAll = true;
			};
			self.getSelected = function(){
				const selected = [];
				for(let d = 0; d < tableTools.data.length; d++){
					if(tableTools.data[d].ttSelected && tableTools.data[d].ttSelectable !== false){
						selected.push(tableTools.data[d]);
					}
				}
				return selected;
			};
			self.hasSelected = function(){
				return self.getSelected().length !== 0;
			};
		};
	}

	/**
	 * @ngdoc factory
	 * @name ttSelect
	 */
	angular.module('tableTools.select').factory('ttSelect', ttSelectService);
}();
