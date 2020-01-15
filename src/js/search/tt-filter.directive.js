/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
!(function() {
    'use strict';

    function ttFilterDirectiveController($attrs) {
        const ctrl = this;
        if ('type' in $attrs && $attrs['type'] === 'checkbox') {
            $attrs.$observe('value', function(value) {
                ctrl.value = value;
            });
        }
        /**
		 * @returns {string}
		 */
        ctrl.getValue = function() {
            if (angular.isDefined(ctrl.value)) {
                return ctrl.ngModel ? ctrl.value : ctrl.ttFilterEmpty;
            }
            return ctrl.ngModel;
        };
        /**
		 */
        ctrl.init = function() {
            if (angular.isUndefined(ctrl.ttFilterOperator)) {
                ctrl.ttFilterOperator = '==';
            }
            if (angular.isUndefined(ctrl.ttFilterEmpty)) {
                ctrl.ttFilterEmpty = '';
            }
            ctrl.ttFilterOr = 'ttFilterOr' in $attrs || ('type' in $attrs && $attrs['type'] === 'checkbox');
            ctrl.tableTools.ttSearch.registerFilter(ctrl.ttFilter, ctrl);
            ctrl.tableTools.filterData();
        };
        /**
		 * @param changes
		 */
        ctrl.$onChanges = function(changes) {
            if ('ngModel' in changes && 'tableTools' in ctrl) {
                ctrl.tableTools.filterData();
            }
        };
        /**
		 */
        ctrl.$onDestroy = function() {
            ctrl.tableTools.ttSearch.unregisterFilter(ctrl.ttFilter, ctrl);
        }
    }

    function ttFilterDirective() {
        return {
            restrict: 'A',
            require: ['ttFilter', '^tableTools', 'ngModel'],
            link(scope, element, attrs, ctrl) {
                ctrl[0].tableTools = ctrl[1];
                ctrl[0].init();
            },
            bindToController: {
                ttFilter: '@',
                ttFilterOperator: '@',
                ttFilterEmpty: '@',
                ngModel: '<'
            },
            controller: ttFilterDirectiveController
        };
    }

    /**
	 * @ngdoc directive
	 * @param {string} ttFilter
	 * @param {string} ttFilterOperator
	 * @param {string} ttFilterEmpty
	 * @param {string} ttFilterOr
	 */
    angular.module('tableTools.search').directive('ttFilter', ttFilterDirective);
}());
