/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import * as angular from 'angular';
import {ttPaginationFactory} from './tt-pagination.factory';
import {ttPerPageComponent} from './tt-per-page.component';
import {ttPaginationComponent} from './tt-pagination.component';

const paginationModule = angular.module('tableTools.pagination', [])
    .factory('ttPagination', ttPaginationFactory)
    .component('ttPerPage', ttPerPageComponent)
    .component('ttPagination', ttPaginationComponent);

export const tableToolsPagination = paginationModule.name;
