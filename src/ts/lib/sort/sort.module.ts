/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
import * as angular from 'angular';
import {ttSortFactory} from './tt-sort.factory';
import {ttSortDirective} from './tt-sort.directive';

const sortModule = angular.module('tableTools.sort', [])
    .factory('ttSort', ttSortFactory)
    .directive('ttSort', ttSortDirective);

export const tableToolsSort = sortModule.name;
