import type { SearchInnerHits, SearchRequest } from '@elastic/elasticsearch-types/lib/api/types';
import { MixedFilter, QueryOptions } from './core/QueryManager';
import BaseQuery from './query/BaseQuery';
import { BaseFacet } from './facets/BaseFacet';
import { BaseFilter } from './filters/BaseFilter';
import { VisibleWhenRuleSet } from './facets';
import { SearchkitTransporter } from './transporters';
import { SearchkitResponse, SearchkitHit } from './transformers';
import { BaseSuggestor } from './suggestors';
export * from './query';
export * from './facets';
export * from './filters';
export * from './transporters';
export * from './suggestors';
export { MixedFilter, QueryOptions, SearchkitResponse, SearchkitHit };
export interface SortingOption {
    id: string;
    label: string;
    field: any;
    defaultOption?: boolean;
}
export interface CustomHighlightConfig {
    field: string;
    config: any;
}
export interface CloudHost {
    id: string;
}
export interface BaseConfig {
    host?: string;
    cloud?: CloudHost;
    index: string;
    connectionOptions?: {
        apiKey?: string;
        headers?: Record<string, string>;
    };
}
export declare type CollapseInnerHitsConfig = SearchInnerHits;
export interface CollapseConfig {
    field: string;
    inner_hits?: CollapseInnerHitsConfig | CollapseInnerHitsConfig[];
}
export interface SearchkitConfig extends BaseConfig {
    suggestions?: Array<BaseSuggestor<any>>;
    sortOptions?: SortingOption[];
    hits?: {
        fields: string[];
        highlightedFields?: (string | CustomHighlightConfig)[];
    };
    query?: BaseQuery;
    facets?: Array<BaseFacet | VisibleWhenRuleSet>;
    filters?: Array<BaseFilter>;
    collapse?: CollapseConfig;
    postProcessRequest?: (body: SearchRequest) => SearchRequest;
}
export interface ResultsResolverParameters {
    filters: Array<MixedFilter>;
    query: string;
}
declare const createInstance: (config: SearchkitConfig, transporter?: SearchkitTransporter) => SearchkitRequest;
export declare type ResponseRequest = {
    hits?: {
        size?: number;
        from?: number;
        includeRawHit?: boolean;
    };
    facets?: boolean | Array<{
        identifier: string;
        query?: string;
        size?: number;
    }>;
};
export declare type BaseFilters = Array<any>;
export declare class SearchkitRequest {
    private config;
    private queryManager;
    private transporter;
    private transformer;
    constructor(config: SearchkitConfig, transporter?: SearchkitTransporter);
    handleDefaults(): void;
    query(query: string): SearchkitRequest;
    setFilters(filters: Array<MixedFilter>): SearchkitRequest;
    setQueryOptions(options: QueryOptions): SearchkitRequest;
    setSortBy(sortBy: string): SearchkitRequest;
    executeSuggestions(query: string): Promise<Array<any>>;
    execute(responseRequest: ResponseRequest, baseFilters?: BaseFilters): Promise<SearchkitResponse>;
}
export default createInstance;
