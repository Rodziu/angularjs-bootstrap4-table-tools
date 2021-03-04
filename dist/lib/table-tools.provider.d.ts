import { IPromise, IServiceProvider } from 'angular';
import { IFilterValue } from './search/tt-search.factory';
import { IOrder } from './sort/tt-sort.factory';
export interface ITableToolsExportType {
    lang: string;
    parseText?: (txt: string) => string;
    callback?: (data: unknown[][], config: {
        fileName: string;
        columnNames: boolean;
        separator: string;
    }) => IPromise<void>;
}
export interface ITableToolsLang {
    next: string;
    flipSelection: string;
    last: string;
    prev: string;
    csv: string;
    exportColumnNames: string;
    exportSeparator: string;
    exportChooseColumns: string;
    filteredResults: string;
    search: string;
    perPage: string;
    noResults: string;
    from: string;
    copiedToClipboard: string;
    copy: string;
    results: string;
    export: string;
    first: string;
    tabulator: string;
}
export interface IPerPageOption {
    number: number;
    text: string;
}
export interface ITableToolsResponse {
    data: Record<string, unknown>[];
    count: number;
    countFiltered: number;
}
export declare type TableToolsResolver = (limit: number, offset: number, order: IOrder[], search: string, filters: {
    [field: string]: IFilterValue[];
}, url: string) => IPromise<ITableToolsResponse>;
export declare class TableToolsProvider implements IServiceProvider {
    perPage: number;
    perPageOptions: IPerPageOption[];
    scrollOffset: number;
    lang: ITableToolsLang;
    exportTypes: {
        [name: string]: ITableToolsExportType;
    };
    defaultTableToolsResolver?: TableToolsResolver;
    $get(): this;
    exportNotification(type: string): void;
}
