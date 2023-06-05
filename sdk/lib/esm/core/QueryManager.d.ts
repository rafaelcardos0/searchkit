import { SortingOption } from '..';
export declare type ValueFilter = {
    identifier: string;
    value: string;
};
export declare type RangeFilter = {
    identifier: string;
    min?: number;
    max?: number;
};
export declare type DateRangeFilter = {
    identifier: string;
    dateMin?: string;
    dateMax?: string;
};
export declare type GeoPoint = {
    lat: number;
    lon: number;
};
export declare type GeoBoundingBoxFilter = {
    identifier: string;
    geoBoundingBox: {
        topLeft?: GeoPoint;
        bottomRight?: GeoPoint;
        topRight?: GeoPoint;
        bottomLeft?: GeoPoint;
    };
};
export declare type HierarchicalValueFilter = {
    identifier: string;
    value: string;
    level: number;
};
export declare type QueryOptions = {
    fields: Array<string>;
};
export declare type MixedFilter = ValueFilter | RangeFilter | DateRangeFilter | GeoBoundingBoxFilter | HierarchicalValueFilter;
export default class QueryManager {
    private sortBy;
    private filters;
    private query;
    private queryOptions;
    constructor();
    setQuery(query: string): void;
    setQueryOptions(options: QueryOptions): void;
    setFilters(filters: Array<MixedFilter>): void;
    hasFilters(): boolean;
    hasQuery(): boolean;
    getQuery(): string;
    getQueryOptions(): QueryOptions;
    getFilters(): Array<MixedFilter>;
    getFiltersById(id: string): Array<MixedFilter>;
    setSortBy(sort: SortingOption): void;
    getSortBy(): SortingOption;
}
