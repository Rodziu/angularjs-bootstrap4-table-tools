/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import * as angular from 'angular';
import {tableToolsExport} from './export/export.module';
import {TableToolsProvider} from './table-tools.provider';
import {tableToolsPagination} from './pagination/pagination.module';
import {tableToolsSearch} from './search/search.module';
import {tableToolsSelect} from './select/select.module';
import {tableToolsSort} from './sort/sort.module';
import {tableToolsDirective} from './table-tools.directive';
import {ttFooterComponent} from './tt-footer.component';
import {ttHeaderComponent} from './tt-header.component';
import {ttLoadingComponent} from './tt-loading.component';
import {ttResultsCountComponent} from './tt-results-count.component';
import {ttRowPlaceholderDirective} from './tt-row-placeholder.directive';

const tableToolsModule = angular.module('tableTools', [
    tableToolsSearch, tableToolsPagination, tableToolsExport, tableToolsSelect, tableToolsSort
])
    .provider('tableTools', TableToolsProvider)
    .directive('tableTools', tableToolsDirective)
    .directive('ttRowPlaceholder', ttRowPlaceholderDirective)
    .component('ttFooter', ttFooterComponent)
    .component('ttHeader', ttHeaderComponent)
    .component('ttLoading', ttLoadingComponent)
    .component('ttResultsCount', ttResultsCountComponent);

export const tableTools = tableToolsModule.name;
