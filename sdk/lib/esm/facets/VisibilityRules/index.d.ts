import { BaseFacet } from '../BaseFacet';
import QueryManager from '../../core/QueryManager';
export declare class VisibleWhenRuleSet {
    private facets;
    private rules;
    constructor(facets: Array<BaseFacet>, rules: Array<any>);
    getActiveFacets(queryManager: QueryManager, ctx: any): Array<BaseFacet>;
}
export declare function VisibleWhen(facets: Array<BaseFacet>, rules: Array<any>): VisibleWhenRuleSet;
export declare function FacetSelectedRule(identifier: string, value?: string): (queryManager: QueryManager) => boolean;
