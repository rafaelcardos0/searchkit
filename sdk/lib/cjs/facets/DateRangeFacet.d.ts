import { DateRangeFilter } from '../core/QueryManager';
import { BaseFacet } from './BaseFacet';
interface DateRangeFacetConfig {
    identifier: string;
    field: string;
    label: string;
    display?: 'DateRange' | string;
}
declare class DateRangeFacet implements BaseFacet {
    config: DateRangeFacetConfig;
    excludeOwnFilters: boolean;
    constructor(config: DateRangeFacetConfig);
    getLabel(): string;
    getIdentifier(): string;
    getFilters(filters: Array<DateRangeFilter>): {
        range: {
            [x: string]: {
                gte?: string;
                lte?: string;
            };
        };
    };
    getAggregation(): {};
    getSelectedFilter(filterSet: any): {
        type: string;
        id: string;
        identifier: string;
        label: string;
        dateMin: any;
        dateMax: any;
        display: string;
    };
    transformResponse(): {
        identifier: string;
        label: string;
        type: string;
        display: string;
        entries: any;
    };
}
export default DateRangeFacet;
