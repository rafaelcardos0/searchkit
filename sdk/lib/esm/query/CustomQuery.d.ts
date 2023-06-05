import QueryManager from '../core/QueryManager';
import type { Query } from '../core/RequestBodyBuilder';
import BaseQuery from './BaseQuery';
interface CustomQueryConfig {
    queryFn(query: string, queryManager?: QueryManager): Query | null;
}
declare class CustomQuery implements BaseQuery {
    private config;
    constructor(config: CustomQueryConfig);
    getFilter(queryManager: QueryManager): Query;
}
export default CustomQuery;
