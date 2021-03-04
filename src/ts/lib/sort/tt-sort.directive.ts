/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import {TableToolsController} from '../table-tools.directive';
import {IAttributes, IDirective, IScope} from 'angular';
import * as angular from 'angular';

/**
 * @ngInject
 */
export class TtSortDirectiveController {
    private $element: JQLite;
    private state: string;
    private tableTools: TableToolsController;
    private readonly $attrs: IAttributes;

    constructor($element: JQLite, $attrs: IAttributes, $scope: IScope) {
        this.$attrs = $attrs;
        this.$element = $element;

        $element.on('click', (e) => {
            if (!e.shiftKey) { // change sorting direction
                if (this.tableTools.order === this.$attrs['ttSort']) {
                    this.tableTools.order = '-' + this.$attrs['ttSort'];
                } else {
                    this.tableTools.order = this.$attrs['ttSort'];
                }
            } else { // append to current order array
                if (angular.isString(this.tableTools.order)) {
                    this.tableTools.order = [this.tableTools.order];
                } else if (!angular.isArray(this.tableTools.order)) {
                    this.tableTools.order = [];
                }
                let found = false;
                this.tableTools.order.map((order) => {
                    if (order === this.$attrs['ttSort']) {
                        found = true;
                        return `-${this.$attrs['ttSort']}`;
                    } else if (order === `-${this.$attrs['ttSort']}`) {
                        found = true;
                        return this.$attrs['ttSort'];
                    }
                    return order;
                });
                if (!found) {
                    this.tableTools.order.push(this.$attrs['ttSort']);
                }
            }
            $scope.$apply();
        });
    }

    $onInit(): void {
        this.tableTools.ttSort.register(this.$attrs['ttSort'], this);
    }

    $onDestroy(): void {
        this.tableTools.ttSort.unregister(this.$attrs['ttSort'], this);
    }

    /**
     * Update sorting item class
     */
    updateState(state: string): void {
        if (this.state !== state) {
            if (this.state) {
                this.$element.removeClass('sorting-' + this.state);
            }
            if (state) {
                this.$element.addClass('sorting-' + state);
            }
            this.state = state;
        }
    }
}

export function ttSortDirective(): IDirective {
    return {
        restrict: 'A',
        require: {
            tableTools: '^tableTools'
        },
        bindToController: true,
        controller: TtSortDirectiveController
    };
}
