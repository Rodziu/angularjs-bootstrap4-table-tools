/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
import * as angular from 'angular';
import {ttFilterDirective} from './tt-filter.directive';
import {ttSearchFactory} from './tt-search.factory';
import {ttSearchComponent} from './tt-search.component';

const searchModule = angular.module('tableTools.search', [])
    .directive('ttFilter', ttFilterDirective)
    .factory('ttSearch', ttSearchFactory)
    .component('ttSearch', ttSearchComponent);

export const tableToolsSearch = searchModule.name;
