import { SearchkitConfig } from '../';
import { BaseFacet } from '../facets';
import QueryManager from './QueryManager';
export interface SearchResponse<T> {
    took: number;
    timed_out: boolean;
    hits: {
        total: {
            value: number;
        };
        max_score: number;
        hits: Array<{
            _id: number;
            _source: any;
            fields?: any;
            highlight?: any;
            inner_hits?: any;
            matched_queries?: string[];
            sort?: string[];
        }>;
    };
    aggregations?: any;
}
export declare type Query = {
    bool?: {
        must?: Array<Record<string, unknown>>;
        should?: Array<Record<string, unknown>>;
        filter?: Array<Record<string, unknown>>;
    };
};
export declare const mergeESQueries: (queries: any) => any;
export default function RequestBodyBuilder(queryManager: QueryManager, config: SearchkitConfig, baseFilters: Array<Record<string, unknown>>, facets: Array<BaseFacet>, partialQueries: Array<any>): any;
