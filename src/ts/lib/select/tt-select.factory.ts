/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import {TableToolsController} from '../table-tools.directive';

export class TtSelect {
    private tableTools: TableToolsController;
    public selectAll = false;

    constructor(tableTools: TableToolsController) {
        this.tableTools = tableTools;
    }

    changeAll(): void {
        this.tableTools.data.forEach((row) => {
            row.ttSelected = row.ttSelectable !== false ? this.selectAll : false;
        });
    }

    change(): void {
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

    getSelected(): Record<string, unknown>[] {
        return this.tableTools.data.filter((row) => {
            return row.ttSelected && row.ttSelectable !== false;
        })
    }

    hasSelected(): boolean {
        return this.getSelected().length !== 0;
    }
}

export function ttSelectFactory(): typeof TtSelect {
    return TtSelect;
}
