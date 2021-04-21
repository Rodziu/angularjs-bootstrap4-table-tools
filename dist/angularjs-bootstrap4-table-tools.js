(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("angular"), require("angularjs-bootstrap-4"));
	else if(typeof define === 'function' && define.amd)
		define("angularjs-bootstrap4-table-tools", ["angular", "angularjs-bootstrap-4"], factory);
	else if(typeof exports === 'object')
		exports["angularjs-bootstrap4-table-tools"] = factory(require("angular"), require("angularjs-bootstrap-4"));
	else
		root["angularjs-bootstrap4-table-tools"] = factory(root["angular"], root["angularjs-bootstrap-4"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE_angular__, __WEBPACK_EXTERNAL_MODULE_angularjs_bootstrap_4__) {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./.build/lib/export/export.module.js":
/*!********************************************!*\
  !*** ./.build/lib/export/export.module.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "tableToolsExport": () => (/* binding */ tableToolsExport)
/* harmony export */ });
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! angular */ "angular");
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var angularjs_bootstrap_4__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! angularjs-bootstrap-4 */ "angularjs-bootstrap-4");
/* harmony import */ var angularjs_bootstrap_4__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(angularjs_bootstrap_4__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _tt_export_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tt-export.component */ "./.build/lib/export/tt-export.component.js");
/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */



const exportModule = angular__WEBPACK_IMPORTED_MODULE_0__.module('tableTools.export', [(angularjs_bootstrap_4__WEBPACK_IMPORTED_MODULE_1___default())])
    .component('ttExport', _tt_export_component__WEBPACK_IMPORTED_MODULE_2__.ttExportComponent);
const tableToolsExport = exportModule.name;



/***/ }),

/***/ "./.build/lib/export/tt-export.component.js":
/*!**************************************************!*\
  !*** ./.build/lib/export/tt-export.component.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TtExportController": () => (/* binding */ TtExportController),
/* harmony export */   "ttExportComponent": () => (/* binding */ ttExportComponent)
/* harmony export */ });
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! angular */ "angular");
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__);
/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

/**
 * @ngInject
 */
class TtExportController {
    constructor($document, $q, tableTools) {
        this.$document = $document;
        this.$q = $q;
        this.tableTools = tableTools;
        this.exportTypes = tableTools.exportTypes;
        this.separators = [
            { lang: ',', separator: ',' },
            { lang: ';', separator: ';' },
            { lang: tableTools.lang.tabulator, separator: '\t' }
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
            if (!angular__WEBPACK_IMPORTED_MODULE_0__.element(headers[h]).hasClass('ignore-export')) {
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
        this.columns.forEach((column) => {
            column.exp = !column.exp;
        });
    }
    doExport(type, config) {
        this.exporting = type;
        const indexes = [], data = [], parseText = (text) => {
            if (angular__WEBPACK_IMPORTED_MODULE_0__.isFunction(config['parseText'])) {
                text = config['parseText'](text);
            }
            return text;
        }, appendRow = () => {
            if (row.length) {
                if (type === 'csv' || type === 'copy') {
                    data.push(row.join(this.config.separator));
                }
                else {
                    data.push(row);
                }
                row = [];
            }
        };
        let row = [];
        // get columns to export
        this.columns.forEach((column) => {
            if (column.exp) {
                indexes.push(column.idx);
                if (this.config.columnNames) {
                    row.push(parseText(column.txt));
                }
            }
        });
        appendRow();
        // grab data
        const columns = this.tableToolsCtrl.$element[0]
            .querySelectorAll('table > tbody > tr:not(.ignore-export) > td');
        let rowId = -1;
        for (let c = 0; c < columns.length; c++) {
            if (indexes.includes(columns[c].cellIndex)) {
                if (columns[c].parentNode['rowIndex'] !== rowId) {
                    rowId = columns[c].parentNode['rowIndex'];
                    appendRow();
                }
                row.push(parseText(angular__WEBPACK_IMPORTED_MODULE_0__.element(columns[c]).text().trim()));
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
                    const a = this.$document[0].createElement('a'), item = '\ufeff' + data.join('\n'), blob = new Blob([item], { type: 'text/csv;utf-8' }), url = URL.createObjectURL(blob);
                    a.setAttribute('style', 'display: none');
                    a.href = url;
                    a.download = config.fileName + '.csv';
                    this.$document[0].body.appendChild(a);
                    a.click();
                    a.remove();
                };
                break;
            default:
                if (angular__WEBPACK_IMPORTED_MODULE_0__.isFunction(config['callback'])) {
                    exportCallback = config['callback'];
                }
                else {
                    throw new Error('No callback provided for export type: ' + type);
                }
                break;
        }
        this.$q.when(exportCallback(data, this.config)).then(() => {
            if (angular__WEBPACK_IMPORTED_MODULE_0__.isFunction(this.tableTools['exportNotification'])) {
                this.tableTools['exportNotification'](type);
            }
            this.exporting = false;
            this.modal = false;
        });
    }
    _getCopyElement() {
        if (angular__WEBPACK_IMPORTED_MODULE_0__.isUndefined(this._copyElement)) {
            this._copyElement = angular__WEBPACK_IMPORTED_MODULE_0__.element('<textarea style="position:absolute;top:-1000px;left:-1000px"></textarea>');
            angular__WEBPACK_IMPORTED_MODULE_0__.element(this.$document[0].body).append(this._copyElement);
        }
        return this._copyElement;
    }
}
TtExportController.$inject = ["$document", "$q", "tableTools"];
const ttExportComponent = {
    controller: TtExportController,
    controllerAs: 'vm',
    require: {
        tableToolsCtrl: '^tableTools'
    },
    template:'<div><button class="btn btn-outline-primary" ng-click="vm.showExport()">{{::vm.tableTools.lang.export}}</button><div class="modal fade" bs-modal="vm.modal"><div class="modal-dialog modal-lg"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">{{::vm.tableTools.lang.export}}</h5><button type="button" class="close" dismiss aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body"><div class="form-group"><label><strong>{{::vm.tableTools.lang.exportChooseColumns}}:</strong> <a href="javascript:" ng-click="vm.flipSelection()" class="badge badge-primary">{{::vm.tableTools.lang.flipSelection}}</a></label><div><div class="form-check form-check-inline" ng-repeat="c in vm.columns"><input class="form-check-input" type="checkbox" id="tt-export-{{::$id}}" ng-model="c.exp"> <label class="form-check-label" for="tt-export-{{::$id}}" title="c.txt">{{::c.txt}}</label></div></div><div><div class="form-check mt-2"><input class="form-check-input" type="checkbox" id="tt-export-columns-{{::$id}}" ng-model="vm.config.columnNames"> <label class="form-check-label" for="tt-export-columns-{{::$id}}">{{::vm.tableTools.lang.exportColumnNames}}</label></div></div></div><div class="form-group"><label><strong>{{::vm.tableTools.lang.exportSeparator}}</strong></label><div><div class="form-check form-check-inline" ng-repeat="s in vm.separators"><input class="form-check-input" type="radio" id="tt-export-separator-{{::$id}}" ng-model="vm.config.separator" ng-value="s.separator" ng-trim="false"> <label class="form-check-label" for="tt-export-separator-{{::$id}}">{{::s.lang}}</label></div></div></div></div><div class="modal-footer"><button type="button" class="btn btn-outline-primary" ng-repeat="(k, e) in vm.exportTypes" ng-click="vm.doExport(k, e)" ng-disabled="vm.exporting">{{::e.lang}} <span ng-if="vm.exporting == k"><i class="fa fa-spinner fa-spin"></i></span></button></div></div></div></div></div>'
};



/***/ }),

