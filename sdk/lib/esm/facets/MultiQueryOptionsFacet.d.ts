import { ValueFilter } from '../core/QueryManager';
import { BaseFacet } from './BaseFacet';
interface MultiQueryOptionsFacetConfig {
    identifier: string;
    field: string;
    label: string;
    display?: string;
    options: {
        min?: number;
        max?: number;
        value?: string | number;
        dateMin?: string;
        dateMax?: string;
        label: string;
    }[];
    multipleSelect?: boolean;
}
declare class MultiQueryOptionsFacet implements BaseFacet {
    config: MultiQueryOptionsFacetConfig;
    excludeOwnFilters: boolean;
    constructor(config: MultiQueryOptionsFacetConfig);
    getLabel(): string;
    getIdentifier(): string;
    getFilters(filterValues: ValueFilter[]): {
        bool: {
            [x: string]: ({
                range: {
                    [x: number]: {
                        lte: any;
                        gte: any;
                    };
                };
                term?: undefined;
            } | {
                term: {
                    [x: number]: any;
                };
                range?: undefined;
            })[];
        };
    };
    getAggregation(): {
        [x: string]: {
            filters: {
                filters: {};
            };
        };
    };
    getSelectedFilter(filterSet: ValueFilter): {
        identifier: string;
        id: string;
        label: string;
        display: string;
        type: string;
        value: string;
    };
    transformResponse(response: any): {
        identifier: string;
        label: string;
        display: string;
        type: string;
        entries: {
            label: string;
            count: any;
        }[];
    };
}
export default MultiQueryOptionsFacet;
