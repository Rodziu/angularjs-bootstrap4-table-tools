/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

angular.module('tableTools', [
    'tableTools.search', 'tableTools.pagination', 'tableTools.export', 'tableTools.select', 'tableTools.sort'
]);

/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

angular.module('tableTools.export', ['angularBS']);

/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

angular.module('tableTools.pagination', []);

/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

angular.module('tableTools.search', []);

/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

angular.module('tableTools.select', []);

/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

angular.module('tableTools.sort', []);

/*
* AngularJS TableTools Plugin
*  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
*  License: MIT
*/
!(function() {
    'use strict';

    tableToolsDirective.$inject = ["$window"];
    function tableToolsDirective($window) {
        tableToolsDirectiveController.$inject = ["$element", "$document", "$window", "$filter", "$q", "$http", "$timeout", "$log", "tableTools", "ttPagination", "ttSearch", "ttSort", "ttSelect"];
        const scrollTo = function(target, duration) {
            const cur = $window.scrollY,
                start = performance.now(),
                step = function(ts) {
                    const elapsed = ts - start;
                    if (elapsed >= 1000) {
                        $window.scrollTo(0, target);
                        return;
                    }
                    $window.scrollTo(0, cur - Math.sin((Math.PI / 2) / (duration / elapsed)) * (cur - target));
                    $window.requestAnimationFrame(step);
                };
            $window.requestAnimationFrame(step);
        };
        return {
            restrict: 'A',
            scope: true,
            bindToController: {
                tableTools: '<',
                perPage: '<',
                perPageOptions: '<',
                order: '=?',
                ttUrl: '@',
                ttResolver: '<'
            },
            controllerAs: 'tableTools',
            controller: tableToolsDirectiveController
        };

        function tableToolsDirectiveController(
            $element, $document, $window, $filter, $q, $http, $timeout, $log,
            tableTools, ttPagination, ttSearch, ttSort, ttSelect
        ) {
            const ctrl = this;
            /**
			 */
            ctrl.$onInit = function() {
                ctrl.data = [];
                ctrl.dataLength = 0;
                ctrl.$element = $element;
                ctrl.lang = tableTools.lang;
                ctrl.ttSearch = new ttSearch();
                ctrl.pagination = new ttPagination();
                ctrl.ttSort = new ttSort();
                ctrl.ttSelect = new ttSelect(ctrl);
                if (angular.isUndefined(ctrl.perPage)) {
                    ctrl.perPage = tableTools.perPage;
                }
                if (angular.isUndefined(ctrl.perPageOptions)) {
                    ctrl.perPageOptions = tableTools.perPageOptions;
                }
                if (angular.isDefined(ctrl.ttUrl) && !angular.isFunction(ctrl.ttResolver)) {
                    if (angular.isFunction(tableTools['defaultTableToolsResolver'])) {
                        ctrl.ttResolver = tableTools['defaultTableToolsResolver'];
                    } else {
                        ctrl.ttResolver = function(limit, offset, order, search, filters, url) {
                            const deferred = $q.defer();
                            $http.post(url, {
                                getTableToolsData: 1,
                                limit: limit,
                                offset: offset,
                                order: order,
                                search: search,
                                filters: filters
                            }).then(function(response) {
                                deferred.resolve(response.data);
                            }).catch(function() {
                                deferred.reject();
                            });
                            return deferred.promise;
                        };
                    }
                }
                ctrl.filterData();
            };
            /**
			 * @param changes
			 */
            ctrl.$onChanges = function(changes) {
                if ('tableTools' in changes) {
                    ctrl.filterData();
                }
            };
            /**
			 */
            ctrl.$doCheck = function() {
                if (ctrl.ttSort.orderUpdate(ctrl.order)) {
                    ctrl.filterData();
                }
            };
            const lastResolve = {id: 0, timeout: null};
            /**
			 */
            ctrl.filterData = function() {
                if (angular.isUndefined(ctrl.ttSearch)) { // tableTools are not yet fully initialized
                    return;
                }
                let timeout;
                ctrl.loading = true;
                if (angular.isFunction(ctrl.ttResolver)) {
                    timeout = 0;
                    if (lastResolve.timeout !== null) {
                        $timeout.cancel(lastResolve.timeout);
                        timeout = 750;
                    }
                    const id = ++lastResolve.id;
                    lastResolve.timeout = $timeout(function() {
                        ctrl.ttResolver(
                            ctrl.perPage, (ctrl.pagination.page - 1) * ctrl.perPage,
                            ctrl.ttSort.getOrder(ctrl.order),
                            ctrl.ttSearch.search, ctrl.ttSearch.getFiltersArray(), ctrl.ttUrl
                        ).then(function(result) {
                            /** @var {{data: Array, count: number, countFiltered: number}} result */
                            if (
                                angular.isUndefined(result.data)
								|| !angular.isNumber(result.count)
								|| !angular.isNumber(result.countFiltered)
                            ) {
                                throw new Error('TableTools - wrong result format');
                            }
                            if (lastResolve.id === id) {
                                ctrl.data = result.data;
                                ctrl.dataLength = result.count;
                                ctrl.filteredCount = result.countFiltered;
                                if (ctrl.pagination.page > 1 && !ctrl.data.length) {
                                    ctrl.changePage(1);
                                }
                            }
                        }).catch(function(e) {
                            $log.error(e);
                            if (lastResolve.id === id) {
                                ctrl.data = [];
                                ctrl.dataLength = 0;
                                ctrl.filteredCount = 0;
                            }
                        }).finally(function() {
                            if (lastResolve.id === id) {
                                ctrl.pagination.paginate(ctrl.filteredCount, ctrl.perPage);
                                ctrl.ttSelect.change();
                                ctrl.loading = false;
                                lastResolve.timeout = null;
                            }
                        });
                    }, timeout);
                    return;
                }
                timeout = 0;
                if (lastResolve.timeout !== null) {
                    $timeout.cancel(lastResolve.timeout);
                    timeout = 50;
                }
                lastResolve.timeout = $timeout(function() {
                    ctrl.data = angular.copy(ctrl.tableTools);
                    ctrl.dataLength = ctrl.data.length;
                    ctrl.data = ctrl.ttSearch.doSearch(ctrl.data);
                    ctrl.filteredCount = ctrl.data.length;
                    ctrl.data = $filter('orderBy')(ctrl.data, ctrl.order, false, ctrl.ttSort.compareFn);
                    ctrl.pagination.paginate(ctrl.data.length, ctrl.perPage);
                    ctrl.data = $filter('limitTo')(ctrl.data, ctrl.perPage, ctrl.pagination.start - 1);
                    ctrl.ttSelect.change();
                    lastResolve.timeout = null;
                    ctrl.loading = false;
                }, timeout);
            };
            /**
			 * @param {number|string} page - number of page to change to, or 'prev|next' string
			 */
            ctrl.changePage = function(page) {
                const originalPage = ctrl.pagination.page;
                if (page === 'prev') {
                    if (ctrl.pagination.page > 1) {
                        ctrl.pagination.page--;
                    }
                } else if (page === 'next') {
                    if (ctrl.pagination.page < ctrl.pagination.pages) {
                        ctrl.pagination.page++;
                    }
                } else if (!isNaN(page)) {
                    ctrl.pagination.page = page;
                }
                if (originalPage !== ctrl.pagination.page) {
                    ctrl.filterData();
                }
                scrollTo(
                    Math.round(
                        $element[0].getBoundingClientRect().top
						+ ($window.pageYOffset || $document[0].documentElement.scrollTop)
                    ) + tableTools.scrollOffset,
                    1000
                );
            };
        }
    }

    /**
	 * @ngdoc directive
	 * @name tableTools
	 *
	 * @param {expression|Array} tableTools
	 * @param {expression|number} perPage
	 * @param {expression} perPageOptions
	 * @param {expression|number} order
	 * @param {expression|string} ttUrl
	 * @param ttResolver
	 */
    angular.module('tableTools').directive('tableTools', tableToolsDirective);

}());