/***/ "./.build/lib/pagination/pagination.module.js":
/*!****************************************************!*\
  !*** ./.build/lib/pagination/pagination.module.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "tableToolsPagination": () => (/* binding */ tableToolsPagination)
/* harmony export */ });
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! angular */ "angular");
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _tt_pagination_factory__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tt-pagination.factory */ "./.build/lib/pagination/tt-pagination.factory.js");
/* harmony import */ var _tt_per_page_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tt-per-page.component */ "./.build/lib/pagination/tt-per-page.component.js");
/* harmony import */ var _tt_pagination_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./tt-pagination.component */ "./.build/lib/pagination/tt-pagination.component.js");
/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */




const paginationModule = angular__WEBPACK_IMPORTED_MODULE_0__.module('tableTools.pagination', [])
    .factory('ttPagination', _tt_pagination_factory__WEBPACK_IMPORTED_MODULE_1__.ttPaginationFactory)
    .component('ttPerPage', _tt_per_page_component__WEBPACK_IMPORTED_MODULE_2__.ttPerPageComponent)
    .component('ttPagination', _tt_pagination_component__WEBPACK_IMPORTED_MODULE_3__.ttPaginationComponent);
const tableToolsPagination = paginationModule.name;



/***/ }),

/***/ "./.build/lib/pagination/tt-pagination.component.js":
/*!**********************************************************!*\
  !*** ./.build/lib/pagination/tt-pagination.component.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ttPaginationComponent": () => (/* binding */ ttPaginationComponent)
/* harmony export */ });
/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
const ttPaginationComponent = {
    require: {
        tableTools: '^tableTools'
    },
    controllerAs: 'vm',
    transclude: true,
    template:'<ul class="pagination"><li ng-class="{\'disabled\': vm.tableTools.pagination.page == 1}" class="page-item"><a href="javascript:" ng-click="vm.tableTools.changePage(1)" title="{{::vm.tableTools.lang.first}}" class="page-link"><i class="fa fa-angle-double-left"></i></a></li><li ng-class="{\'disabled\': vm.tableTools.pagination.page == 1}" class="page-item"><a href="javascript:" ng-click="vm.tableTools.changePage(\'prev\')" title="{{::vm.tableTools.lang.prev}}" class="page-link"><i class="fa fa-angle-left"></i></a></li><li ng-repeat="p in vm.tableTools.pagination.items" ng-class="{\'active\': p == vm.tableTools.pagination.page}" class="page-item"><a href="javascript:" ng-click="vm.tableTools.changePage(p)" class="page-link">{{p}}</a></li><li ng-class="{\'disabled\': vm.tableTools.pagination.page == vm.tableTools.pagination.pages || vm.tableTools.pagination.pages == 0}" class="page-item"><a href="javascript:" ng-click="vm.tableTools.changePage(\'next\')" title="{{::vm.tableTools.lang.next}}" class="page-link"><i class="fa fa-angle-right"></i></a></li><li ng-class="{\'disabled\': vm.tableTools.pagination.page == vm.tableTools.pagination.pages || vm.tableTools.pagination.pages == 0}" class="page-item"><a href="javascript:" ng-click="vm.tableTools.changePage(vm.tableTools.pagination.pages)" title="{{::vm.tableTools.lang.last}}" class="page-link"><i class="fa fa-angle-double-right"></i></a></li></ul>'
};



/***/ }),

/***/ "./.build/lib/pagination/tt-pagination.factory.js":
/*!********************************************************!*\
  !*** ./.build/lib/pagination/tt-pagination.factory.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TtPagination": () => (/* binding */ TtPagination),
/* harmony export */   "ttPaginationFactory": () => (/* binding */ ttPaginationFactory)
/* harmony export */ });
/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
class TtPagination {
    constructor(visiblePageCount = 5) {
        this.page = 1;
        this.pages = 1;
        this.start = 0;
        this.end = 0;
        this.items = [];
        this.visiblePageCount = visiblePageCount;
        this.pagesAround = Math.floor(visiblePageCount / 2);
    }
    paginate(resultsLength, perPage) {
        this.pages = Math.ceil(resultsLength / perPage);
        if (this.pages === 0) {
            this.pages = 1;
        }
        if (this.page > this.pages) {
            this.page = this.pages;
        }
        this.items = [];
        const pagesAfter = this.pages - this.page; // number of pages after currently selected page
        let i = this.page // we set a starting page in here
            - (pagesAfter < this.pagesAround // we won't be able to display all pages after current page
                ? this.visiblePageCount - 1 - pagesAfter // so we display the difference before current page
                : this.pagesAround);
        if (i < 1) {
            i = 1;
        }
        do {
            this.items.push(i);
            i++;
        } while (this.items.length < this.visiblePageCount && i <= this.pages);
        this.start = perPage === Infinity
            ? 1
            : Math.min(((this.page - 1) * perPage) + 1, resultsLength);
        this.end = Math.min(this.page * perPage, resultsLength);
    }
}
function ttPaginationFactory() {
    return TtPagination;
}



/***/ }),

/***/ "./.build/lib/pagination/tt-per-page.component.js":
/*!********************************************************!*\
  !*** ./.build/lib/pagination/tt-per-page.component.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ttPerPageComponent": () => (/* binding */ ttPerPageComponent)
