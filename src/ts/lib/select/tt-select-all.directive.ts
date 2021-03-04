/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import {IDirective} from 'angular';

export function ttSelectAllDirective(): IDirective {
    return {
        restrict: 'AE',
        require: '^tableTools',
        template: '<input type="checkbox" class="tt-select-all" ng-model="tableTools.ttSelect.selectAll" '
            + 'ng-change="tableTools.ttSelect.changeAll()"/>',
        replace: true
    };
}
