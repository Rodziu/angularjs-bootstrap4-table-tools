/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import {IComponentOptions} from 'angular';

export const ttLoadingComponent: IComponentOptions = {
    require: {
        tableTools: '^tableTools'
    },
    bindings: {
        extraCondition: '<?'
    },
    controllerAs: 'vm',
    template: '<span ng-show="vm.tableTools.loading || vm.extraCondition">'
        + '&nbsp;<i class="fa fa-spinner fa-spin fa-lg"></i></span>',
};
