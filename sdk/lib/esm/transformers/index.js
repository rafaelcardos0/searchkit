"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElasticSearchResponseTransformer = void 0;
const FacetsFns_1 = require("../core/FacetsFns");
function isSelectedDisabledFilter(filter) {
    return filter.disabled;
}
function getSummaryFromResponse(responseBody, facets, queryManager, config) {
    const combinedFilters = [...(facets || []), ...(config.filters || [])];
    const filters = queryManager.getFilters().map((filterSet) => {
        const facetConfig = combinedFilters.find((facet) => facet.getIdentifier() === filterSet.identifier);
        if (!facetConfig) {
            return {
                identifier: filterSet.identifier,
                disabled: true
            };
        }
        return facetConfig.getSelectedFilter(filterSet);
    });
    const { appliedFilters, disabledFilters } = filters.reduce((sum, filter) => {
        if (isSelectedDisabledFilter(filter)) {
            sum.disabledFilters.push(filter);
        }
        else {
            sum.appliedFilters.push(filter);
        }
        return sum;
    }, { appliedFilters: [], disabledFilters: [] });
    return {
        total: typeof responseBody.hits.total.value === 'number'
            ? responseBody.hits.total.value
            : responseBody.hits.total,
        query: queryManager.getQuery() || '',
        sortOptions: (config.sortOptions || []).map((sortOption) => ({
            id: sortOption.id,
            label: sortOption.label
        })),
        appliedFilters: appliedFilters,
        disabledFilters: disabledFilters
    };
}
const getInnerHits = (hit, includeRawHit) => Object.keys(hit.inner_hits).reduce((sum, innerHitKey) => {
    const innerHitGroup = hit.inner_hits[innerHitKey];
    const innerGroup = {
        items: innerHitGroup.hits.hits.map((hit) => (Object.assign({ id: hit._id, fields: hit._source, highlight: hit.highlight || {} }, (includeRawHit ? { rawHit: hit } : {})))),
        total: getHitsTotal(innerHitGroup.hits)
    };
    return Object.assign(Object.assign({}, sum), { [innerHitKey]: innerGroup });
}, {});
// to support 6.x - 8.x
const getHitsTotal = (hits) => {
    // @ts-ignore
    const isNumber = typeof hits.total.value === 'number';
    // @ts-ignore
    return isNumber ? hits.total.value : hits.total;
};
class ElasticSearchResponseTransformer {
    transformResponse(responseBody, facetsConfig, queryManager, config, responseRequest) {
        const { hits } = responseBody;
        const facets = responseRequest.facets
            ? FacetsFns_1.getFacetsFromResponse(facetsConfig, responseBody, queryManager)
            : null;
        const summary = getSummaryFromResponse(responseBody, facetsConfig, queryManager, config);
        const hitsTotal = getHitsTotal(hits);
        const size = responseRequest.hits.size;
        const from = responseRequest.hits.from;
        const chosenSortOption = queryManager.getSortBy();
        return {
            summary,
            facets,
            hits: {
                items: hits.hits.map((hit) => (Object.assign(Object.assign({ id: hit._id, fields: hit._source, highlight: hit.highlight || {} }, ((config.collapse && {
                    innerHits: getInnerHits(hit, responseRequest.hits.includeRawHit)
                }) ||
                    {})), (responseRequest.hits.includeRawHit ? { rawHit: hit } : {})))),
                page: {
                    total: hitsTotal,
                    totalPages: Math.ceil(hitsTotal / size),
                    pageNumber: from / size,
                    from: from,
                    size: size
                }
            },
            sortedBy: chosenSortOption === null || chosenSortOption === void 0 ? void 0 : chosenSortOption.id
        };
    }
}
exports.ElasticSearchResponseTransformer = ElasticSearchResponseTransformer;
