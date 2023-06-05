"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HierarchicalMenuFacet {
    constructor(config) {
        this.config = config;
        this.excludeOwnFilters = true;
    }
    getLabel() {
        return this.config.label;
    }
    getIdentifier() {
        return this.config.identifier;
    }
    getFilters(filters) {
        return {
            bool: {
                must: filters.map((filter) => ({
                    term: { [this.config.fields[filter.level - 1]]: filter.value }
                }))
            }
        };
    }
    getAggregation(overrides, queryManager) {
        const appliedFilters = queryManager.getFiltersById(this.config.identifier) || [];
        const levelAggs = this.config.fields.reduce((aggs, field, index) => {
            const level = index + 1;
            const parentFilters = appliedFilters.filter((f) => f.level < level);
            const getAggs = parentFilters.length === level - 1;
            if (getAggs) {
                return Object.assign(Object.assign({}, aggs), { [`lvl_${level}`]: {
                        filter: parentFilters.length === 0
                            ? { match_all: {} }
                            : {
                                bool: {
                                    must: parentFilters.map((f) => ({
                                        term: {
                                            [this.config.fields[f.level - 1]]: {
                                                value: f.value
                                            }
                                        }
                                    }))
                                }
                            },
                        aggs: {
                            aggs: {
                                terms: {
                                    field: this.config.fields[level - 1]
                                }
                            }
                        }
                    } });
            }
            return aggs;
        }, {});
        return {
            [this.getIdentifier()]: {
                filter: {
                    match_all: {}
                },
                aggs: levelAggs
            }
        };
    }
    getSelectedFilter(filterSet) {
        return {
            type: 'HierarchicalValueSelectedFilter',
            id: `${this.getIdentifier()}_${filterSet.value}`,
            identifier: this.getIdentifier(),
            label: this.getLabel(),
            value: filterSet.value,
            level: filterSet.level,
            display: this.config.display || 'HierarchicalMenuFacet'
        };
    }
    transformResponse(response, queryManager) {
        const appliedFilters = queryManager.getFiltersById(this.config.identifier) || [];
        const buildEntries = (level, parentId = '') => {
            if (response[`lvl_${level}`]) {
                const levelFilter = appliedFilters.find((f) => f.level === level);
                return response[`lvl_${level}`].aggs.buckets.map((bucket) => {
                    const isSelected = (levelFilter === null || levelFilter === void 0 ? void 0 : levelFilter.value) === bucket.key;
                    const id = `${parentId}_${this.getIdentifier()}_${bucket.key}_${level}${isSelected && '_selected'}`;
                    return {
                        label: bucket.key,
                        count: bucket.doc_count,
                        level: level,
                        entries: isSelected ? buildEntries(level + 1, id) : null
                    };
                });
            }
            return null;
        };
        return {
            identifier: this.getIdentifier(),
            label: this.getLabel(),
            type: 'HierarchicalMenuFacet',
            display: this.config.display || 'HierarchicalMenuFacet',
            entries: buildEntries(1)
        };
    }
}
exports.default = HierarchicalMenuFacet;