/* harmony export */ });
/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
const ttPerPageComponent = {
    require: {
        tableTools: '^tableTools'
    },
    controllerAs: 'vm',
    template: '<div class="form-group">'
        + '<label>{{::vm.tableTools.lang.perPage}}&nbsp;</label>'
        + '<select class="form-control" ng-model="vm.tableTools.perPage" ng-change="vm.tableTools.filterData()"'
        + ' ng-options="o.number as o.text for o in vm.tableTools.perPageOptions"></select>'
        + '</div>'
};



/***/ }),

/***/ "./.build/lib/search/search.module.js":
/*!********************************************!*\
  !*** ./.build/lib/search/search.module.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "tableToolsSearch": () => (/* binding */ tableToolsSearch)
/* harmony export */ });
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! angular */ "angular");
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _tt_filter_directive__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tt-filter.directive */ "./.build/lib/search/tt-filter.directive.js");
/* harmony import */ var _tt_search_factory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tt-search.factory */ "./.build/lib/search/tt-search.factory.js");
/* harmony import */ var _tt_search_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./tt-search.component */ "./.build/lib/search/tt-search.component.js");
/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */




const searchModule = angular__WEBPACK_IMPORTED_MODULE_0__.module('tableTools.search', [])
    .directive('ttFilter', _tt_filter_directive__WEBPACK_IMPORTED_MODULE_1__.ttFilterDirective)
    .factory('ttSearch', _tt_search_factory__WEBPACK_IMPORTED_MODULE_2__.ttSearchFactory)
    .component('ttSearch', _tt_search_component__WEBPACK_IMPORTED_MODULE_3__.ttSearchComponent);
const tableToolsSearch = searchModule.name;



/***/ }),

/***/ "./.build/lib/search/tt-filter.directive.js":
/*!**************************************************!*\
  !*** ./.build/lib/search/tt-filter.directive.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TtFilterController": () => (/* binding */ TtFilterController),
/* harmony export */   "ttFilterDirective": () => (/* binding */ ttFilterDirective)
/* harmony export */ });
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! angular */ "angular");
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__);
/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

/**
 * @ngInject
 */
class TtFilterController {
    constructor($attrs) {
        this.$attrs = $attrs;
        if ('type' in $attrs && $attrs['type'] === 'checkbox') {
            $attrs.$observe('value', (value) => {
                this.checkboxValue = value;
            });
        }
    }
    $onInit() {
        if (angular__WEBPACK_IMPORTED_MODULE_0__.isUndefined(this.ttFilterOperator)) {
            this.ttFilterOperator = '==';
        }
        if (angular__WEBPACK_IMPORTED_MODULE_0__.isUndefined(this.ttFilterEmpty)) {
            this.ttFilterEmpty = '';
        }
        this.ttFilterOr = 'ttFilterOr' in this.$attrs || ('type' in this.$attrs && this.$attrs['type'] === 'checkbox');
        this.tableTools.ttSearch.registerFilter(this.ttFilter, this);
        this.tableTools.filterData();
    }
    $onChanges(changes) {
        if ('ngModel' in changes && 'tableTools' in this) {
            this.tableTools.filterData();
        }
    }
    $onDestroy() {
        this.tableTools.ttSearch.unregisterFilter(this.ttFilter, this);
    }
    getValue() {
        if (angular__WEBPACK_IMPORTED_MODULE_0__.isDefined(this.checkboxValue)) {
            return this.ngModel ? this.checkboxValue : this.ttFilterEmpty;
        }
        return this.ngModel;
    }
}
TtFilterController.$inject = ["$attrs"];
function ttFilterDirective() {
    /**
     * @ngdoc directive
     * @param {string} ttFilter
     * @param {string} ttFilterOperator
     * @param {string} ttFilterEmpty
     * @param {string} ttFilterOr
     */
    return {
        restrict: 'A',
        require: {
            tableTools: '^tableTools',
            ngModelCtrl: 'ngModel'
        },
        bindToController: {
            ttFilter: '@',
            ttFilterOperator: '@',
            ttFilterEmpty: '@',
            ngModel: '<'
        },
        controller: TtFilterController
    };
}



/***/ }),

/***/ "./.build/lib/search/tt-search.component.js":
/*!**************************************************!*\
  !*** ./.build/lib/search/tt-search.component.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ttSearchComponent": () => (/* binding */ ttSearchComponent)
/* harmony export */ });
/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
const ttSearchComponent = {
    require: {
        tableTools: '^tableTools'
    },
    controllerAs: 'vm',
    template: '<div class="form-group">'
        + '<input type="text" class="form-control" ng-model="vm.tableTools.ttSearch.search" '
        + 'ng-change="vm.tableTools.filterData()" placeholder="{{::vm.tableTools.lang.search}}"/>'
        + '</div>'
};



/***/ }),

/***/ "./.build/lib/search/tt-search.factory.js":
/*!************************************************!*\
  !*** ./.build/lib/search/tt-search.factory.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TtSearch": () => (/* binding */ TtSearch),
/* harmony export */   "ttSearchFactory": () => (/* binding */ ttSearchFactory)
/* harmony export */ });
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! angular */ "angular");
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__);
/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

