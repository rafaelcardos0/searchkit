"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filterClauseMapper = (field) => (option) => {
    if (option.min || option.max) {
        return {
            range: {
                [field]: Object.assign(Object.assign({}, (option.min && { gte: option.min })), (option.max && { lte: option.max }))
            }
        };
    }
    else if (option.value) {
        return {
            term: {
                [field]: option.value
            }
        };
    }
    else if (option.dateMin || option.dateMax) {
        return {
            range: {
                [field]: Object.assign(Object.assign({}, (option.dateMin && { gte: option.dateMin })), (option.dateMax && { lte: option.dateMax }))
            }
        };
    }
};
class MultiQueryOptionsFacet {
    constructor(config) {
        this.config = config;
        this.excludeOwnFilters = false;
        this.excludeOwnFilters = config.multipleSelect;
    }
    getLabel() {
        return this.config.label;
    }
    getIdentifier() {
        return this.config.identifier;
    }
    getFilters(filterValues) {
        const condition = this.excludeOwnFilters ? 'should' : 'must';
        const filters = filterValues
            .map((value) => this.config.options.find((option) => option.label === value.value))
            .filter((option) => !!option);
        return {
            bool: {
                [condition]: filters.map(filterClauseMapper(this.config.field))
            }
        };
    }
    getAggregation() {
        const filterClauses = this.config.options.map(filterClauseMapper(this.config.field));
        const filters = this.config.options.reduce((acc, option, i) => {
            acc[option.label] = filterClauses[i];
            return acc;
        }, {});
        return {
            [this.getIdentifier()]: {
                filters: {
                    filters: filters
                }
            }
        };
    }
    getSelectedFilter(filterSet) {
        return {
            identifier: this.getIdentifier(),
            id: `${this.getIdentifier()}_${filterSet.value}`,
            label: this.getLabel(),
            display: this.config.display || 'ListFacet',
            type: 'MultiQueryOptionsFacet',
            value: filterSet.value
        };
    }
    transformResponse(response) {
        return {
            identifier: this.getIdentifier(),
            label: this.getLabel(),
            display: this.config.display || 'ListFacet',
            type: 'MultiQueryOptionsFacet',
            entries: this.config.options.map((option) => {
                var _a;
                const docCount = ((_a = response.buckets[option.label]) === null || _a === void 0 ? void 0 : _a.doc_count) || 0;
                return {
                    label: option.label,
                    count: docCount
                };
            })
        };
    }
}
exports.default = MultiQueryOptionsFacet;
