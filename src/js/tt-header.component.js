/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
!function(){
	'use strict';

	/**
	 * @ngdoc component
	 * @name ttHeader
	 * @description collection of PerPage, search, export
	 */
	angular.module('tableTools').component('ttHeader', {
		require: {
			tableTools: '^tableTools'
		},
		template: '<div>' +
			'<div class="form-inline">' +
			'<tt-per-page></tt-per-page>' +
			'<tt-loading></tt-loading>' +
			'<tt-search class="ml-auto"></tt-search>' +
			'</div>' +
			'<tt-pagination class="tt-pagination-top">' +
			'<div class="pull-right tt-export"><tt-export></tt-export></div>' +
			'</tt-pagination>' +
			'</div>'
	});
}();
