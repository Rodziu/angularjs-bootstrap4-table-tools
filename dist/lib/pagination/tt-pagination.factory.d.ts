export declare class TtPagination {
    private readonly pagesAround;
    private readonly visiblePageCount;
    page: number;
    pages: number;
    start: number;
    end: number;
    items: number[];
    constructor(visiblePageCount?: number);
    paginate(resultsLength: number, perPage: number): void;
}
export declare function ttPaginationFactory(): typeof TtPagination;
