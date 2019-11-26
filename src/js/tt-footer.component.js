/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
!function(){
	'use strict';

	/**
	 * @ngdoc component
	 * @name ttFooter
	 */
	angular.module('tableTools').component('ttFooter', {
		require: {
			tableTools: '^tableTools'
		},
		template: '<div class="row">' +
        '<tt-results-count class="col align-self-center"></tt-results-count>' +
        '<tt-pagination class="col col-auto"></tt-pagination>' +
        '</div>'
	});
}();
