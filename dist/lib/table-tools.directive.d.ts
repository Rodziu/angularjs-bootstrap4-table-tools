/// <reference types="angular-mocks" />
import { IController, IDirective, IDocumentService, IFilterService, IHttpService, ILogService, IOnChangesObject, IQService, ITimeoutService, IWindowService } from 'angular';
import { IPerPageOption, TableToolsProvider, TableToolsResolver } from './table-tools.provider';
import { TtPagination } from './pagination/tt-pagination.factory';
import { TtSearch } from './search/tt-search.factory';
import { TtSelect } from './select/tt-select.factory';
import { TtSort } from './sort/tt-sort.factory';
/**
 * @ngInject
 */
export declare class TableToolsController implements IController {
    private $document;
    private $window;
    private readonly $filter;
    private $q;
    private $http;
    private readonly $timeout;
    private $log;
    private tableToolsOptions;
    private lang;
    private lastResolve;
    $element: JQLite;
    pagination: TtPagination;
    ttSearch: TtSearch;
    ttSort: TtSort;
    ttSelect: TtSelect;
    data: Record<string, unknown>[];
    dataLength: number;
    filteredCount: number;
    order?: string | string[];
    perPage: number;
    scroll: boolean;
    perPageOptions: IPerPageOption[];
    ttUrl?: string;
    ttResolver: TableToolsResolver;
    loading: boolean;
    tableTools: Record<string, unknown>[];
    constructor($element: JQLite, $document: IDocumentService, $window: IWindowService, $filter: IFilterService, $q: IQService, $http: IHttpService, $timeout: ITimeoutService, $log: ILogService, tableTools: TableToolsProvider, ttPagination: typeof TtPagination, ttSearch: typeof TtSearch, ttSort: typeof TtSort, ttSelect: typeof TtSelect);
    $onInit(): void;
    $onChanges(changes: IOnChangesObject): void;
    $doCheck(): void;
    filterData(): void;
    changePage(page: number | 'prev' | 'next'): void;
    private scrollTo;
}
export declare function tableToolsDirective(): IDirective;
