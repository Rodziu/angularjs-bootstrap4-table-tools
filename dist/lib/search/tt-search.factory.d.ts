import { TtFilterController } from './tt-filter.directive';
export declare type operator = '>' | '<' | '>=' | '<=' | '==' | 'like';
export interface IFilterValue {
    value: unknown;
    operator: operator;
    isOr: boolean;
}
export declare class TtSearch {
    private filters;
    search: string;
    registerFilter(field: string, controller: TtFilterController): void;
    unregisterFilter(field: string, controller: TtFilterController): void;
    getFilters(): {
        [field: string]: IFilterValue[];
    };
    doSearch(data: Record<string, unknown>[]): Record<string, unknown>[];
    private hasSearchString;
    private compareWithOperator;
}
export declare function ttSearchFactory(): typeof TtSearch;
