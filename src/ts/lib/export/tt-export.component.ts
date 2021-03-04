/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import {IComponentOptions, IController, IDocumentService, IQService} from 'angular';
import {ITableToolsExportType, TableToolsProvider} from '../table-tools.provider';
import {TableToolsController} from '../table-tools.directive';
import * as angular from 'angular';

/**
 * @ngInject
 */
export class TtExportController implements IController {
    private $document: IDocumentService;
    private $q: IQService;
    private readonly tableTools: TableToolsProvider;
    private exportTypes: { [p: string]: ITableToolsExportType };
    private separators: { lang: string; separator: string }[];
    private modal: boolean;
    private exporting: string | false;
    private config: { fileName: string, columnNames: boolean, separator: string };
    private tableToolsCtrl: TableToolsController;
    private columns: { txt: string, idx: number, exp: boolean }[];
    private _copyElement: JQLite;

    constructor(
        $document: IDocumentService,
        $q: IQService,
        tableTools: TableToolsProvider
    ) {
        this.$document = $document;
        this.$q = $q;
        this.tableTools = tableTools;

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

    showExport(): void {
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

    flipSelection(): void {
        this.columns.forEach((column) => {
            column.exp = !column.exp;
        });
    }

    doExport(type: string, config: ITableToolsExportType): void {
        this.exporting = type;
        const indexes = [],
            data = [],
            parseText = (text: string): string => {
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
            .querySelectorAll<HTMLTableCellElement>('table > tbody > tr:not(.ignore-export) > td');
        let rowId = -1;
        for (let c = 0; c < columns.length; c++) {
            if (indexes.includes(columns[c].cellIndex)) {
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
                    (copyElement[0] as HTMLInputElement).select();
                    this.$document[0].execCommand('copy');
                };
                break;
            case 'csv':
                exportCallback = (data, config) => {
                    const a = this.$document[0].createElement('a'),
                        item = '\ufeff' + data.join('\n'),
                        blob = new Blob([item], {type: 'text/csv;utf-8'}),
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

    private _getCopyElement(): JQLite {
        if (angular.isUndefined(this._copyElement)) {
            this._copyElement = angular.element(
                '<textarea style="position:absolute;top:-1000px;left:-1000px"></textarea>'
            );
            angular.element(this.$document[0].body).append(this._copyElement);
        }
        return this._copyElement;
    }
}

export const ttExportComponent: IComponentOptions = {
    controller: TtExportController,
    controllerAs: 'vm',
    require: {
        tableToolsCtrl: '^tableTools'
    },
    templateUrl: 'src/templates/export.html'
};
