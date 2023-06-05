"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeESQueries = void 0;
const merge_1 = __importDefault(require("lodash/merge"));
const FacetsFns_1 = require("./FacetsFns");
const mergeESQueries = (queries) => merge_1.default({
    aggs: {}
}, ...queries);
exports.mergeESQueries = mergeESQueries;
function RequestBodyBuilder(queryManager, config, baseFilters, facets, partialQueries) {
    var _a, _b, _c;
    const queryFilter = queryManager.hasQuery() && config.query ? config.query.getFilter(queryManager) : null;
    const baseFiltersQuery = FacetsFns_1.filterTransform(queryManager, config.filters);
    const combinedBaseFilters = [].concat(baseFilters, ((_a = baseFiltersQuery === null || baseFiltersQuery === void 0 ? void 0 : baseFiltersQuery.bool) === null || _a === void 0 ? void 0 : _a.must) || []);
    const query = queryFilter || (combinedBaseFilters.length > 0 ? {} : null);
    if (combinedBaseFilters.length) {
        if (query.bool) {
            Object.assign(query.bool, {
                filter: ((_b = query.bool.filter) === null || _b === void 0 ? void 0 : _b.length)
                    ? [].concat(query.bool.filter, combinedBaseFilters)
                    : combinedBaseFilters
            });
        }
        else {
            Object.assign(query, { bool: { filter: combinedBaseFilters } });
        }
    }
    const postFilter = FacetsFns_1.filterTransform(queryManager, facets);
    let highlight;
    (_c = config.hits.highlightedFields) === null || _c === void 0 ? void 0 : _c.forEach((field) => {
        if (!highlight) {
            highlight = { fields: {} };
        }
        if (typeof field == 'string') {
            highlight.fields[field] = {};
        }
        else {
            highlight.fields[field.field] = field.config;
        }
    });
    let collapseConfig;
    if (config.collapse) {
        collapseConfig = {
            field: config.collapse.field,
            inner_hits: config.collapse.inner_hits
        };
    }
    const baseQuery = { size: 0 };
    const sourceFields = {
        _source: {
            includes: config.hits.fields
        }
    };
    return exports.mergeESQueries([
        baseQuery,
        sourceFields,
        query && { query },
        collapseConfig && { collapse: collapseConfig },
        postFilter && { post_filter: postFilter },
        highlight && { highlight },
        ...partialQueries
    ].filter(Boolean));
}
exports.default = RequestBodyBuilder;
