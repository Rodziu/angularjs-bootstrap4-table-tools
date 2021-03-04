import { IFilterOrderByItem } from 'angular';
import { TtSortDirectiveController } from './tt-sort.directive';
export interface IOrder {
    col: string;
    dir: 'asc' | 'desc';
}
export declare class TtSort {
    private sortItems;
    private sortItemsId;
    private lastSortItems;
    private _lastOrder;
    compareFn(v1: IFilterOrderByItem, v2: IFilterOrderByItem): -1 | 0 | 1;
    register(field: string, controller: TtSortDirectiveController): void;
    unregister(field: string, controller: TtSortDirectiveController): void;
    getOrder(orderValue: string | string[] | undefined): IOrder[];
    private parseOrderItem;
    private parseOrder;
    /**
     * Propagate order change to all child sort directives
     */
    orderUpdate(orderValue: string | string[] | undefined): boolean;
}
export declare function ttSortFactory(): typeof TtSort;
