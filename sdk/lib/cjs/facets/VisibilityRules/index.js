"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacetSelectedRule = exports.VisibleWhen = exports.VisibleWhenRuleSet = void 0;
class VisibleWhenRuleSet {
    constructor(facets, rules) {
        this.facets = facets;
        this.rules = rules;
    }
    getActiveFacets(queryManager, ctx) {
        const rulesSatisfied = this.rules.filter((rule) => rule(queryManager, ctx));
        return rulesSatisfied.length === this.rules.length ? this.facets : [];
    }
}
exports.VisibleWhenRuleSet = VisibleWhenRuleSet;
function VisibleWhen(facets, rules) {
    return new VisibleWhenRuleSet(facets, rules);
}
exports.VisibleWhen = VisibleWhen;
function FacetSelectedRule(identifier, value) {
    return (queryManager) => {
        const identifierFilters = queryManager.getFiltersById(identifier);
        if (!identifierFilters)
            return false;
        if (!value)
            return true;
        if (value) {
            return !!identifierFilters.find((filter) => filter.value === value);
        }
    };
}
exports.FacetSelectedRule = FacetSelectedRule;