class TtSearch {
    constructor() {
        this.filters = {};
        this.search = '';
    }
    registerFilter(field, controller) {
        if (!(field in this.filters)) {
            this.filters[field] = [];
        }
        this.filters[field].push(controller);
    }
    unregisterFilter(field, controller) {
        this.filters[field].splice(this.filters[field].indexOf(controller), 1);
        if (!this.filters[field].length) {
            delete this.filters[field];
        }
    }
    getFilters() {
        const result = {};
        angular__WEBPACK_IMPORTED_MODULE_0__.forEach(this.filters, (controllers, field) => {
            result[field] = [];
            controllers.forEach((filter) => {
                const value = filter.getValue();
                if (angular__WEBPACK_IMPORTED_MODULE_0__.isUndefined(value)
                    // eslint-disable-next-line eqeqeq
                    || value == filter.ttFilterEmpty
                    || (angular__WEBPACK_IMPORTED_MODULE_0__.isArray(value) && !value.length)) { // skip empty filters
                    return;
                }
                result[field].push({
                    value: value,
                    operator: filter.ttFilterOperator,
                    isOr: filter.ttFilterOr
                });
            });
        });
        return result;
    }
    doSearch(data) {
        if (!data.length
            || ((!angular__WEBPACK_IMPORTED_MODULE_0__.isString(this.search) || this.search === '')
                && !Object.keys(this.filters).length)) {
            return data;
        }
        const results = [], search = angular__WEBPACK_IMPORTED_MODULE_0__.isString(this.search)
            ? this.search.toLowerCase()
            : this.search, filters = this.getFilters();
        angular__WEBPACK_IMPORTED_MODULE_0__.forEach(data, (row) => {
            if (search === '' || this.hasSearchString(row, search)) {
                let allPassed = true;
                angular__WEBPACK_IMPORTED_MODULE_0__.forEach(filters, (filterValues, field) => {
                    let isOr = false;
                    const passed = filterValues.filter((filter) => {
                        if (filter.isOr) {
                            isOr = true;
                        }
                        return this.compareWithOperator(row[field], filter.value, filter.operator);
                    });
                    if (passed.length !== filterValues.length
                        && !(isOr && passed.length > 0)) {
                        allPassed = false;
                    }
                });
                if (allPassed) {
                    results.push(row);
                }
            }
        });
        return results;
    }
    hasSearchString(variable, search) {
        if (angular__WEBPACK_IMPORTED_MODULE_0__.isObject(variable)) {
            return !!Object.keys(variable).find((key) => {
                return key !== '$$hashKey' && this.hasSearchString(variable[key], search);
            });
        }
        else if (
        // eslint-disable-next-line eqeqeq
        (angular__WEBPACK_IMPORTED_MODULE_0__.isNumber(variable) && variable == search)
            || (angular__WEBPACK_IMPORTED_MODULE_0__.isString(variable) && variable.toLowerCase().includes(search))) {
            return true;
        }
        return false;
    }
    compareWithOperator(variable, search, operator) {
        if (angular__WEBPACK_IMPORTED_MODULE_0__.isObject(search)) {
            return !!Object.values(search).find((value) => this.compareWithOperator(variable, value, operator));
        }
        if (angular__WEBPACK_IMPORTED_MODULE_0__.isObject(variable)) {
            return !!Object.keys(variable).find((key) => {
                return key !== '$$hashKey' && this.compareWithOperator(variable[key], search, operator);
            });
        }
        if (angular__WEBPACK_IMPORTED_MODULE_0__.isUndefined(operator) || operator === 'like') {
            return !variable.toLowerCase().includes(search.toLowerCase());
        }
        else {
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
    }
}
function ttSearchFactory() {
    return TtSearch;
}



/***/ }),

/***/ "./.build/lib/select/select.module.js":
/*!********************************************!*\
  !*** ./.build/lib/select/select.module.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "tableToolsSelect": () => (/* binding */ tableToolsSelect)
/* harmony export */ });
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! angular */ "angular");
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _tt_select_factory__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tt-select.factory */ "./.build/lib/select/tt-select.factory.js");
/* harmony import */ var _tt_select_directive__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tt-select.directive */ "./.build/lib/select/tt-select.directive.js");
/* harmony import */ var _tt_select_all_directive__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./tt-select-all.directive */ "./.build/lib/select/tt-select-all.directive.js");
/* harmony import */ var _tt_selected_click_directive__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./tt-selected-click.directive */ "./.build/lib/select/tt-selected-click.directive.js");
/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */





const selectModule = angular__WEBPACK_IMPORTED_MODULE_0__.module('tableTools.select', [])
    .factory('ttSelect', _tt_select_factory__WEBPACK_IMPORTED_MODULE_1__.ttSelectFactory)
    .directive('ttSelect', _tt_select_directive__WEBPACK_IMPORTED_MODULE_2__.ttSelectDirective)
    .directive('ttSelectAll', _tt_select_all_directive__WEBPACK_IMPORTED_MODULE_3__.ttSelectAllDirective)
    .directive('ttSelectedClick', _tt_selected_click_directive__WEBPACK_IMPORTED_MODULE_4__.ttSelectedClickDirective);
const tableToolsSelect = selectModule.name;



/***/ }),

/***/ "./.build/lib/select/tt-select-all.directive.js":
/*!******************************************************!*\
  !*** ./.build/lib/select/tt-select-all.directive.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ttSelectAllDirective": () => (/* binding */ ttSelectAllDirective)
/* harmony export */ });
/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
function ttSelectAllDirective() {
    return {
        restrict: 'AE',
        require: '^tableTools',
        template: '<input type="checkbox" class="tt-select-all" ng-model="tableTools.ttSelect.selectAll" '
            + 'ng-change="tableTools.ttSelect.changeAll()"/>',
        replace: true
    };
}



/***/ }),

/***/ "./.build/lib/select/tt-select.directive.js":
/*!**************************************************!*\
  !*** ./.build/lib/select/tt-select.directive.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ttSelectDirective": () => (/* binding */ ttSelectDirective)
/* harmony export */ });
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! angular */ "angular");
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__);
/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

class TtSelectDirectiveController {
    $onInit() {
        if (angular__WEBPACK_IMPORTED_MODULE_0__.isUndefined(this.row.ttSelectable)) {
            this.row['ttSelectable'] = true;
        }
    }
}
function ttSelectDirective() {
    return {
        restrict: 'AE',
        template: '<input type="checkbox" ng-model="vm.row.ttSelected" ng-disabled="!vm.row.ttSelectable" '
            + 'ng-change="vm.tableTools.ttSelect.change()"/>',
        replace: true,
        scope: true,
        require: {
            tableTools: '^tableTools'
        },
        bindToController: {
            row: '=ttSelect'
        },
        controllerAs: 'vm',
        controller: TtSelectDirectiveController
    };
}



/***/ }),

/***/ "./.build/lib/select/tt-select.factory.js":
/*!************************************************!*\
  !*** ./.build/lib/select/tt-select.factory.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TtSelect": () => (/* binding */ TtSelect),
/* harmony export */   "ttSelectFactory": () => (/* binding */ ttSelectFactory)
/* harmony export */ });
/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
class TtSelect {
    constructor(tableTools) {
        this.selectAll = false;
        this.tableTools = tableTools;
    }
    changeAll() {
        this.tableTools.data.forEach((row) => {
            row.ttSelected = row.ttSelectable !== false ? this.selectAll : false;
        });
    }
    change() {
        for (let d = 0; d < this.tableTools.data.length; d++) {
            if (!this.tableTools.data[d].ttSelected && this.tableTools.data[d].ttSelectable !== false) {
                this.selectAll = false;
                return;
            }
        }
        this.selectAll = !this.tableTools.data.some((row) => {
            return !row.ttSelected && row.ttSelectable !== false;
        });
    }
    getSelected() {
        return this.tableTools.data.filter((row) => {
            return row.ttSelected && row.ttSelectable !== false;
        });
    }
    hasSelected() {
        return this.getSelected().length !== 0;
    }
}
function ttSelectFactory() {
    return TtSelect;
}



