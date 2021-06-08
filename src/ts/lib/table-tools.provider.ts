/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import {IPromise, IServiceProvider} from 'angular';
import {IFilterValue} from './search/tt-search.factory';
import {IOrder} from './sort/tt-sort.factory';

export interface ITableToolsExportType {
    lang: string,
    parseText?: (txt: string) => string,
    callback?: (data: unknown[][], config: {
        fileName: string,
        columnNames: boolean,
        separator: string
    }) => IPromise<void>
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
    tabulator: string
}

export interface IPerPageOption {
    number: number,
    text: string
}

export interface ITableToolsResponse {
    data: Record<string, unknown>[],
    count: number,
    countFiltered: number
}

export type TableToolsResolver = (
    limit: number,
    offset: number,
    order: IOrder[],
    search: string,
    filters: { [field: string]: IFilterValue[] },
    url: string
) => IPromise<ITableToolsResponse>;

export class TableToolsProvider implements IServiceProvider {
    public perPage = 25;
    public scroll = true;
    public perPageOptions: IPerPageOption[] = [
        {number: 10, text: '10'},
        {number: 25, text: '25'},
        {number: 50, text: '50'},
        {number: 100, text: '100'},
        {number: 200, text: '200'},
        {number: Infinity, text: 'Wszystkie'}
    ];
    public scrollOffset = 0;
    public lang: ITableToolsLang = {
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
    public exportTypes: { [name: string]: ITableToolsExportType } = {
        copy: {
            lang: this.lang.copy
        },
        csv: {
            lang: this.lang.csv,
            parseText(txt: string): string {
                return '"' + txt.replace('"', '""') + '"';
            }
        }
    };

    public defaultTableToolsResolver?: TableToolsResolver;

    $get(): this {
        return this;
    }

    exportNotification(type: string): void {
        if (type === 'copy') {
            // eslint-disable-next-line no-alert
            alert(this.lang.copiedToClipboard);
        }
    }
}
