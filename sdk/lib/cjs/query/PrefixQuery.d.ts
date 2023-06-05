import QueryManager from '../core/QueryManager';
import { Query } from '../core/RequestBodyBuilder';
import BaseQuery from './BaseQuery';
interface PrefixQueryOptions {
    fields: string[];
}
export default class PrefixQuery implements BaseQuery {
    private fields;
    constructor(options: PrefixQueryOptions);
    getFilter(queryManager: QueryManager): Query;
}
export {};
