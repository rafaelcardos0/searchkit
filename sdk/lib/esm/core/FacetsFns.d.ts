import { QueryDslQueryContainer, SearchResponseBody } from '@elastic/elasticsearch-types/lib/api/types';
import { BaseFacet, FacetResponse } from '../facets/BaseFacet';
import { BaseFilter } from '../filters';
import QueryManager from './QueryManager';
export declare const filterTransform: (queryManager: QueryManager, facets?: Array<BaseFilter>) => QueryDslQueryContainer;
export declare const getAggregationsFromFacets: (queryManager: QueryManager, overrides: any, facetsConfig: Array<BaseFacet>) => {
    aggs: {};
};
export declare const getFacetsFromResponse: (facetsConfig: Array<BaseFacet | BaseFilter>, response: SearchResponseBody<unknown>, queryManager: QueryManager) => FacetResponse[];