/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
!(function() {
    'use strict';

    function tableToolsProvider() {
        this.perPage = 25;
        this.perPageOptions = [
            {number: 10, text: 10},
            {number: 25, text: 25},
            {number: 50, text: 50},
            {number: 100, text: 100},
            {number: 200, text: 200},
            {number: Infinity, text: 'Wszystkie'}
        ];
        this.scrollOffset = 0;
        this.lang = {
            first: 'Pierwsza strona',
            prev: 'Poprzednia strona',
            next: 'Następna strona',
            last: 'Ostatnia strona',
            results: 'Wyniki:',
            from: 'z',
            perPage: 'Wyników na stronę:',
            search: 'Szukaj...',
            filteredResults: 'Filtrowanie z:',
            export: 'Export',
            exportChooseColumns: 'Wybierz kolumny',
            flipSelection: 'odwróć zaznaczenie',
            exportColumnNames: 'Eksportuj nazwy kolumn',
            exportSeparator: 'Separator',
            tabulator: 'Tabulator',
            copy: 'Kopiuj',
            csv: 'CSV',
            copiedToClipboard: 'Skopiowano do schowka',
            noResults: 'Nie znaleziono żadnych wyników!'
        };
        this.exportTypes = {
            copy: {
                lang: this.lang.copy
            },
            csv: {
                lang: this.lang.csv,
                parseText: function(txt) {
                    return '"' + txt.replace('"', '""') + '"';
                }
            }
        };
        this.exportNotification = function(type) {
            if (type === 'copy') {
                // eslint-disable-next-line no-alert
                alert(this.lang.copiedToClipboard);
            }
        };
        // noinspection JSUnusedGlobalSymbols
        this.$get = function() {
            return this;
        };
    }

    angular.module('tableTools').provider('tableTools', tableToolsProvider);
}());

