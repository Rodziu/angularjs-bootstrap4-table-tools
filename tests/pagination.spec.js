/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
describe('pagination', function(){
	beforeEach(angular.mock.module('tableTools.pagination'));

	describe('paginate items', function(){
		const dataSet = [
			[1, [1, 2, 3, 4, 5]],
			[6, [4, 5, 6, 7, 8]],
			[37, [35, 36, 37, 38, 39]],
			[38, [36, 37, 38, 39, 40]],
			[39, [36, 37, 38, 39, 40]],
			[40, [36, 37, 38, 39, 40]]
		];
		for(let i = 0; i < dataSet.length; i++){
			const page = dataSet[i][0];
			const items = dataSet[i][1];
			it('page ' + page, inject(function(ttPagination){
				const instance = new ttPagination();
				instance.page = page;
				instance.paginate(1000, 25);
				expect(instance.pages).toEqual(40);
				expect(instance.items).toEqual(items);
			}));
		}
	});

	it('should not allow current page to be more than available pages', inject(function(ttPagination){
		const instance = new ttPagination();
		instance.page = 11;
		instance.paginate(10, 1);
		expect(instance.page).toEqual(10);
	}));
});