/***/ }),

/***/ "./.build/lib/select/tt-selected-click.directive.js":
/*!**********************************************************!*\
  !*** ./.build/lib/select/tt-selected-click.directive.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ttSelectedClickDirective": () => (/* binding */ ttSelectedClickDirective)
/* harmony export */ });
/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
/**
 * @ngInject
 */
class TtSelectedClickDirectiveController {
    constructor($element, $scope) {
        this.$element = $element;
        this.$scope = $scope;
        $element.on('click', () => {
            const selected = this.tableTools.ttSelect.getSelected();
            if (selected.length) {
                this.ttSelectedClick({ selected });
                this.$scope.$apply();
            }
        });
    }
    $doCheck() {
        const hasSelected = this.tableTools.ttSelect.hasSelected();
        if (hasSelected !== this._hasSelected) {
            this._hasSelected = hasSelected;
            this.$element.attr('disabled', hasSelected ? 'disabled' : null);
        }
    }
}
TtSelectedClickDirectiveController.$inject = ["$element", "$scope"];
function ttSelectedClickDirective() {
    return {
        restrict: 'AE',
        replace: true,
        scope: true,
        require: {
            tableTools: '^tableTools',
        },
        bindToController: {
            ttSelectedClick: '&'
        },
        controller: TtSelectedClickDirectiveController
    };
}



/***/ }),

/***/ "./.build/lib/sort/sort.module.js":
/*!****************************************!*\
  !*** ./.build/lib/sort/sort.module.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "tableToolsSort": () => (/* binding */ tableToolsSort)
/* harmony export */ });
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! angular */ "angular");
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _tt_sort_factory__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tt-sort.factory */ "./.build/lib/sort/tt-sort.factory.js");
/* harmony import */ var _tt_sort_directive__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tt-sort.directive */ "./.build/lib/sort/tt-sort.directive.js");
/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */



const sortModule = angular__WEBPACK_IMPORTED_MODULE_0__.module('tableTools.sort', [])
    .factory('ttSort', _tt_sort_factory__WEBPACK_IMPORTED_MODULE_1__.ttSortFactory)
    .directive('ttSort', _tt_sort_directive__WEBPACK_IMPORTED_MODULE_2__.ttSortDirective);
const tableToolsSort = sortModule.name;



/***/ }),

/***/ "./.build/lib/sort/tt-sort.directive.js":
/*!**********************************************!*\
  !*** ./.build/lib/sort/tt-sort.directive.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TtSortDirectiveController": () => (/* binding */ TtSortDirectiveController),
/* harmony export */   "ttSortDirective": () => (/* binding */ ttSortDirective)
/* harmony export */ });
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! angular */ "angular");
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__);
/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

/**
 * @ngInject
 */
class TtSortDirectiveController {
    constructor($element, $attrs, $scope) {
        this.$attrs = $attrs;
        this.$element = $element;
        $element.on('click', (e) => {
            if (!e.shiftKey) { // change sorting direction
                if (this.tableTools.order === this.$attrs['ttSort']) {
                    this.tableTools.order = '-' + this.$attrs['ttSort'];
                }
                else {
                    this.tableTools.order = this.$attrs['ttSort'];
                }
            }
            else { // append to current order array
                if (angular__WEBPACK_IMPORTED_MODULE_0__.isString(this.tableTools.order)) {
                    this.tableTools.order = [this.tableTools.order];
                }
                else if (!angular__WEBPACK_IMPORTED_MODULE_0__.isArray(this.tableTools.order)) {
                    this.tableTools.order = [];
                }
                let found = false;
                this.tableTools.order.map((order) => {
                    if (order === this.$attrs['ttSort']) {
                        found = true;
                        return `-${this.$attrs['ttSort']}`;
                    }
                    else if (order === `-${this.$attrs['ttSort']}`) {
                        found = true;
                        return this.$attrs['ttSort'];
                    }
                    return order;
                });
                if (!found) {
                    this.tableTools.order.push(this.$attrs['ttSort']);
                }
            }
            $scope.$apply();
        });
    }
    $onInit() {
        this.tableTools.ttSort.register(this.$attrs['ttSort'], this);
    }
    $onDestroy() {
        this.tableTools.ttSort.unregister(this.$attrs['ttSort'], this);
    }
    /**
     * Update sorting item class
     */
    updateState(state) {
        if (this.state !== state) {
            if (this.state) {
                this.$element.removeClass('sorting-' + this.state);
            }
            if (state) {
                this.$element.addClass('sorting-' + state);
            }
            this.state = state;
        }
    }
}
TtSortDirectiveController.$inject = ["$element", "$attrs", "$scope"];
function ttSortDirective() {
    return {
        restrict: 'A',
        require: {
            tableTools: '^tableTools'
        },
        bindToController: true,
        controller: TtSortDirectiveController
    };
}



/***/ }),

/***/ "./.build/lib/sort/tt-sort.factory.js":
/*!********************************************!*\
  !*** ./.build/lib/sort/tt-sort.factory.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TtSort": () => (/* binding */ TtSort),
/* harmony export */   "ttSortFactory": () => (/* binding */ ttSortFactory)
/* harmony export */ });
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! angular */ "angular");
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__);
/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

