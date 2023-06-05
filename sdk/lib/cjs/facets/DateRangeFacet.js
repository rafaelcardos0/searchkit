"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const isUndefined_1 = __importDefault(require("lodash/isUndefined"));
class DateRangeFacet {
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
        if (!isUndefined_1.default(filters[0].dateMin))
            rangeFilter.gte = filters[0].dateMin;
        if (!isUndefined_1.default(filters[0].dateMax))
            rangeFilter.lte = filters[0].dateMax;
        return { range: { [this.config.field]: rangeFilter } };
    }
    getAggregation() {
        return {};
    }
    getSelectedFilter(filterSet) {
        return {
            type: 'DateRangeSelectedFilter',
            id: `${this.getIdentifier()}_${filterSet.dateMin}_${filterSet.dateMax}`,
            identifier: this.getIdentifier(),
            label: this.getLabel(),
            dateMin: filterSet.dateMin,
            dateMax: filterSet.dateMax,
            display: this.config.display || 'DateRangeFacet'
        };
    }
    transformResponse() {
        return {
            identifier: this.getIdentifier(),
            label: this.getLabel(),
            type: 'DateRangeFacet',
            display: this.config.display || 'DateRangeFacet',
            entries: null
        };
    }
}
exports.default = DateRangeFacet;
