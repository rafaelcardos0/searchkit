"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const isUndefined_1 = __importDefault(require("lodash/isUndefined"));
class RangeFacet {
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
        const rangeFilter = {};
        if (!isUndefined_1.default(filters[0].min))
            rangeFilter.gte = filters[0].min;
        if (!isUndefined_1.default(filters[0].max))
            rangeFilter.lte = filters[0].max;
        return { range: { [this.config.field]: rangeFilter } };
    }
    getAggregation() {
        return {
            [this.getIdentifier()]: {
                histogram: {
                    field: this.config.field,
                    interval: this.config.range.interval,
                    min_doc_count: this.config.range.min_doc_count || 0,
                    extended_bounds: { min: this.config.range.min, max: this.config.range.max }
                }
            }
        };
    }
    getSelectedFilter(filterSet) {
        return {
            identifier: this.getIdentifier(),
            id: `${this.getIdentifier()}_${filterSet.min}_${filterSet.max}`,
            label: this.getLabel(),
            display: this.config.display || 'RangeSliderFacet',
            type: 'NumericRangeSelectedFilter',
            min: filterSet.min,
            max: filterSet.max
        };
    }
    transformResponse(response) {
        return {
            identifier: this.getIdentifier(),
            label: this.getLabel(),
            display: this.config.display || 'RangeSliderFacet',
            type: 'RangeFacet',
            entries: response.buckets.map((entry) => ({
                label: entry.key,
                count: entry.doc_count
            }))
        };
    }
}
exports.default = RangeFacet;
