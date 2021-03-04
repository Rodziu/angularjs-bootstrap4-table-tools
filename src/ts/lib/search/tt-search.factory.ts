/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
import * as angular from 'angular';
import {TtFilterController} from './tt-filter.directive';

export type operator = '>' | '<' | '>=' | '<=' | '==' | 'like';

export interface IFilterValue {
    value: unknown,
    operator: operator,
    isOr: boolean
}

export class TtSearch {
    private filters: { [filter: string]: TtFilterController[] } = {};
    public search = '';

    registerFilter(field: string, controller: TtFilterController): void {
        if (!(field in this.filters)) {
            this.filters[field] = [];
        }
        this.filters[field].push(controller);
    }

    unregisterFilter(field: string, controller: TtFilterController): void {
        this.filters[field].splice(this.filters[field].indexOf(controller), 1);
        if (!this.filters[field].length) {
            delete this.filters[field];
        }
    }

    getFilters(): { [field: string]: IFilterValue[] } {
        const result = {};
        angular.forEach(this.filters, (controllers, field) => {
            result[field] = [];
            controllers.forEach((filter) => {
                const value = filter.getValue();
                if (
                    angular.isUndefined(value)
                    // eslint-disable-next-line eqeqeq
                    || value == filter.ttFilterEmpty
                    || (angular.isArray(value) && !value.length)
                ) { // skip empty filters
                    return;
                }
                result[field].push({
                    value: value,
                    operator: filter.ttFilterOperator,
                    isOr: filter.ttFilterOr
                });
            })
        });
        return result;
    }

    doSearch(data: Record<string, unknown>[]): Record<string, unknown>[] {
        if (
            !data.length
            || (
                (!angular.isString(this.search) || this.search === '')
                && !Object.keys(this.filters).length
            )
        ) {
            return data;
        }
        const results = [],
            search = angular.isString(this.search)
                ? this.search.toLowerCase()
                : this.search,
            filters = this.getFilters();
        angular.forEach(data, (row) => {
            if (search === '' || this.hasSearchString(row, search)) {
                let allPassed = true;
                angular.forEach(filters, (filterValues, field) => {
                    let isOr = false;
                    const passed = filterValues.filter((filter) => {
                        if (filter.isOr) {
                            isOr = true;
                        }
                        return this.compareWithOperator(row[field], filter.value, filter.operator);
                    });
                    if (
                        passed.length !== filterValues.length
                        && !(isOr && passed.length > 0)
                    ) {
                        allPassed = false;
                    }
                });
                if (allPassed) {
                    results.push(row);
                }
            }
        });
        return results;
    }

    private hasSearchString(variable: unknown, search: string): boolean {
        if (angular.isObject(variable)) {
            return !!Object.keys(variable).find((key) => {
                return key !== '$$hashKey' && this.hasSearchString(variable[key], search);
            });
        } else if (
            // eslint-disable-next-line eqeqeq
            (angular.isNumber(variable) && variable == search)
            || (angular.isString(variable) && (variable as string).toLowerCase().includes(search))
        ) {
            return true;
        }
        return false;
    }

    private compareWithOperator(
        variable: unknown | { [key: string]: unknown },
        search: unknown | { [key: string]: unknown },
        operator: operator
    ): boolean {
        if (angular.isObject(search)) {
            return !!Object.values(search).find((value) => this.compareWithOperator(variable, value, operator));
        }
        if (angular.isObject(variable)) {
            return !!Object.keys(variable).find((key) => {
                return key !== '$$hashKey' && this.compareWithOperator(variable[key], search, operator);
            });
        }
        if (angular.isUndefined(operator) || operator === 'like') {
            return !(variable as string).toLowerCase().includes((search as string).toLowerCase());
        } else {
            switch (operator) {
                case '>':
                    return variable > search;
                case '<':
                    return variable < search;
                case '>=':
                    return variable >= search;
                case '<=':
                    return variable <= search;
                case '==':
                    // eslint-disable-next-line eqeqeq
                    return variable == search;
                default:
                    return true;
            }
        }
    }
}

export function ttSearchFactory(): typeof TtSearch {
    return TtSearch;
}
