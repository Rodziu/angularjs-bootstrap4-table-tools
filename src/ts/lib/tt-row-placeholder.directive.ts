/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import {IDirective} from 'angular';
import {TableToolsController} from 'ts/lib/table-tools.directive';

class TtRowPlaceholderDirectiveController {
    tableTools: TableToolsController;
}

export function ttRowPlaceholderDirective(): IDirective {
    return {
        restrict: 'A',
        require: {
            tableTools: '^tableTools'
        },
        controllerAs: 'vm',
        bindToController: true,
        controller: TtRowPlaceholderDirectiveController,
        scope: true,
        template: '<td colspan="100%" ng-if="!vm.tableTools.data.length">'
            + '<tt-loading></tt-loading>'
            + '<span ng-if="!vm.tableTools.loading">{{::vm.tableTools.lang.noResults}}</span>'
            + '</td>'
    }
}
