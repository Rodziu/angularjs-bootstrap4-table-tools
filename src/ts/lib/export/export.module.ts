/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import * as angular from 'angular';
import angularBS from 'angularjs-bootstrap-4';
import {ttExportComponent} from './tt-export.component';

const exportModule = angular.module('tableTools.export', [angularBS])
    .component('ttExport', ttExportComponent);

export const tableToolsExport = exportModule.name;
