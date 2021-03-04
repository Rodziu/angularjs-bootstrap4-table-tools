/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import {IAttributes, IController, IDirective, IOnChangesObject} from 'angular';
import * as angular from 'angular';
import {operator} from './tt-search.factory';
import {TableToolsController} from '../table-tools.directive';

/**
 * @ngInject
 */
export class TtFilterController implements IController {
    private readonly $attrs: IAttributes;
    private checkboxValue: unknown;
    private ngModel: unknown;
    private tableTools: TableToolsController;
    public ttFilterEmpty: string;
    public ttFilterOperator: operator;
    public ttFilterOr: boolean;
    public ttFilter: string;

    constructor($attrs: IAttributes) {
        this.$attrs = $attrs;
        if ('type' in $attrs && $attrs['type'] === 'checkbox') {
            $attrs.$observe('value', (value) => {
                this.checkboxValue = value;
            });
        }
    }

    $onInit(): void {
        if (angular.isUndefined(this.ttFilterOperator)) {
            this.ttFilterOperator = '==';
        }
        if (angular.isUndefined(this.ttFilterEmpty)) {
            this.ttFilterEmpty = '';
        }
        this.ttFilterOr = 'ttFilterOr' in this.$attrs || ('type' in this.$attrs && this.$attrs['type'] === 'checkbox');
        this.tableTools.ttSearch.registerFilter(this.ttFilter, this);
        this.tableTools.filterData();
    }

    $onChanges(changes: IOnChangesObject): void {
        if ('ngModel' in changes && 'tableTools' in this) {
            this.tableTools.filterData();
        }
    }

    $onDestroy(): void {
        this.tableTools.ttSearch.unregisterFilter(this.ttFilter, this);
    }

    getValue(): unknown {
        if (angular.isDefined(this.checkboxValue)) {
            return this.ngModel ? this.checkboxValue : this.ttFilterEmpty;
        }
        return this.ngModel;
    }
}

export function ttFilterDirective(): IDirective {
    /**
     * @ngdoc directive
     * @param {string} ttFilter
     * @param {string} ttFilterOperator
     * @param {string} ttFilterEmpty
     * @param {string} ttFilterOr
     */
    return {
        restrict: 'A',
        require: {
            tableTools: '^tableTools',
            ngModelCtrl: 'ngModel'
        },
        bindToController: {
            ttFilter: '@',
            ttFilterOperator: '@',
            ttFilterEmpty: '@',
            ngModel: '<'
        },
        controller: TtFilterController
    };
}
