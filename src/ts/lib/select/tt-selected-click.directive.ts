/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import {IDirective, IScope} from 'angular';
import {TableToolsController} from '../table-tools.directive';

/**
 * @ngInject
 */
class TtSelectedClickDirectiveController {
    private $element: JQLite;
    private tableTools: TableToolsController;
    private _hasSelected;
    private ttSelectedClick: (locals: {selected: Record<string, unknown>[]}) => void;
    private $scope: IScope;

    constructor($element: JQLite, $scope: IScope) {
        this.$element = $element;
        this.$scope = $scope;

        $element.on('click', () => {
            const selected = this.tableTools.ttSelect.getSelected();
            if (selected.length) {
                this.ttSelectedClick({selected});
                this.$scope.$apply();
            }
        })
    }

    $doCheck() {
        const hasSelected = this.tableTools.ttSelect.hasSelected();
        if (hasSelected !== this._hasSelected) {
            this._hasSelected = hasSelected;
            this.$element.attr('disabled', hasSelected ? 'disabled' : null);
        }
    }
}

export function ttSelectedClickDirective(): IDirective {
    return {
        restrict: 'AE',
        replace: true,
        scope: true,
        require: {
            tableTools: '^tableTools',
        },
        bindToController: {
            ttSelectedClick: '&'
        },
        controller: TtSelectedClickDirectiveController
    };
}