class TtSort {
    constructor() {
        this.sortItems = {};
        this.sortItemsId = 0;
        this.lastSortItems = 0;
    }
    compareFn(v1, v2) {
        const isNumeric = (string) => {
            const n = parseFloat(string);
            return !isNaN(n) && isFinite(n);
        };
        if (v1.type === v2.type) {
            if (v1.type === 'string') {
                if (isNumeric(v1.value) && isNumeric(v2.value)) {
                    return parseFloat(v1.value) < parseFloat(v2.value) ? -1 : 1;
                }
                // Compare strings case-insensitively
                v1.value = v1.value.toLowerCase();
                v2.value = v2.value.toLowerCase();
            }
            else if (v1.type === 'object') {
                // For basic objects, use the position of the object
                // in the collection instead of the value
                if (v1.value !== null && angular__WEBPACK_IMPORTED_MODULE_0__.isObject(v1.value)) {
                    v1.value = v1.index;
                }
                if (v2.value !== null && angular__WEBPACK_IMPORTED_MODULE_0__.isObject(v2.value)) {
                    v2.value = v2.index;
                }
            }
            if (v1.value !== v2.value) {
                if (angular__WEBPACK_IMPORTED_MODULE_0__.isFunction(v1.value.localeCompare)) {
                    return v1.value.localeCompare(v2.value);
                }
                else {
                    return v1.value < v2.value ? -1 : 1;
                }
            }
        }
        else {
            return v1.type < v2.type ? -1 : 1;
        }
    }
    register(field, controller) {
        if (!(field in this.sortItems)) {
            this.sortItems[field] = [];
        }
        this.sortItems[field].push(controller);
        this.sortItemsId++;
    }
    unregister(field, controller) {
        this.sortItems[field].splice(this.sortItems[field].indexOf(controller), 1);
        if (!this.sortItems[field].length) {
            delete this.sortItems[field];
        }
        this.sortItemsId++;
    }
    getOrder(orderValue) {
        const order = [], parsed = this.parseOrder(orderValue);
        angular__WEBPACK_IMPORTED_MODULE_0__.forEach(parsed, (dir, col) => {
            order.push({
                col,
                dir
            });
        });
        return order;
    }
    parseOrderItem(orderItem, parsed) {
        if (orderItem[0] === '-') {
            parsed[orderItem.substring(1)] = 'desc';
        }
        else {
            parsed[orderItem] = 'asc';
        }
    }
    parseOrder(orderValue) {
        const parsed = {};
        if (angular__WEBPACK_IMPORTED_MODULE_0__.isDefined(orderValue)) {
            if (angular__WEBPACK_IMPORTED_MODULE_0__.isString(orderValue)) {
                this.parseOrderItem(orderValue, parsed);
            }
            else if (angular__WEBPACK_IMPORTED_MODULE_0__.isArray(orderValue)) {
                orderValue.forEach((item) => {
                    this.parseOrderItem(item, parsed);
                });
            }
        }
        return parsed;
    }
    /**
     * Propagate order change to all child sort directives
     */
    orderUpdate(orderValue) {
        if (!angular__WEBPACK_IMPORTED_MODULE_0__.equals(orderValue, this._lastOrder) || this.lastSortItems !== this.sortItemsId) {
            const parsed = this.parseOrder(orderValue);
            //
            angular__WEBPACK_IMPORTED_MODULE_0__.forEach(this.sortItems, (sortItem, field) => {
                sortItem.forEach((controller) => {
                    controller.updateState(parsed[field]);
                });
            });
            this._lastOrder = angular__WEBPACK_IMPORTED_MODULE_0__.copy(orderValue);
            this.lastSortItems = this.sortItemsId;
            return true;
        }
        return false;
    }
}
function ttSortFactory() {
    return TtSort;
}



/***/ }),

/***/ "./.build/lib/table-tools.directive.js":
/*!*********************************************!*\
  !*** ./.build/lib/table-tools.directive.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TableToolsController": () => (/* binding */ TableToolsController),
/* harmony export */   "tableToolsDirective": () => (/* binding */ tableToolsDirective)
/* harmony export */ });
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! angular */ "angular");
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__);
/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

/**
 * @ngInject
 */
class TableToolsController {
    constructor($element, $document, $window, $filter, $q, $http, $timeout, $log, tableTools, ttPagination, ttSearch, ttSort, ttSelect) {
        this.lastResolve = { id: 0, timeout: null };
        this.data = [];
        this.dataLength = 0;
        this.filteredCount = 0;
        this.$element = $element;
        this.$document = $document;
        this.$window = $window;
        this.$filter = $filter;
        this.$q = $q;
        this.$http = $http;
        this.$timeout = $timeout;
        this.$log = $log;
        this.tableToolsOptions = tableTools;
        this.pagination = new ttPagination();
        this.ttSearch = new ttSearch();
        this.ttSort = new ttSort();
        this.ttSelect = new ttSelect(this);
        this.lang = tableTools.lang;
    }
    $onInit() {
        if (angular__WEBPACK_IMPORTED_MODULE_0__.isUndefined(this.perPage)) {
            this.perPage = this.tableToolsOptions.perPage;
        }
        if (angular__WEBPACK_IMPORTED_MODULE_0__.isUndefined(this.perPageOptions)) {
            this.perPageOptions = this.tableToolsOptions.perPageOptions;
        }
        if (angular__WEBPACK_IMPORTED_MODULE_0__.isDefined(this.ttUrl) && !angular__WEBPACK_IMPORTED_MODULE_0__.isFunction(this.ttResolver)) {
            if (angular__WEBPACK_IMPORTED_MODULE_0__.isFunction(this.tableToolsOptions.defaultTableToolsResolver)) {
                this.ttResolver = this.tableToolsOptions.defaultTableToolsResolver;
            }
            else {
                this.ttResolver = (limit, offset, order, search, filters, url) => {
                    const deferred = this.$q.defer();
                    this.$http.post(url, {
                        getTableToolsData: 1,
                        limit: limit,
                        offset: offset,
                        order: order,
                        search: search,
                        filters: filters
                    }).then((response) => {
                        deferred.resolve(response.data);
                    }).catch(function () {
                        deferred.reject();
                    });
                    return deferred.promise;
                };
            }
        }
        this.filterData();
    }
    $onChanges(changes) {
        if ('tableTools' in changes) {
            this.filterData();
        }
    }
    $doCheck() {
        if (this.ttSort.orderUpdate(this.order)) {
            this.filterData();
        }
    }
    filterData() {
        // if (angular.isUndefined(this.ttSearch)) { // tableTools are not yet fully initialized
        //     return;
        // }
        let timeout;
        this.loading = true;
        if (angular__WEBPACK_IMPORTED_MODULE_0__.isFunction(this.ttResolver)) {
            timeout = 0;
            if (this.lastResolve.timeout !== null) {
                this.$timeout.cancel(this.lastResolve.timeout);
                timeout = 750;
            }
            const id = ++this.lastResolve.id;
            this.lastResolve.timeout = this.$timeout(() => {
                this.ttResolver(this.perPage, (this.pagination.page - 1) * this.perPage, this.ttSort.getOrder(this.order), this.ttSearch.search, this.ttSearch.getFilters(), this.ttUrl).then((result) => {
                    /** @var {{data: Array, count: number, countFiltered: number}} result */
                    if (angular__WEBPACK_IMPORTED_MODULE_0__.isUndefined(result.data)
                        || !angular__WEBPACK_IMPORTED_MODULE_0__.isNumber(result.count)
                        || !angular__WEBPACK_IMPORTED_MODULE_0__.isNumber(result.countFiltered)) {
                        throw new Error('TableTools - wrong result format');
                    }
                    if (this.lastResolve.id === id) {
                        this.data = result.data;
                        this.dataLength = result.count;
                        this.filteredCount = result.countFiltered;
                        if (this.pagination.page > 1 && !this.data.length) {
                            this.changePage(1);
                        }
                    }
                }).catch((e) => {
                    this.$log.error(e);
                    if (this.lastResolve.id === id) {
                        this.data = [];
                        this.dataLength = 0;
                        this.filteredCount = 0;
                    }
                }).finally(() => {
                    if (this.lastResolve.id === id) {
                        this.pagination.paginate(this.filteredCount, this.perPage);
                        this.ttSelect.change();
                        this.loading = false;
                        this.lastResolve.timeout = null;
                    }
                });
            }, timeout);
            return;
        }
        timeout = 0;
        if (this.lastResolve.timeout !== null) {
            this.$timeout.cancel(this.lastResolve.timeout);
            timeout = 50;
        }
        this.lastResolve.timeout = this.$timeout(() => {
            this.data = angular__WEBPACK_IMPORTED_MODULE_0__.copy(this.tableTools);
            this.dataLength = this.data.length;
            this.data = this.ttSearch.doSearch(this.data);
            this.filteredCount = this.data.length;
            this.data = this.$filter('orderBy')(this.data, this.order, false, this.ttSort.compareFn);
            this.pagination.paginate(this.data.length, this.perPage);
            this.data = this.$filter('limitTo')(this.data, this.perPage, this.pagination.start - 1);
            this.ttSelect.change();
            this.lastResolve.timeout = null;
            this.loading = false;
        }, timeout);
    }
    changePage(page) {
        const originalPage = this.pagination.page;
        if (page === 'prev') {
            if (this.pagination.page > 1) {
                this.pagination.page--;
            }
        }
        else if (page === 'next') {
            if (this.pagination.page < this.pagination.pages) {
                this.pagination.page++;
            }
        }
        else if (!isNaN(page)) {
            this.pagination.page = page;
        }
        if (originalPage !== this.pagination.page) {
            this.filterData();
        }
        this.scrollTo(Math.round(this.$element[0].getBoundingClientRect().top
            + (this.$window.pageYOffset || this.$document[0].documentElement.scrollTop)) + this.tableToolsOptions.scrollOffset, 1000);
    }
    scrollTo(target, duration) {
        const cur = this.$window.scrollY, start = performance.now(), step = (ts) => {
            const elapsed = ts - start;
            if (elapsed >= 1000) {
                this.$window.scrollTo(0, target);
                return;
            }
            this.$window.scrollTo(0, cur - Math.sin((Math.PI / 2) / (duration / elapsed)) * (cur - target));
            this.$window.requestAnimationFrame(step);
        };
        this.$window.requestAnimationFrame(step);
    }
}
TableToolsController.$inject = ["$element", "$document", "$window", "$filter", "$q", "$http", "$timeout", "$log", "tableTools", "ttPagination", "ttSearch", "ttSort", "ttSelect"];
function tableToolsDirective() {
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
        controller: TableToolsController
    };
}



