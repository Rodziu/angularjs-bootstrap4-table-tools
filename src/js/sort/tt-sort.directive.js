/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
!function(){
	'use strict';

	function ttSortDirective(){
		return {
			restrict: 'A',
			require: ['^tableTools', 'ttSort'],
			controller: ['$element', function($element){
				/**
				 * Update sorting item class
				 * @param {string} state
				 */
				this.updateState = function(state){
					if(this.state !== state){
						if(this.state){
							$element.removeClass('sorting-' + this.state);
						}
						if(state){
							$element.addClass('sorting-' + state);
						}
						this.state = state;
					}
				};
			}],
			link(scope, element, attrs, ctrl){
				const tableTools = ctrl[0],
					sortCtrl = ctrl[1];
				//
				tableTools.ttSort.register(attrs['ttSort'], sortCtrl);
				scope.$on('$destroy', function(){
					tableTools.ttSort.unregister(attrs['ttSort'], sortCtrl);
				});
				//
				element.on('click', function(e){
					if(!e.shiftKey){ // change sorting direction
						if(tableTools.order === attrs['ttSort']){
							tableTools.order = '-' + attrs['ttSort'];
						}else{
							tableTools.order = attrs['ttSort'];
						}
					}else{ // append to current order array
						if(angular.isString(tableTools.order)){
							tableTools.order = [tableTools.order];
						}else if(!angular.isArray(tableTools.order)){
							tableTools.order = [];
						}
						let found = false;
						for(let i = 0; i < tableTools.order.length; i++){
							if(tableTools.order[i] === attrs['ttSort']){
								tableTools.order[i] = '-' + attrs['ttSort'];
								found = true;
								break;
							}
							if(tableTools.order[i] === '-' + attrs['ttSort']){
								tableTools.order[i] = attrs['ttSort'];
								found = true;
								break;
							}
						}
						if(!found){
							tableTools.order.push(attrs['ttSort']);
						}
					}
					scope.$apply();
				});
			}
		};
	}

	/**
	 * @ngdoc directive
	 * @name sort
	 */
	angular.module('tableTools.sort').directive('ttSort', ttSortDirective);
}();
