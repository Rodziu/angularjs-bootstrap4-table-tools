/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2020 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

(function() {
    'use strict';

    function ttRowPlaceholderDirective() {
        return {
            restrict: 'A',
            require: {
                tableTools: '^tableTools'
            },
            controllerAs: 'vm',
            bindToController: true,
            controller: () => {
            },
            scope: true,
            template: '<td colspan="100%" ng-if="!vm.tableTools.data.length">'
                + '<tt-loading></tt-loading>'
                + '<span ng-if="!vm.tableTools.loading">{{::vm.tableTools.lang.noResults}}</span>'
                + '</td>'
        }
    }

    angular
        .module('tableTools')
        .directive('ttRowPlaceholder', ttRowPlaceholderDirective);
}());
