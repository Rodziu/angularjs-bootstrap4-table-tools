/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
!(function() {
    'use strict';

    /**
     * @ngdoc component
     * @name ttHeader
     */
    angular.module('tableTools').component('ttHeader', {
        require: {
            tableTools: '^tableTools',
        },
        template: '<div class="form-inline">'
            + '<tt-per-page></tt-per-page>'
            + '<tt-loading></tt-loading>'
            + '<tt-search class="ml-auto"></tt-search>'
            + '</div>'
            + '<div class="row mt-3">'
            + '<tt-results-count class="col align-self-center"></tt-results-count>'
            + '<tt-pagination class="col col-auto pr-0"></tt-pagination>'
            + '<tt-export class="col col-auto pl-2"></tt-export>'
            + '</div>',
    });
}());
