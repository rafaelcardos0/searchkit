import QueryManager, { HierarchicalValueFilter } from '../core/QueryManager';
import { BaseFacet } from './BaseFacet';
interface HierarchicalMenuFacetConfig {
    identifier: string;
    fields: Array<string>;
    label: string;
    display?: 'HierarchicalMenu' | string;
}
declare class HierarchicalMenuFacet implements BaseFacet {
    config: HierarchicalMenuFacetConfig;
    excludeOwnFilters: boolean;
    constructor(config: HierarchicalMenuFacetConfig);
    getLabel(): string;
    getIdentifier(): string;
    getFilters(filters: Array<HierarchicalValueFilter>): {
        bool: {
            must: {
                term: {
                    [x: string]: string;
                };
            }[];
        };
    };
    getAggregation(overrides: any, queryManager: QueryManager): {
        [x: string]: {
            filter: {
                match_all: {};
            };
            aggs: {};
        };
    };
    getSelectedFilter(filterSet: any): {
        type: string;
        id: string;
        identifier: string;
        label: string;
        value: any;
        level: any;
        display: string;
    };
    transformResponse(response: any, queryManager: QueryManager): {
        identifier: string;
        label: string;
        type: string;
        display: string;
        entries: any;
    };
}
export default HierarchicalMenuFacet;
