import { RangeFilter } from '../core/QueryManager';
import { BaseFacet } from './BaseFacet';
interface RangeFacetConfig {
    identifier: string;
    field: string;
    label: string;
    display?: 'Slider' | string;
    range: {
        min: number;
        max: number;
        interval: number;
        min_doc_count?: number;
    };
}
declare class RangeFacet implements BaseFacet {
    config: RangeFacetConfig;
    excludeOwnFilters: boolean;
    constructor(config: RangeFacetConfig);
    getLabel(): string;
    getIdentifier(): string;
    getFilters(filters: Array<RangeFilter>): {
        range: {
            [x: string]: {
                gte?: number;
                lte?: number;
            };
        };
    };
    getAggregation(): {
        [x: string]: {
            histogram: {
                field: string;
                interval: number;
                min_doc_count: number;
                extended_bounds: {
                    min: number;
                    max: number;
                };
            };
        };
    };
    getSelectedFilter(filterSet: any): {
        identifier: string;
        id: string;
        label: string;
        display: string;
        type: string;
        min: any;
        max: any;
    };
    transformResponse(response: any): {
        identifier: string;
        label: string;
        display: string;
        type: string;
        entries: any;
    };
}
export default RangeFacet;
