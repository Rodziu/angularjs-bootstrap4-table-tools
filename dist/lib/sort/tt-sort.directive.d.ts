import { IAttributes, IDirective, IScope } from 'angular';
/**
 * @ngInject
 */
export declare class TtSortDirectiveController {
    private $element;
    private state;
    private tableTools;
    private readonly $attrs;
    constructor($element: JQLite, $attrs: IAttributes, $scope: IScope);
    $onInit(): void;
    $onDestroy(): void;
    /**
     * Update sorting item class
     */
    updateState(state: string): void;
}
export declare function ttSortDirective(): IDirective;
