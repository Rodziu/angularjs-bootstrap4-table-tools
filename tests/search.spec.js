/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

describe('search', function(){
	beforeEach(angular.mock.module('tableTools.search'));

	describe('search items', function(){
		const dataSet = [
			[1, [1, 2, 3, 4, 5], [1]],
			["test", ["tes test", 5, 6, 7, 8], ["tes test"]],
			["test", [{test: "something"}, {something: "test"}], [{something: "test"}]],
			["test", [{nested: {'object': 'test'}}], [{nested: {'object': 'test'}}]],
			[1, [{nested: {'object': 1}}], [{nested: {'object': 1}}]]
		];
		for(let i = 0; i < dataSet.length; i++){
			const search = dataSet[i][0];
			const items = dataSet[i][1];
			const expected = dataSet[i][2];
			it('search ' + search, inject(function(ttSearch){
				const instance = new ttSearch();
				instance.search = search;
				const result = instance.doSearch(items);
				expect(result).toEqual(expected);
			}));
		}
	});
});