/***/ }),

/***/ "./.build/lib/table-tools.module.js":
/*!******************************************!*\
  !*** ./.build/lib/table-tools.module.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "tableTools": () => (/* binding */ tableTools)
/* harmony export */ });
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! angular */ "angular");
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _export_export_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./export/export.module */ "./.build/lib/export/export.module.js");
/* harmony import */ var _table_tools_provider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./table-tools.provider */ "./.build/lib/table-tools.provider.js");
/* harmony import */ var _pagination_pagination_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pagination/pagination.module */ "./.build/lib/pagination/pagination.module.js");
/* harmony import */ var _search_search_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./search/search.module */ "./.build/lib/search/search.module.js");
/* harmony import */ var _select_select_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./select/select.module */ "./.build/lib/select/select.module.js");
/* harmony import */ var _sort_sort_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./sort/sort.module */ "./.build/lib/sort/sort.module.js");
/* harmony import */ var _table_tools_directive__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./table-tools.directive */ "./.build/lib/table-tools.directive.js");
/* harmony import */ var _tt_footer_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./tt-footer.component */ "./.build/lib/tt-footer.component.js");
/* harmony import */ var _tt_header_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./tt-header.component */ "./.build/lib/tt-header.component.js");
/* harmony import */ var _tt_loading_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./tt-loading.component */ "./.build/lib/tt-loading.component.js");
/* harmony import */ var _tt_results_count_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./tt-results-count.component */ "./.build/lib/tt-results-count.component.js");
/* harmony import */ var _tt_row_placeholder_directive__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./tt-row-placeholder.directive */ "./.build/lib/tt-row-placeholder.directive.js");
/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */













const tableToolsModule = angular__WEBPACK_IMPORTED_MODULE_0__.module('tableTools', [
    _search_search_module__WEBPACK_IMPORTED_MODULE_4__.tableToolsSearch, _pagination_pagination_module__WEBPACK_IMPORTED_MODULE_3__.tableToolsPagination, _export_export_module__WEBPACK_IMPORTED_MODULE_1__.tableToolsExport, _select_select_module__WEBPACK_IMPORTED_MODULE_5__.tableToolsSelect, _sort_sort_module__WEBPACK_IMPORTED_MODULE_6__.tableToolsSort
])
    .provider('tableTools', _table_tools_provider__WEBPACK_IMPORTED_MODULE_2__.TableToolsProvider)
    .directive('tableTools', _table_tools_directive__WEBPACK_IMPORTED_MODULE_7__.tableToolsDirective)
    .directive('ttRowPlaceholder', _tt_row_placeholder_directive__WEBPACK_IMPORTED_MODULE_12__.ttRowPlaceholderDirective)
    .component('ttFooter', _tt_footer_component__WEBPACK_IMPORTED_MODULE_8__.ttFooterComponent)
    .component('ttHeader', _tt_header_component__WEBPACK_IMPORTED_MODULE_9__.ttHeaderComponent)
    .component('ttLoading', _tt_loading_component__WEBPACK_IMPORTED_MODULE_10__.ttLoadingComponent)
    .component('ttResultsCount', _tt_results_count_component__WEBPACK_IMPORTED_MODULE_11__.ttResultsCountComponent);
const tableTools = tableToolsModule.name;



/***/ }),

/***/ "./.build/lib/table-tools.provider.js":
/*!********************************************!*\
  !*** ./.build/lib/table-tools.provider.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TableToolsProvider": () => (/* binding */ TableToolsProvider)
