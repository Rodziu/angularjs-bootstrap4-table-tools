/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import {
    IController, IDirective,
    IDocumentService,
    IFilterService,
    IHttpService, ILogService, IOnChangesObject,
    IQService,
    ITimeoutService,
    IWindowService
} from 'angular';
import {
    IPerPageOption,
    ITableToolsLang,
    ITableToolsResponse,
    TableToolsProvider,
    TableToolsResolver
} from './table-tools.provider';
import {TtPagination} from './pagination/tt-pagination.factory';
import {TtSearch} from './search/tt-search.factory';
import {TtSelect} from './select/tt-select.factory';
import {TtSort} from './sort/tt-sort.factory';
import * as angular from 'angular';

/**
 * @ngInject
 */
export class TableToolsController implements IController {
    private $document: IDocumentService;
    private $window: IWindowService;
    private readonly $filter: IFilterService;
    private $q: IQService;
    private $http: IHttpService;
    private readonly $timeout: ITimeoutService;
    private $log: ILogService;
    private tableToolsOptions: TableToolsProvider;
    private lang: ITableToolsLang;
    private lastResolve = {id: 0, timeout: null};
    public $element: JQLite;
    public pagination: TtPagination;
    public ttSearch: TtSearch;
    public ttSort: TtSort;
    public ttSelect: TtSelect;
    public data: Record<string, unknown>[] = [];
    public dataLength = 0;
    public filteredCount = 0;
    public order?: string | string[];
    public perPage: number;
    public perPageOptions: IPerPageOption[];
    public ttUrl?: string;
    public ttResolver: TableToolsResolver;
    public loading: boolean;
    public tableTools: Record<string, unknown>[];

    constructor(
        $element: JQLite,
        $document: IDocumentService,
        $window: IWindowService,
        $filter: IFilterService,
        $q: IQService,
        $http: IHttpService,
        $timeout: ITimeoutService,
        $log: ILogService,
        tableTools: TableToolsProvider,
        ttPagination: typeof TtPagination,
        ttSearch: typeof TtSearch,
        ttSort: typeof TtSort,
        ttSelect: typeof TtSelect
    ) {
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

    $onInit(): void {
        if (angular.isUndefined(this.perPage)) {
            this.perPage = this.tableToolsOptions.perPage;
        }
        if (angular.isUndefined(this.perPageOptions)) {
            this.perPageOptions = this.tableToolsOptions.perPageOptions;
        }
        if (angular.isDefined(this.ttUrl) && !angular.isFunction(this.ttResolver)) {
            if (angular.isFunction(this.tableToolsOptions.defaultTableToolsResolver)) {
                this.ttResolver = this.tableToolsOptions.defaultTableToolsResolver;
            } else {
                this.ttResolver = (limit, offset, order, search, filters, url) => {
                    const deferred = this.$q.defer<ITableToolsResponse>();
                    this.$http.post<ITableToolsResponse>(url, {
                        getTableToolsData: 1,
                        limit: limit,
                        offset: offset,
                        order: order,
                        search: search,
                        filters: filters
                    }).then((response) => {
                        deferred.resolve(response.data);
                    }).catch(function() {
                        deferred.reject();
                    });
                    return deferred.promise;
                };
            }
        }
        this.filterData();
    }

    $onChanges(changes: IOnChangesObject): void {
        if ('tableTools' in changes) {
            this.filterData();
        }
    }

    $doCheck(): void {
        if (this.ttSort.orderUpdate(this.order)) {
            this.filterData();
        }
    }

    filterData(): void {
        // if (angular.isUndefined(this.ttSearch)) { // tableTools are not yet fully initialized
        //     return;
        // }
        let timeout;
        this.loading = true;
        if (angular.isFunction(this.ttResolver)) {
            timeout = 0;
            if (this.lastResolve.timeout !== null) {
                this.$timeout.cancel(this.lastResolve.timeout);
                timeout = 750;
            }
            const id = ++this.lastResolve.id;
            this.lastResolve.timeout = this.$timeout(() => {
                this.ttResolver(
                    this.perPage, (this.pagination.page - 1) * this.perPage,
                    this.ttSort.getOrder(this.order),
                    this.ttSearch.search, this.ttSearch.getFilters(), this.ttUrl
                ).then((result) => {
                    /** @var {{data: Array, count: number, countFiltered: number}} result */
                    if (
                        angular.isUndefined(result.data)
                        || !angular.isNumber(result.count)
                        || !angular.isNumber(result.countFiltered)
                    ) {
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
            this.data = angular.copy(this.tableTools);
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

    changePage(page: number | 'prev' | 'next'): void {
        const originalPage = this.pagination.page;
        if (page === 'prev') {
            if (this.pagination.page > 1) {
                this.pagination.page--;
            }
        } else if (page === 'next') {
            if (this.pagination.page < this.pagination.pages) {
                this.pagination.page++;
            }
        } else if (!isNaN(page)) {
            this.pagination.page = page;
        }
        if (originalPage !== this.pagination.page) {
            this.filterData();
        }
        this.scrollTo(
            Math.round(
                this.$element[0].getBoundingClientRect().top
                + (this.$window.pageYOffset || this.$document[0].documentElement.scrollTop)
            ) + this.tableToolsOptions.scrollOffset,
            1000
        );
    }

    private scrollTo(target: number, duration: number): void {
        const cur = this.$window.scrollY,
            start = performance.now(),
            step = (ts) => {
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

export function tableToolsDirective(): IDirective {
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

