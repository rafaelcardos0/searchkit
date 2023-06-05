import { ValueFilter } from '../core/QueryManager';
import { BaseFacet, FacetOptions } from './BaseFacet';
interface RefinementSelectFacetConfig {
    identifier: string;
    field: string;
    size?: number;
    label: string;
    display?: 'ListFacet' | 'ComboFacet' | string;
    multipleSelect?: boolean;
    order?: 'count' | 'value';
}
declare class RefinementSelectFacet implements BaseFacet {
    config: RefinementSelectFacetConfig;
    excludeOwnFilters: boolean;
    constructor(config: RefinementSelectFacetConfig);
    getLabel(): string;
    getIdentifier(): string;
    getFilters(filters: Array<ValueFilter>): {
        bool: {
            [x: string]: {
                term: {
                    [x: string]: string;
                };
            }[];
        };
    };
    getAggregation(overrides: FacetOptions): {
        [x: string]: {
            terms: {
                include?: any;
                order?: {
                    _count: string;
                } | {
                    _key: string;
                };
                field: string;
                size: number;
            };
        };
    };
    getSelectedFilter(filterSet: any): {
        identifier: string;
        id: string;
        label: string;
        display: string;
        type: string;
        value: any;
    };
    transformResponse(response: any): {
        identifier: string;
        label: string;
        display: string;
        type: string;
        entries: any;
    };
}
export default RefinementSelectFacet;
