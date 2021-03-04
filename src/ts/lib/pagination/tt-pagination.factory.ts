/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

export class TtPagination {
    private readonly pagesAround: number;
    private readonly visiblePageCount: number;
    public page = 1;
    public pages = 1;
    public start = 0;
    public end = 0;
    public items: number[] = [];

    constructor(visiblePageCount = 5) {
        this.visiblePageCount = visiblePageCount;
        this.pagesAround = Math.floor(visiblePageCount / 2);
    }

    paginate(resultsLength: number, perPage: number): void {
        this.pages = Math.ceil(resultsLength / perPage);
        if (this.pages === 0) {
            this.pages = 1;
        }
        if (this.page > this.pages) {
            this.page = this.pages;
        }
        this.items = [];
        const pagesAfter = this.pages - this.page; // number of pages after currently selected page
        let i = this.page // we set a starting page in here
            - (pagesAfter < this.pagesAround // we won't be able to display all pages after current page
                ? this.visiblePageCount - 1 - pagesAfter // so we display the difference before current page
                : this.pagesAround);
        if (i < 1) {
            i = 1;
        }
        do {
            this.items.push(i);
            i++;
        } while (this.items.length < this.visiblePageCount && i <= this.pages);
        this.start = perPage === Infinity
            ? 1
            : Math.min(
                ((this.page - 1) * perPage) + 1,
                resultsLength
            );
        this.end = Math.min(this.page * perPage, resultsLength);
    }
}

export function ttPaginationFactory(): typeof TtPagination {
    return TtPagination;
}