/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
!(function() {
    'use strict';

    /**
	 * @ngdoc component
	 * @name ttFooter
	 */
    angular.module('tableTools').component('ttFooter', {
        require: {
            tableTools: '^tableTools'
        },
        template: '<div class="row">'
        + '<tt-results-count class="col align-self-center"></tt-results-count>'
        + '<tt-pagination class="col col-auto"></tt-pagination>'
        + '</div>'
    });
}());

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

/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

angular.module('tableTools.pagination').component('ttResultsCount', {
    require: {
        tableTools: '^tableTools'
    },
    controllerAs: 'vm',
    transclude: true,
    templateUrl: 'src/templates/results-count.html'
});

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

/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
!(function() {
    'use strict';

    /**
	 * @ngInject
	 * @property tableToolsCtrl
	 */
    class ttExportController {
        constructor($document, $q, tableTools) {
            this.$document = $document;
            this.$q = $q;
            this.tableTools = tableTools;
            // /
            this.exportTypes = tableTools.exportTypes;
            this.separators = [
                {lang: ',', separator: ','},
                {lang: ';', separator: ';'},
                {lang: tableTools.lang.tabulator, separator: '\t'}
            ];
            this.modal = false;
            this.exporting = false;
            this.config = {
                separator: ',',
                fileName: '',
                columnNames: true
            };
        }

        showExport() {
            const headers = this.tableToolsCtrl.$element[0]
                .querySelectorAll('table > thead > tr:last-child > th');
            this.columns = [];
            for (let h = 0; h < headers.length; h++) {
                if (!angular.element(headers[h]).hasClass('ignore-export')) {
                    this.columns.push({
                        txt: headers[h].innerHTML,
                        idx: h,
                        exp: true
                    });
                }
            }
            this.config.fileName = this.$document[0].title;
            this.modal = true;
        }

        flipSelection() {
            for (let i = 0; i < this.columns.length; i++) {
                this.columns[i].exp = !this.columns[i].exp;
            }
        }

        doExport(type, config) {
            this.exporting = type;
            const indexes = [],
                data = [],
                parseText = function(text) {
                    if (angular.isFunction(config['parseText'])) {
                        text = config['parseText'](text);
                    }
                    return text;
                },
                appendRow = () => {
                    if (row.length) {
                        if (type === 'csv' || type === 'copy') {
                            data.push(row.join(this.config.separator));
                        } else {
                            data.push(row);
                        }
                        row = [];
                    }
                };
            let row = [];
            // get columns to export
            for (let i = 0; i < this.columns.length; i++) {
                if (this.columns[i].exp) {
                    indexes.push(this.columns[i].idx);
                    if (this.config.columnNames) {
                        row.push(parseText(this.columns[i].txt));
                    }
                }
            }
            appendRow();
            // grab data
            const columns = this.tableToolsCtrl.$element[0]
                .querySelectorAll('table > tbody > tr:not(.ignore-export) > td');
            let rowId = -1;
            for (let c = 0; c < columns.length; c++) {
                if (~indexes.indexOf(columns[c].cellIndex)) {
                    if (columns[c].parentNode['rowIndex'] !== rowId) {
                        rowId = columns[c].parentNode['rowIndex'];
                        appendRow();
                    }
                    row.push(parseText(angular.element(columns[c]).text().trim()));
                }
            }
            appendRow();
            // export
            let exportCallback;
            switch (type) {
                case 'copy':
                    exportCallback = (data) => {
                        const copyElement = this._getCopyElement();
                        copyElement.val(data.join('\n'));
                        copyElement[0].focus();
                        copyElement[0].select();
                        this.$document[0].execCommand('copy');
                    };
                    break;
                case 'csv':
                    exportCallback = (data, config) => {
                        const a = this.$document[0].createElement('a'),
                            item = '\ufeff' + data.join('\n'),
                            blob = new Blob([item], {type: 'text/csv', charset: 'utf-8'}),
                            url = URL.createObjectURL(blob);
                        a.setAttribute('style', 'display: none');
                        a.href = url;
                        a.download = config.fileName + '.csv';
                        this.$document[0].body.appendChild(a);
                        a.click();
                        a.remove();
                    };
                    break;
                default:
                    if (angular.isFunction(config['callback'])) {
                        exportCallback = config['callback'];
                    } else {
                        throw new Error('No callback provided for export type: ' + type);
                    }
                    break;
            }
            this.$q.when(exportCallback(data, this.config)).then(() => {
                if (angular.isFunction(this.tableTools['exportNotification'])) {
                    this.tableTools['exportNotification'](type);
                }
                this.exporting = false;
                this.modal = false;
            });
        }

        // /////
        /**
		 * @returns {*}
		 * @private
		 */
        _getCopyElement() {
            if (angular.isUndefined(this._copyElement)) {
                this._copyElement = angular.element(
                    '<textarea style="position:absolute;top:-1000px;left:-1000px"></textarea>'
                );
                angular.element(this.$document[0].body).append(this._copyElement);
            }
            return this._copyElement;
        }
    }
    ttExportController.$inject = ["$document", "$q", "tableTools"];

    /**
	 * @ngdoc component
	 * @name ttExport
	 */
    angular.module('tableTools.export').component('ttExport', {
        controller: ttExportController,
        controllerAs: 'vm',
        require: {
            tableToolsCtrl: '^tableTools'
        },
        templateUrl: 'src/templates/export.html'
    });
}());