/* harmony export */ });
/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
class TableToolsProvider {
    constructor() {
        this.perPage = 25;
        this.perPageOptions = [
            { number: 10, text: '10' },
            { number: 25, text: '25' },
            { number: 50, text: '50' },
            { number: 100, text: '100' },
            { number: 200, text: '200' },
            { number: Infinity, text: 'Wszystkie' }
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
                parseText(txt) {
                    return '"' + txt.replace('"', '""') + '"';
                }
            }
        };
    }
    $get() {
        return this;
    }
    exportNotification(type) {
        if (type === 'copy') {
            // eslint-disable-next-line no-alert
            alert(this.lang.copiedToClipboard);
        }
    }
}



/***/ }),

/***/ "./.build/lib/tt-footer.component.js":
/*!*******************************************!*\
  !*** ./.build/lib/tt-footer.component.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ttFooterComponent": () => (/* binding */ ttFooterComponent)
/* harmony export */ });
/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
const ttFooterComponent = {
    require: {
        tableTools: '^tableTools'
    },
    template: '<div class="row">'
        + '<tt-results-count class="col align-self-center"></tt-results-count>'
        + '<tt-pagination class="col col-auto"></tt-pagination>'
        + '</div>'
};



/***/ }),

/***/ "./.build/lib/tt-header.component.js":
/*!*******************************************!*\
  !*** ./.build/lib/tt-header.component.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ttHeaderComponent": () => (/* binding */ ttHeaderComponent)
/* harmony export */ });
const ttHeaderComponent = {
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
};



/***/ }),

/***/ "./.build/lib/tt-loading.component.js":
/*!********************************************!*\
  !*** ./.build/lib/tt-loading.component.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ttLoadingComponent": () => (/* binding */ ttLoadingComponent)
/* harmony export */ });
/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
const ttLoadingComponent = {
    require: {
        tableTools: '^tableTools'
    },
    bindings: {
        extraCondition: '<?'
    },
    controllerAs: 'vm',
    template: '<span ng-show="vm.tableTools.loading || vm.extraCondition">'
        + '&nbsp;<i class="fa fa-spinner fa-spin fa-lg"></i></span>',
};



/***/ }),

/***/ "./.build/lib/tt-results-count.component.js":
/*!**************************************************!*\
  !*** ./.build/lib/tt-results-count.component.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ttResultsCountComponent": () => (/* binding */ ttResultsCountComponent)
/* harmony export */ });
/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
const ttResultsCountComponent = {
    require: {
        tableTools: '^tableTools'
    },
    controllerAs: 'vm',
    transclude: true,
    template:'<div>{{::vm.tableTools.lang.results}} <span ng-switch="vm.tableTools.dataLength"><span ng-switch-when="0">0</span> <span ng-switch-default>{{vm.tableTools.pagination.start}} - {{vm.tableTools.pagination.end}} {{::vm.tableTools.lang.from}} {{vm.tableTools.filteredCount}}</span></span> <span ng-show="vm.tableTools.filteredCount !== vm.tableTools.dataLength">({{::vm.tableTools.lang.filteredResults}} {{vm.tableTools.dataLength}})</span></div>'
};



/***/ }),

/***/ "./.build/lib/tt-row-placeholder.directive.js":
/*!****************************************************!*\
  !*** ./.build/lib/tt-row-placeholder.directive.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ttRowPlaceholderDirective": () => (/* binding */ ttRowPlaceholderDirective)
/* harmony export */ });
/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
class TtRowPlaceholderDirectiveController {
}
function ttRowPlaceholderDirective() {
    return {
        restrict: 'A',
        require: {
            tableTools: '^tableTools'
        },
        controllerAs: 'vm',
        bindToController: true,
        controller: TtRowPlaceholderDirectiveController,
        scope: true,
        template: '<td colspan="100%" ng-if="!vm.tableTools.data.length">'
            + '<tt-loading></tt-loading>'
            + '<span ng-if="!vm.tableTools.loading">{{::vm.tableTools.lang.noResults}}</span>'
            + '</td>'
    };
}



/***/ }),

/***/ "angular":
/*!**************************!*\
  !*** external "angular" ***!
  \**************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_angular__;

/***/ }),

/***/ "angularjs-bootstrap-4":
/*!****************************************!*\
  !*** external "angularjs-bootstrap-4" ***!
  \****************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_angularjs_bootstrap_4__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!****************************************************!*\
  !*** ./.build/angularjs-bootstrap4-table-tools.js ***!
  \****************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TableToolsProvider": () => (/* reexport safe */ _lib_table_tools_provider__WEBPACK_IMPORTED_MODULE_1__.TableToolsProvider),
/* harmony export */   "TtPagination": () => (/* reexport safe */ _lib_pagination_tt_pagination_factory__WEBPACK_IMPORTED_MODULE_2__.TtPagination),
/* harmony export */   "TtSearch": () => (/* reexport safe */ _lib_search_tt_search_factory__WEBPACK_IMPORTED_MODULE_3__.TtSearch),
/* harmony export */   "TtSelect": () => (/* reexport safe */ _lib_select_tt_select_factory__WEBPACK_IMPORTED_MODULE_4__.TtSelect),
/* harmony export */   "TtSort": () => (/* reexport safe */ _lib_sort_tt_sort_factory__WEBPACK_IMPORTED_MODULE_5__.TtSort),
/* harmony export */   "TableToolsController": () => (/* reexport safe */ _lib_table_tools_directive__WEBPACK_IMPORTED_MODULE_6__.TableToolsController),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_table_tools_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/table-tools.module */ "./.build/lib/table-tools.module.js");
/* harmony import */ var _lib_table_tools_provider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/table-tools.provider */ "./.build/lib/table-tools.provider.js");
/* harmony import */ var _lib_pagination_tt_pagination_factory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/pagination/tt-pagination.factory */ "./.build/lib/pagination/tt-pagination.factory.js");
/* harmony import */ var _lib_search_tt_search_factory__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lib/search/tt-search.factory */ "./.build/lib/search/tt-search.factory.js");
/* harmony import */ var _lib_select_tt_select_factory__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./lib/select/tt-select.factory */ "./.build/lib/select/tt-select.factory.js");
/* harmony import */ var _lib_sort_tt_sort_factory__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./lib/sort/tt-sort.factory */ "./.build/lib/sort/tt-sort.factory.js");
/* harmony import */ var _lib_table_tools_directive__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./lib/table-tools.directive */ "./.build/lib/table-tools.directive.js");
/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */







/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_lib_table_tools_module__WEBPACK_IMPORTED_MODULE_0__.tableTools);


})();

__webpack_exports__ = __webpack_exports__.default;
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=angularjs-bootstrap4-table-tools.js.map