import { TableToolsController } from '../table-tools.directive';
export declare class TtSelect {
    private tableTools;
    selectAll: boolean;
    constructor(tableTools: TableToolsController);
    changeAll(): void;
    change(): void;
    getSelected(): Record<string, unknown>[];
    hasSelected(): boolean;
}
export declare function ttSelectFactory(): typeof TtSelect;
