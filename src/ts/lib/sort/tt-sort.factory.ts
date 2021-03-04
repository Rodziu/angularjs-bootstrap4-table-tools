/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import * as angular from 'angular';
import {IFilterOrderByItem} from 'angular';
import {TtSortDirectiveController} from './tt-sort.directive';

export interface IOrder {
    col: string,
    dir: 'asc' | 'desc'
}

export class TtSort {
    private sortItems: { [field: string]: TtSortDirectiveController[] } = {};
    private sortItemsId = 0;
    private lastSortItems = 0
    private _lastOrder;

    compareFn(v1: IFilterOrderByItem, v2: IFilterOrderByItem): -1 | 0 | 1 {
        const isNumeric = (string: string) => {
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
            } else if (v1.type === 'object') {
                // For basic objects, use the position of the object
                // in the collection instead of the value
                if (v1.value !== null && angular.isObject(v1.value)) {
                    v1.value = v1.index;
                }
                if (v2.value !== null && angular.isObject(v2.value)) {
                    v2.value = v2.index;
                }
            }
            if (v1.value !== v2.value) {
                if (angular.isFunction(v1.value.localeCompare)) {
                    return v1.value.localeCompare(v2.value);
                } else {
                    return v1.value < v2.value ? -1 : 1;
                }
            }
        } else {
            return v1.type < v2.type ? -1 : 1;
        }
    }

    register(field: string, controller: TtSortDirectiveController): void {
        if (!(field in this.sortItems)) {
            this.sortItems[field] = [];
        }
        this.sortItems[field].push(controller);
        this.sortItemsId++;
    }

    unregister(field: string, controller: TtSortDirectiveController): void {
        this.sortItems[field].splice(this.sortItems[field].indexOf(controller), 1);
        if (!this.sortItems[field].length) {
            delete this.sortItems[field];

        }
        this.sortItemsId++;
    }

    getOrder(orderValue: string | string[] | undefined): IOrder[] {
        const order = [],
            parsed = this.parseOrder(orderValue);
        angular.forEach(parsed, (dir, col) => {
            order.push({
                col,
                dir
            });
        });
        return order;
    }

    private parseOrderItem(orderItem: string, parsed: Record<string, 'asc' | 'desc'>): void {
        if (orderItem[0] === '-') {
            parsed[orderItem.substring(1)] = 'desc';
        } else {
            parsed[orderItem] = 'asc';
        }
    }

    private parseOrder(orderValue: string | string[] | undefined): Record<string, 'asc' | 'desc'> {
        const parsed = {};
        if (angular.isDefined(orderValue)) {
            if (angular.isString(orderValue)) {
                this.parseOrderItem(orderValue, parsed);
            } else if (angular.isArray(orderValue)) {
                orderValue.forEach((item) => {
                    this.parseOrderItem(item, parsed);
                })
            }
        }
        return parsed;
    }

    /**
     * Propagate order change to all child sort directives
     */
    orderUpdate(orderValue: string | string[] | undefined): boolean {
        if (!angular.equals(orderValue, this._lastOrder) || this.lastSortItems !== this.sortItemsId) {
            const parsed = this.parseOrder(orderValue);
            //
            angular.forEach(this.sortItems, (sortItem, field) => {
                sortItem.forEach((controller) => {
                    controller.updateState(parsed[field]);
                });
            });
            this._lastOrder = angular.copy(orderValue);
            this.lastSortItems = this.sortItemsId;
            return true;
        }
        return false;
    }
}

export function ttSortFactory(): typeof TtSort {
    return TtSort;
}
