import { SearchResponseBody } from '@elastic/elasticsearch-types/lib/api/types';
import { FacetResponse, ResponseRequest, SearchkitConfig, SelectedFilter } from '..';
import QueryManager from '../core/QueryManager';
export interface SearchkitResponseTransformer {
    transformResponse(responseBody: any, facetsConfig: any, queryManager: any, config: any, responseRequest: any): any;
}
export declare type DisabledFilter = {
    disabled: true;
    identifier: string;
};
export interface SortOption {
    id: string;
    label: string;
}
export declare type SummaryResponse = {
    total: number;
    appliedFilters: SelectedFilter[];
    disabledFilters: DisabledFilter[];
    query: string;
    sortOptions: SortOption[];
};
export interface SearchkitHit {
    id: string;
    fields: Record<string, any>;
    highlight: Record<string, any>;
    innerHits?: Record<string, SearchkitInnerHits>;
    rawHit?: Record<string, any>;
}
export interface SearchkitPage {
    total: number;
    totalPages: number;
    pageNumber: number;
    from: number;
    size: number;
}
export interface SearchkitHits {
    items: SearchkitHit[];
    page: SearchkitPage;
}
export interface SearchkitInnerHits {
    items: SearchkitHit[];
    total: number;
}
export interface SearchkitResponse {
    summary: SummaryResponse;
    facets: FacetResponse[];
    hits: SearchkitHits;
    sortedBy?: string;
}
export declare class ElasticSearchResponseTransformer implements SearchkitResponseTransformer {
    transformResponse(responseBody: SearchResponseBody, facetsConfig: any, queryManager: QueryManager, config: SearchkitConfig, responseRequest: ResponseRequest): SearchkitResponse;
}