/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

angular.module('tableTools.pagination').component('ttPagination', {
    require: {
        tableTools: '^tableTools'
    },
    controllerAs: 'vm',
    transclude: true,
    templateUrl: 'src/templates/pagination.html'
});

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

/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

angular.module('tableTools.pagination').component('ttPerPage', {
    require: {
        tableTools: '^tableTools'
    },
    controllerAs: 'vm',
    template: '<div class="form-group">'
		+ '<label>{{::vm.tableTools.lang.perPage}}&nbsp;</label>'
		+ '<select class="form-control" ng-model="vm.tableTools.perPage" ng-change="vm.tableTools.filterData()"'
		+ ' ng-options="o.number as o.text for o in vm.tableTools.perPageOptions"></select>'
		+ '</div>'
});

/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
!(function() {
    'use strict';

    ttFilterDirectiveController.$inject = ["$attrs"];
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

/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

angular.module('tableTools.search').component('ttSearch', {
    require: {
        tableTools: '^tableTools'
    },
    controllerAs: 'vm',
    template: '<div class="form-group">'
		+ '<input type="text" class="form-control" ng-model="vm.tableTools.ttSearch.search" '
		+ 'ng-change="vm.tableTools.filterData()" placeholder="{{::vm.tableTools.lang.search}}"/>'
		+ '</div>'
});

/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
!(function() {
    'use strict';

    function ttSearchService() {
        const compareWithOperator = function(variable, search, operator) {
                if (angular.isObject(search)) {
                    for (const s in search) {
                        if (search.hasOwnProperty(s) && compareWithOperator(variable, search[s], operator)) {
                            return true;
                        }
                    }
                    return false;
                }
                if (angular.isObject(variable)) {
                    for (const v in variable) {
                        if (
                            variable.hasOwnProperty(v)
                            && v !== '$$hashKey'
                            && compareWithOperator(variable[v], search, operator)
                        ) {
                            return true;
                        }
                    }
                    return false;
                }
                if (angular.isUndefined(operator) || operator === 'like') {
                    return !!~variable.toLowerCase().indexOf(search.toLowerCase())
                } else {
                    switch (operator) {
                        case '>':
                            return variable > search;
                        case '<':
                            return variable < search;
                        case '>=':
                            return variable >= search;
                        case '<=':
                            return variable <= search;
                        case '==':
                            // eslint-disable-next-line eqeqeq
                            return variable == search;
                        default:
                            return true;
                    }
                }
            },
            hasSearchString = function(variable, search) {
                if (angular.isObject(variable)) {
                    for (const v in variable) {
                        if (
                            variable.hasOwnProperty(v)
                            && v !== '$$hashKey'
                            && hasSearchString(variable[v], search)
                        ) {
                            return true;
                        }
                    }
                } else { // noinspection EqualityComparisonWithCoercionJS
                    if (
                        // eslint-disable-next-line eqeqeq
                        (angular.isNumber(variable) && variable == search)
                        || (angular.isString(variable) && !!~variable.toLowerCase().indexOf(search))
                    ) {
                        return true;
                    }
                }
                return false;
            };
        return function() {
            const self = this,
                filters = {};
            /**
             * @type {string}
             */
            self.search = '';
            /**
             * @param field
             * @param controller
             */
            self.registerFilter = function(field, controller) {
                if (!(field in filters)) {
                    filters[field] = [];
                }
                filters[field].push(controller);
            };
            /**
             * @param field
             * @param controller
             */
            self.unregisterFilter = function(field, controller) {
                filters[field].splice(filters[field].indexOf(controller), 1);
                if (!filters[field].length) {
                    delete filters[field];
                }
            };
            /**
             */
            self.getFiltersArray = function() {
                const result = {};
                for (const f in filters) {
                    if (filters.hasOwnProperty(f)) {
                        result[f] = [];
                        for (let i = 0; i < filters[f].length; i++) {
                            const filter = filters[f][i],
                                value = filter.getValue();
                            // noinspection EqualityComparisonWithCoercionJS
                            if (
                                angular.isUndefined(value)
                                // eslint-disable-next-line eqeqeq
                                || value == filter.ttFilterEmpty
                                || (angular.isDefined(filter.length) && !filter.length)
                            ) { // skip empty filters
                                continue;
                            }
                            result[f].push({
                                value: value,
                                operator: filter.ttFilterOperator,
                                isOr: filter.ttFilterOr
                            });
                        }
                    }
                }
                return result;
            };
            /**
             * @param {Array} data
             * @returns {Array}
             */
            self.doSearch = function(data) {
                if (
                    !data.length
                    || (
                        (
                            (!angular.isString(self.search) && !angular.isNumber(self.search))
                            || self.search === ''
                        )
                        && !Object.keys(filters).length
                    )
                ) {
                    return data;
                }
                const results = [],
                    search = angular.isString(self.search)
                        ? self.search.toLowerCase()
                        : (angular.isNumber(self.search) ? self.search : '');
                angular.forEach(data, (row) => {
                    if (search === '' || hasSearchString(row, search)) {
                        for (const f in filters) {
                            if (filters.hasOwnProperty(f) && angular.isDefined(row[f])) {
                                let filterResult = true,
                                    anyPass = false,
                                    orCondition = false;
                                for (let i = 0; i < filters[f].length; i++) {
                                    const filter = filters[f][i],
                                        value = filter.getValue();
                                    // noinspection EqualityComparisonWithCoercionJS
                                    if (
                                        angular.isUndefined(value)
                                        // eslint-disable-next-line eqeqeq
                                        || value == filter.ttFilterEmpty
                                        || (angular.isDefined(filter.length) && !filter.length)
                                    ) { // skip empty filters
                                        continue;
                                    }
                                    if (!compareWithOperator(row[f], value, filter.ttFilterOperator)) {
                                        if (filter.ttFilterOr) {
                                            orCondition = true;
                                        } else {
                                            filterResult = false;
                                            break;
                                        }
                                    } else {
                                        anyPass = true;
                                    }
                                }
                                if (orCondition && !anyPass) { // or filter passes if any other filter has passed
                                    filterResult = false;
                                }
                                if (!filterResult) {
                                    return;
                                }
                            }
                        }
                        results.push(row);
                    }
                });
                return results;
            };
        };
    }

    /**
     * @ngdoc factory
     * @name ttSearch
     */
    angular.module('tableTools.search').factory('ttSearch', ttSearchService);
}());

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

/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
!(function() {
    'use strict';

    function ttSelectDirective() {
        return {
            restrict: 'AE',
            require: '^tableTools',
            template: '<input type="checkbox" ng-model="row.ttSelected" ng-disabled="!row.ttSelectable" '
				+ 'ng-change="tableTools.ttSelect.change()"/>',
            replace: true,
            scope: {
                row: '=ttSelect'
            },
            link(scope, element, attr, tableTools) {
                /**
				 * Reference to tableTools controller.
				 */
                scope.tableTools = tableTools;
                if (angular.isUndefined(scope.row.ttSelectable)) {
                    scope.row['ttSelectable'] = true;
                }
            }
        };
    }

    angular.module('tableTools.select').directive('ttSelect', ttSelectDirective);
}());

/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
!(function() {
    'use strict';

    function ttSelectService() {
        return function(tableTools) {
            const self = this;
            self.selectAll = false;
            self.changeAll = function() {
                for (let d = 0; d < tableTools.data.length; d++) {
                    tableTools.data[d].ttSelected = tableTools.data[d].ttSelectable !== false
                        ? self.selectAll : false;
                }
            };
            self.change = function() {
                for (let d = 0; d < tableTools.data.length; d++) {
                    if (!tableTools.data[d].ttSelected && tableTools.data[d].ttSelectable !== false) {
                        self.selectAll = false;
                        return;
                    }
                }
                self.selectAll = true;
            };
            self.getSelected = function() {
                const selected = [];
                for (let d = 0; d < tableTools.data.length; d++) {
                    if (tableTools.data[d].ttSelected && tableTools.data[d].ttSelectable !== false) {
                        selected.push(tableTools.data[d]);
                    }
                }
                return selected;
            };
            self.hasSelected = function() {
                return self.getSelected().length !== 0;
            };
        };
    }

    /**
	 * @ngdoc factory
	 * @name ttSelect
	 */
    angular.module('tableTools.select').factory('ttSelect', ttSelectService);
}());

/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
!(function() {
    'use strict';

    function ttSelectedClickDirective() {
        return {
            restrict: 'AE',
            require: '^tableTools',
            replace: true,
            scope: {
                ttSelectedClick: '<'
            },
            link(scope, element, attr, tableTools) {
                scope.isDisabled = function() {
                    return !tableTools.ttSelect.hasSelected();
                };
                scope.$watch('isDisabled()', function(nV) {
                    element.attr('disabled', nV);
                });
                element.on('click', function() {
                    const selected = tableTools.ttSelect.getSelected();
                    if (selected.length) {
                        scope.ttSelectedClick(selected);
                        scope.$apply();
                    }
                });
            }
        };
    }

    angular.module('tableTools.select').directive('ttSelectedClick', ttSelectedClickDirective);
}());

/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
!(function() {
    'use strict';

    function ttSortDirective() {
        return {
            restrict: 'A',
            require: ['^tableTools', 'ttSort'],
            controller: ['$element', function($element) {
                /**
				 * Update sorting item class
				 * @param {string} state
				 */
                this.updateState = function(state) {
                    if (this.state !== state) {
                        if (this.state) {
                            $element.removeClass('sorting-' + this.state);
                        }
                        if (state) {
                            $element.addClass('sorting-' + state);
                        }
                        this.state = state;
                    }
                };
            }],
            link(scope, element, attrs, ctrl) {
                const tableTools = ctrl[0],
                    sortCtrl = ctrl[1];
                //
                tableTools.ttSort.register(attrs['ttSort'], sortCtrl);
                scope.$on('$destroy', function() {
                    tableTools.ttSort.unregister(attrs['ttSort'], sortCtrl);
                });
                //
                element.on('click', function(e) {
                    if (!e.shiftKey) { // change sorting direction
                        if (tableTools.order === attrs['ttSort']) {
                            tableTools.order = '-' + attrs['ttSort'];
                        } else {
                            tableTools.order = attrs['ttSort'];
                        }
                    } else { // append to current order array
                        if (angular.isString(tableTools.order)) {
                            tableTools.order = [tableTools.order];
                        } else if (!angular.isArray(tableTools.order)) {
                            tableTools.order = [];
                        }
                        let found = false;
                        for (let i = 0; i < tableTools.order.length; i++) {
                            if (tableTools.order[i] === attrs['ttSort']) {
                                tableTools.order[i] = '-' + attrs['ttSort'];
                                found = true;
                                break;
                            }
                            if (tableTools.order[i] === '-' + attrs['ttSort']) {
                                tableTools.order[i] = attrs['ttSort'];
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
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
}());

/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
!(function() {
    'use strict';

    function ttSortService() {
        const isObject = function(value) {
                return value !== null && angular.isObject(value);
            },
            isNumeric = function(n) {
                return !isNaN(parseFloat(n)) && isFinite(n);
            },
            compare = function(v1, v2) {
                if (v1.type === v2.type) {
                    if (v1.type === 'string') {
                        if (isNumeric(v1.value) && isNumeric(v2.value)) {
                            return parseFloat(v1.value) < parseFloat(v2.value) ? -1 : 1;
                        }
                        // Compare strings case-insensitively
                        v1.value = v1.value.toLowerCase();
                        v2.value = v2.value.toLowerCase();
                    } else if (v1.type === 'object') {
                        // For basic objects, use the position of the object
                        // in the collection instead of the value
                        if (isObject(v1.value)) {
                            v1.value = v1.index;
                        }
                        if (isObject(v2.value)) {
                            v2.value = v2.index;
                        }
                    }
                    if (v1.value !== v2.value) {
                        if (angular.isFunction(v1.value.localeCompare)) {
                            return v1.value.localeCompare(v2.value);
                        } else {
                            return v1.value < v2.value ? -1 : 1;
                        }
                    }
                } else {
                    return v1.type < v2.type ? -1 : 1;
                }
            };
        return function() {
            const self = this,
                sortItems = {},
                parseOrderItem = function(orderItem, parsed) {
                    if (orderItem[0] === '-') {
                        parsed[orderItem.substring(1)] = 'desc';
                    } else {
                        parsed[orderItem] = 'asc';
                    }
                },
                parseOrder = function(orderValue) {
                    const parsed = {};
                    if (angular.isDefined(orderValue)) {
                        if (angular.isString(orderValue)) {
                            parseOrderItem(orderValue, parsed);
                        } else if (angular.isDefined(orderValue.length)) {
                            for (let i = 0; i < orderValue.length; i++) {
                                parseOrderItem(orderValue[i], parsed);
                            }
                        }
                    }
                    return parsed;
                };
            let lastOrder,
                sortItemsId = 0,
                lastSortItems = 0;
            self.compareFn = compare;
            /**
			 * @param field
			 * @param controller
			 */
            self.register = function(field, controller) {
                if (!(field in sortItems)) {
                    sortItems[field] = [];
                }
                sortItems[field].push(controller);
                sortItemsId++;
            };
            /**
			 * @param field
			 * @param controller
			 */
            self.unregister = function(field, controller) {
                sortItems[field].splice(sortItems[field].indexOf(controller), 1);
                if (!sortItems[field].length) {
                    delete sortItems[field];

                }
                sortItemsId++;
            };
            /**
			 * @param orderValue
			 * @returns {Array}
			 */
            self.getOrder = function(orderValue) {
                const order = [],
                    parsed = parseOrder(orderValue);
                for (const p in parsed) {
                    if (parsed.hasOwnProperty(p)) {
                        order.push({
                            col: p,
                            dir: parsed[p]
                        });
                    }
                }
                return order;
            };
            /**
			 * Propagate order change to all child sort directives
			 * @param orderValue
			 */
            self.orderUpdate = function(orderValue) {
                if (!angular.equals(orderValue, lastOrder) || lastSortItems !== sortItemsId) {
                    const parsed = parseOrder(orderValue);
                    //
                    for (const field in sortItems) {
                        if (sortItems.hasOwnProperty(field)) {
                            for (let i = 0; i < sortItems[field].length; i++) {
                                sortItems[field][i].updateState(
                                    parsed[field]
                                );
                            }
                        }
                    }
                    lastOrder = angular.copy(orderValue);
                    lastSortItems = sortItemsId;
                    return true;
                }
                return false;
            };
        };
    }

    /**
	 * @ngdoc factory
	 * @name ttSort
	 */
    angular.module('tableTools.sort').factory('ttSort', ttSortService);
}());

angular.module('tableTools').run(['$templateCache', function($templateCache) {$templateCache.put('src/templates/export.html','<div><button class="btn btn-outline-primary" ng-click="vm.showExport()">{{::vm.tableTools.lang.export}}</button><div class="modal fade" bs-modal="vm.modal"><div class="modal-dialog modal-lg"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">{{::vm.tableTools.lang.export}}</h5><button type="button" class="close" dismiss aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body"><div class="form-group"><label><strong>{{::vm.tableTools.lang.exportChooseColumns}}:</strong> <a href="javascript:" ng-click="vm.flipSelection()" class="badge badge-primary">{{::vm.tableTools.lang.flipSelection}}</a></label><div><div class="form-check form-check-inline" ng-repeat="c in vm.columns"><input class="form-check-input" type="checkbox" id="tt-export-{{::$id}}" ng-model="c.exp"> <label class="form-check-label" for="tt-export-{{::$id}}" title="c.txt">{{::c.txt}}</label></div></div><div><div class="form-check mt-2"><input class="form-check-input" type="checkbox" id="tt-export-columns-{{::$id}}" ng-model="vm.config.columnNames"> <label class="form-check-label" for="tt-export-columns-{{::$id}}">{{::vm.tableTools.lang.exportColumnNames}}</label></div></div></div><div class="form-group"><label><strong>{{::vm.tableTools.lang.exportSeparator}}</strong></label><div><div class="form-check form-check-inline" ng-repeat="s in vm.separators"><input class="form-check-input" type="radio" id="tt-export-separator-{{::$id}}" ng-model="vm.config.separator" ng-value="s.separator" ng-trim="false"> <label class="form-check-label" for="tt-export-separator-{{::$id}}">{{::s.lang}}</label></div></div></div></div><div class="modal-footer"><button type="button" class="btn btn-outline-primary" ng-repeat="(k, e) in vm.exportTypes" ng-click="vm.doExport(k, e)" ng-disabled="vm.exporting">{{::e.lang}} <span ng-if="vm.exporting == k"><i class="fa fa-spinner fa-spin"></i></span></button></div></div></div></div></div>');
$templateCache.put('src/templates/pagination.html','<ul class="pagination"><li ng-class="{\'disabled\': vm.tableTools.pagination.page == 1}" class="page-item"><a href="javascript:" ng-click="vm.tableTools.changePage(1)" title="{{::vm.tableTools.lang.first}}" class="page-link"><i class="fa fa-angle-double-left"></i></a></li><li ng-class="{\'disabled\': vm.tableTools.pagination.page == 1}" class="page-item"><a href="javascript:" ng-click="vm.tableTools.changePage(\'prev\')" title="{{::vm.tableTools.lang.prev}}" class="page-link"><i class="fa fa-angle-left"></i></a></li><li ng-repeat="p in vm.tableTools.pagination.items" ng-class="{\'active\': p == vm.tableTools.pagination.page}" class="page-item"><a href="javascript:" ng-click="vm.tableTools.changePage(p)" class="page-link">{{p}}</a></li><li ng-class="{\'disabled\': vm.tableTools.pagination.page == vm.tableTools.pagination.pages || vm.tableTools.pagination.pages == 0}" class="page-item"><a href="javascript:" ng-click="vm.tableTools.changePage(\'next\')" title="{{::vm.tableTools.lang.next}}" class="page-link"><i class="fa fa-angle-right"></i></a></li><li ng-class="{\'disabled\': vm.tableTools.pagination.page == vm.tableTools.pagination.pages || vm.tableTools.pagination.pages == 0}" class="page-item"><a href="javascript:" ng-click="vm.tableTools.changePage(vm.tableTools.pagination.pages)" title="{{::vm.tableTools.lang.last}}" class="page-link"><i class="fa fa-angle-double-right"></i></a></li></ul>');
$templateCache.put('src/templates/results-count.html','<div>{{::vm.tableTools.lang.results}} <span ng-switch="vm.tableTools.dataLength"><span ng-switch-when="0">0</span> <span ng-switch-default>{{vm.tableTools.pagination.start}} - {{vm.tableTools.pagination.end}} {{::vm.tableTools.lang.from}} {{vm.tableTools.filteredCount}}</span></span> <span ng-show="vm.tableTools.filteredCount !== vm.tableTools.dataLength">({{::vm.tableTools.lang.filteredResults}} {{vm.tableTools.dataLength}})</span></div>');}]);