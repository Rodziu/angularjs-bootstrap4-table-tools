/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
import * as angular from 'angular';
import {ttSelectFactory} from './tt-select.factory';
import {ttSelectDirective} from './tt-select.directive';
import {ttSelectAllDirective} from './tt-select-all.directive';
import {ttSelectedClickDirective} from './tt-selected-click.directive';

const selectModule = angular.module('tableTools.select', [])
    .factory('ttSelect', ttSelectFactory)
    .directive('ttSelect', ttSelectDirective)
    .directive('ttSelectAll', ttSelectAllDirective)
    .directive('ttSelectedClick', ttSelectedClickDirective);

export const tableToolsSelect = selectModule.name;
