/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

!(function() {
    'use strict';

    /**
     * @ngdoc component
     * @name ttLoading
     */
    angular.module('tableTools').component('ttLoading', {
        require: {
            tableTools: '^tableTools'
        },
        bindings: {
            extraCondition: '<?'
        },
        controllerAs: 'vm',
        template: '<span ng-show="vm.tableTools.loading || vm.extraCondition">'
            + '&nbsp;<i class="fa fa-spinner fa-spin fa-lg"></i></span>',
    });
}());
