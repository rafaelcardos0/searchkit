"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GeoDistanceOptionsFacet {
    constructor(config) {
        this.config = config;
        this.excludeOwnFilters = false;
        this.excludeOwnFilters = config.multipleSelect;
        this.unit = config.unit || 'mi';
    }
    getLabel() {
        return this.config.label;
    }
    getIdentifier() {
        return this.config.identifier;
    }
    getFilters(filterValues) {
        const condition = this.excludeOwnFilters ? 'should' : 'must';
        const filters = filterValues.map(({ value }) => {
            const range = this.config.ranges.find((option) => option.label === value);
            return range;
        });
        return {
            bool: {
                [condition]: filters.map((range) => ({
                    bool: Object.assign(Object.assign({}, (range.from
                        ? {
                            must_not: [
                                {
                                    geo_distance: {
                                        distance: range.from + this.config.unit,
                                        [this.config.field]: this.config.origin
                                    }
                                }
                            ]
                        }
                        : {})), (range.to
                        ? {
                            must: [
                                {
                                    geo_distance: {
                                        distance: range.to + this.config.unit,
                                        [this.config.field]: this.config.origin
                                    }
                                }
                            ]
                        }
                        : {}))
                }))
            }
        };
    }
    getAggregation() {
        return {
            [this.getIdentifier()]: {
                geo_distance: {
                    field: this.config.field,
                    origin: this.config.origin,
                    unit: this.unit,
                    keyed: true,
                    ranges: this.config.ranges.map((range) => ({
                        from: range.from,
                        to: range.to,
                        key: range.label
                    }))
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
            type: 'GeoDistanceOptionsFacet',
            value: filterSet.value
        };
    }
    transformResponse(response) {
        return {
            identifier: this.getIdentifier(),
            label: this.getLabel(),
            display: this.config.display || 'ListFacet',
            type: 'GeoDistanceOptionsFacet',
            entries: this.config.ranges.map((option) => {
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
exports.default = GeoDistanceOptionsFacet;
