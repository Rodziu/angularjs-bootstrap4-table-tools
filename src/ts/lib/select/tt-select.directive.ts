/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import {IDirective} from 'angular';
import * as angular from 'angular';

class TtSelectDirectiveController {
    private row: Record<string, unknown>;

    $onInit() {
        if (angular.isUndefined(this.row.ttSelectable)) {
            this.row['ttSelectable'] = true;
        }
    }
}

export function ttSelectDirective(): IDirective {
    return {
        restrict: 'AE',
        template: '<input type="checkbox" ng-model="vm.row.ttSelected" ng-disabled="!vm.row.ttSelectable" '
            + 'ng-change="vm.tableTools.ttSelect.change()"/>',
        replace: true,
        scope: true,
        require: {
            tableTools: '^tableTools'
        },
        bindToController: {
            row: '=ttSelect'
        },
        controllerAs: 'vm',
        controller: TtSelectDirectiveController
    };
}
