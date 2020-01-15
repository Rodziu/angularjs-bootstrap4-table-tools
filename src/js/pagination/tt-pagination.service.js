/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
!(function() {
    'use strict';

    function ttPaginationService() {
        return function(visiblePageCount) {
            if (isNaN(visiblePageCount)) {
                visiblePageCount = 5;
            }
            const self = this,
                pagesAround = Math.floor(visiblePageCount / 2); // visible pages around current page
            self.page = 1;
            self.pages = 1;
            self.start = 0;
            self.end = 0;
            /**
             * @type {Array}
             */
            self.items = [];
            /**
             * @param {number} resultsLength
             * @param {number} perPage
             */
            self.paginate = function(resultsLength, perPage) {
                self.pages = Math.ceil(resultsLength / perPage);
                if (self.pages === 0) {
                    self.pages = 1;
                }
                if (self.page > self.pages) {
                    self.page = self.pages;
                }
                self.items = [];
                const pagesAfter = self.pages - self.page; // number of pages after currently selected page
                let i = self.page // we set a starting page in here
                    - (pagesAfter < pagesAround // we won't be able to display all pages after current page
                        ? visiblePageCount - 1 - pagesAfter // so we display the difference before current page
                        : pagesAround);
                if (i < 1) {
                    i = 1;
                }
                do {
                    self.items.push(i);
                    i++;
                } while (self.items.length < visiblePageCount && i <= self.pages);
                self.start = perPage === Infinity
                    ? 1
                    : Math.min(
                        ((self.page - 1) * perPage) + 1,
                        resultsLength
                    );
                self.end = Math.min(self.page * perPage, resultsLength);
            };
        };
    }

    /**
     * @ngdoc factory
     * @name ttPagination
     */
    angular.module('tableTools.pagination').factory('ttPagination', ttPaginationService);
}());
