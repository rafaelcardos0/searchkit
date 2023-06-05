import QueryManager from '../core/QueryManager';
import BaseQuery from './BaseQuery';
interface MultiMatchQueryConfig {
    fields: string[];
}
declare class MultiMatchQuery implements BaseQuery {
    private config;
    constructor(config: MultiMatchQueryConfig);
    getFilter(queryManager: QueryManager): {
        bool: {
            should: ({
                multi_match: {
                    query: string;
                    fields: string[];
                    type: string;
                    operator: string;
                };
            } | {
                multi_match: {
                    query: string;
                    fields: string[];
                    type: string;
                    operator?: undefined;
                };
            })[];
        };
    };
}
export default MultiMatchQuery;
