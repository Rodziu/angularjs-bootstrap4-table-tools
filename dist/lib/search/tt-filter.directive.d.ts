import { IAttributes, IController, IDirective, IOnChangesObject } from 'angular';
import { operator } from './tt-search.factory';
/**
 * @ngInject
 */
export declare class TtFilterController implements IController {
    private readonly $attrs;
    private checkboxValue;
    private ngModel;
    private tableTools;
    ttFilterEmpty: string;
    ttFilterOperator: operator;
    ttFilterOr: boolean;
    ttFilter: string;
    constructor($attrs: IAttributes);
    $onInit(): void;
    $onChanges(changes: IOnChangesObject): void;
    $onDestroy(): void;
    getValue(): unknown;
}
export declare function ttFilterDirective(): IDirective;
