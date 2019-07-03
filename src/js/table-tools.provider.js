/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
!function(){
	'use strict';

	function tableToolsProvider(){
		this.perPage = 25;
		this.perPageOptions = [
			{number: 10, text: 10},
			{number: 25, text: 25},
			{number: 50, text: 50},
			{number: 100, text: 100},
			{number: 200, text: 200},
			{number: Infinity, text: 'Wszystkie'}
		];
		this.scrollOffset = 0;
		this.lang = {
			first: 'Pierwsza strona',
			prev: 'Poprzednia strona',
			next: 'Następna strona',
			last: 'Ostatnia strona',
			results: 'Wyniki:',
			from: 'z',
			perPage: 'Wyników na stronę:',
			search: 'Szukaj...',
			filteredResults: 'Filtrowanie z:',
			export: 'Export',
			exportChooseColumns: 'Wybierz kolumny',
			flipSelection: 'odwróć zaznaczenie',
			exportColumnNames: 'Eksportuj nazwy kolumn',
			exportSeparator: 'Separator',
			tabulator: 'Tabulator',
			copy: 'Kopiuj',
			csv: 'CSV',
			copiedToClipboard: 'Skopiowano do schowka'
		};
		this.exportTypes = {
			copy: {
				lang: this.lang.copy
			},
			csv: {
				lang: this.lang.csv,
				parseText: function(txt){
					return '"' + txt.replace('"', '""') + '"';
				}
			}
		};
		this.exportNotification = function(type){
			if(type === 'copy'){
				alert(this.lang.copiedToClipboard);
			}
		};
		// noinspection JSUnusedGlobalSymbols
		this.$get = function(){
			return this;
		};
	}

	angular.module('tableTools').provider('tableTools', tableToolsProvider);
}();
