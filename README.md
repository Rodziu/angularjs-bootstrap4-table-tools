# AngularJS TableTools Plugin

Plugin that makes working with tables easier.
Through various set of directives it enables you to easily create a pagination, sort table data, filter it and many more.

It uses [Bootstrap 4](https://getbootstrap.com/docs/) and [Font Awesome](https://fontawesome.com/v4.7.0/icons/) for better presentation.

See [Live Demo](https://mateuszrohde.pl/repository/angularjs-bootstrap4-table-tools/demo/index.html) for an example.

## Prerequisites

- AngularJS,
- [angularjs-bootstrap-4](https://mateuszrohde.pl/repository/angularjs-bootstrap-4),
- Font Awesome.

## Installation

```
yarn add angularjs-bootstrap4-table-tools
yarn install
```

## Configuration

Language strings and other defaults are configurable through the `tableTools` provider.

```
angular.module('...').config(['tableToolsProvider', function(tableToolsProvider){
	tableToolsProvider.perPage = 10;
}]);
```

## Usage

See [Live Demo](https://mateuszrohde.pl/repository/angularjs-bootstrap4-table-tools/demo/index.html) and its source code to better understand all of available directives and its usage.

### Basic usage

Create a container with table-tools directive inside which you will be able to work with table data. Bind an array of table data to the directive. Table data should be an array of objects.

TableTools controller is bound to the new scope created by directive in `tableTools` variable. Filtered data is available through `tableTools.data` variable.

```html
<div table-tools="tableData">
	<div ng-repeat="d in tableTools.data">
		{{d}}
	</div>
</div>
```

You can change the default order of data using `order="field"` directive. Field is the key in each object of tableData, by which the data will be ordered. Use `-field` for descending order.

You can change number of rows per page and allowed per-page options using `per-page` and `per-page-options` directives.

### Sorting

Use `sort="field_name"` directive on column headers to enable column sorting. Order will be changed on click. Clicking with shift key enables sorting by multiple columns.
 
### Data filtering

Use `tt-search` directive to create a search component (input). Typing text inside it will filter the data leaving only rows that match given search string (row is match if any of its object values matches the search string).
 
You can create data filters with `tt-filter="field_name"` directive. It requires an `ng-model` which value would be used to filter the data. If tt-filter element has an value directive, it will be used instead of ng-model (ie. for checkboxes).   

tt-filter accepts some options through other directives:

- `tt-filter-empty=""` - if filter value matches tt-filter-empty value, this filter will be skipped
- `tt-filter-operator=""` - change the default (==) operator used for comparison, available operators are:
	- ==
	- &gt;=
	- <=
	- &gt;
	- <
	- like
- `tt-filter-or` - if any other filter bound to the same field_name is matched, this filter will pass too

### Pagination

Use `pagination` directive to create pagination compontent.

Use `tt-per-page` directive to create a component that allows user to change default results per page number.

### Select rows

You can use `tt-select="rowItem"` directive inside each row to create a checkbox that allows user to select given row.

Use `tt-select-all` directive to create a checkbox that selects/deselects all checkboxes created by `tt-select`.

Use `tt-selected-click="callbackFunction"` to do something with selected rows. callbackFunction will be called with an array of selected rows.

### Export (requires angularjs-bootstrap)

Use `tt-export` directive to create a component that allows user to easily export currently visible data. Export takes data from HTML, so its exported in a format that is visible in browser.

### Server-side processing

Use `tt-url="http://some/url"` to process data on server-side. 
