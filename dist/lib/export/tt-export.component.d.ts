import { IComponentOptions, IController, IDocumentService, IQService } from 'angular';
import { ITableToolsExportType, TableToolsProvider } from '../table-tools.provider';
/**
 * @ngInject
 */
export declare class TtExportController implements IController {
    private $document;
    private $q;
    private readonly tableTools;
    private exportTypes;
    private separators;
    private modal;
    private exporting;
    private config;
    private tableToolsCtrl;
    private columns;
    private _copyElement;
    constructor($document: IDocumentService, $q: IQService, tableTools: TableToolsProvider);
    showExport(): void;
    flipSelection(): void;
    doExport(type: string, config: ITableToolsExportType): void;
    private _getCopyElement;
}
export declare const ttExportComponent: IComponentOptions;
