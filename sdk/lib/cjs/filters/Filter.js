"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
class Filter {
    constructor(config) {
        this.config = config;
    }
    getIdentifier() {
        return this.config.identifier;
    }
    getLabel() {
        return this.config.label;
    }
    getFilters(filters) {
        return {
            bool: {
                filter: filters.map((filter) => {
                    if ('min' in filter || 'max' in filter) {
                        const rangeFilter = {};
                        if (!lodash_1.isUndefined(filter.min))
                            rangeFilter.gte = filter.min;
                        if (!lodash_1.isUndefined(filter.max))
                            rangeFilter.lte = filter.max;
                        return { range: { [this.config.field]: rangeFilter } };
                    }
                    if ('dateMin' in filter || 'dateMax' in filter) {
                        const rangeFilter = {};
                        if (!lodash_1.isUndefined(filter.dateMin))
                            rangeFilter.gte = filter.dateMin;
                        if (!lodash_1.isUndefined(filter.dateMax))
                            rangeFilter.lte = filter.dateMax;
                        return { range: { [this.config.field]: rangeFilter } };
                    }
                    if ('geoBoundingBox' in filter) {
                        return {
                            geo_bounding_box: {
                                [this.config.field]: lodash_1.omitBy({
                                    top_left: filter.geoBoundingBox.topLeft,
                                    bottom_right: filter.geoBoundingBox.bottomRight,
                                    bottom_left: filter.geoBoundingBox.bottomLeft,
                                    top_right: filter.geoBoundingBox.topRight
                                }, lodash_1.isNil)
                            }
                        };
                    }
                    return { term: { [this.config.field]: filter.value } };
                })
            }
        };
    }
    getSelectedFilter(filter) {
        if ('min' in filter || 'max' in filter) {
            return {
                identifier: this.getIdentifier(),
                id: `${this.getIdentifier()}_${filter.min}_${filter.max}`,
                label: this.getLabel(),
                display: this.config.display || 'RangeFilter',
                type: 'NumericRangeSelectedFilter',
                min: filter.min,
                max: filter.max
            };
        }
        if ('dateMin' in filter || 'dateMax' in filter) {
            return {
                identifier: this.getIdentifier(),
                id: `${this.getIdentifier()}_${filter.dateMin}_${filter.dateMax}`,
                label: this.getLabel(),
                display: this.config.display || 'RangeFilter',
                type: 'NumericRangeSelectedFilter',
                min: filter.dateMin,
                max: filter.dateMax
            };
        }
        if ('geoBoundingBox' in filter) {
            return {
                type: 'GeoBoundingBoxSelectedFilter',
                id: `${this.getIdentifier()}_${JSON.stringify(filter.geoBoundingBox)}`,
                identifier: this.getIdentifier(),
                label: this.getLabel(),
                topLeft: filter.geoBoundingBox.topLeft,
                bottomRight: filter.geoBoundingBox.bottomRight,
                display: this.config.display || 'GeoBoundingBoxFilter'
            };
        }
        if ('value' in filter) {
            return {
                type: 'ValueSelectedFilter',
                id: `${this.getIdentifier()}_${filter.value}`,
                identifier: this.getIdentifier(),
                label: this.config.label,
                value: filter.value,
                display: this.config.display || 'TermFilter'
            };
        }
    }
}
exports.default = Filter;
