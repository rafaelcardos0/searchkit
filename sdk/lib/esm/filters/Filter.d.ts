/// <reference types="lodash" />
import { MixedFilter } from '../core/QueryManager';
import { BaseFilter } from './BaseFilter';
interface FilterConfig {
    identifier: string;
    field: string;
    label: string;
    display?: 'Filter' | string;
}
declare class Filter implements BaseFilter {
    private config;
    constructor(config: FilterConfig);
    getIdentifier(): string;
    getLabel(): string;
    getFilters(filters: MixedFilter[]): {
        bool: {
            filter: ({
                range: {
                    [x: string]: {
                        gte?: number;
                        lte?: number;
                    };
                };
                geo_bounding_box?: undefined;
                term?: undefined;
            } | {
                range: {
                    [x: string]: {
                        gte?: string;
                        lte?: string;
                    };
                };
                geo_bounding_box?: undefined;
                term?: undefined;
            } | {
                geo_bounding_box: {
                    [x: string]: import("lodash").Dictionary<any>;
                };
                range?: undefined;
                term?: undefined;
            } | {
                term: {
                    [x: string]: string;
                };
                range?: undefined;
                geo_bounding_box?: undefined;
            })[];
        };
    };
    getSelectedFilter(filter: MixedFilter): {
        identifier: string;
        id: string;
        label: string;
        display: string;
        type: string;
        min: number;
        max: number;
        topLeft?: undefined;
        bottomRight?: undefined;
        value?: undefined;
    } | {
        identifier: string;
        id: string;
        label: string;
        display: string;
        type: string;
        min: string;
        max: string;
        topLeft?: undefined;
        bottomRight?: undefined;
        value?: undefined;
    } | {
        type: string;
        id: string;
        identifier: string;
        label: string;
        topLeft: import("../core/QueryManager").GeoPoint;
        bottomRight: import("../core/QueryManager").GeoPoint;
        display: string;
        min?: undefined;
        max?: undefined;
        value?: undefined;
    } | {
        type: string;
        id: string;
        identifier: string;
        label: string;
        value: string;
        display: string;
        min?: undefined;
        max?: undefined;
        topLeft?: undefined;
        bottomRight?: undefined;
    };
}
export default Filter;
