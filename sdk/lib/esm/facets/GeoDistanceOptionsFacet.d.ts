import { ValueFilter } from '../core/QueryManager';
import { BaseFacet } from './BaseFacet';
interface GeoDistanceOptionsFacetConfig {
    identifier: string;
    field: string;
    origin: string;
    unit?: string;
    label: string;
    display?: string;
    ranges: {
        from?: number;
        to?: number;
        label: string;
    }[];
    multipleSelect?: boolean;
}
declare class GeoDistanceOptionsFacet implements BaseFacet {
    config: GeoDistanceOptionsFacetConfig;
    excludeOwnFilters: boolean;
    private unit;
    constructor(config: GeoDistanceOptionsFacetConfig);
    getLabel(): string;
    getIdentifier(): string;
    getFilters(filterValues: ValueFilter[]): {
        bool: {
            [x: string]: {
                bool: {
                    must?: {
                        geo_distance: {
                            [x: string]: string;
                            distance: string;
                        };
                    }[];
                    must_not?: {
                        geo_distance: {
                            [x: string]: string;
                            distance: string;
                        };
                    }[];
                };
            }[];
        };
    };
    getAggregation(): {
        [x: string]: {
            geo_distance: {
                field: string;
                origin: string;
                unit: string;
                keyed: boolean;
                ranges: {
                    from: number;
                    to: number;
                    key: string;
                }[];
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
export default GeoDistanceOptionsFacet;
