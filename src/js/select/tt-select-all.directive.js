/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
!(function() {
    'use strict';

    function ttSelectAllDirective() {
        return {
            restrict: 'AE',
            require: '^tableTools',
            template: '<input type="checkbox" class="tt-select-all" ng-model="tableTools.ttSelect.selectAll" '
				+ 'ng-change="tableTools.ttSelect.changeAll()"/>',
            replace: true
        };
    }

    angular.module('tableTools.select').directive('ttSelectAll', ttSelectAllDirective);

}());
