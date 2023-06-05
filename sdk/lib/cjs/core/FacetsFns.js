"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFacetsFromResponse = exports.getAggregationsFromFacets = exports.filterTransform = void 0;
const filterTransform = (queryManager, facets = []) => {
    const subFilters = facets.reduce((subFilters, facet) => {
        const facetSubFilter = queryManager.getFiltersById(facet.getIdentifier());
        if (facetSubFilter) {
            return [...subFilters, facet.getFilters(facetSubFilter)];
        }
        return subFilters;
    }, []);
    return subFilters.length ? { bool: { must: subFilters } } : null;
};
exports.filterTransform = filterTransform;
const getAggregationsFromFacets = (queryManager, overrides, facetsConfig) => {
    const aggBuckets = facetsConfig.reduce((buckets, facet) => {
        if (facet.excludeOwnFilters && queryManager.hasFilters()) {
            buckets.push({
                name: `facet_bucket_${facet.getIdentifier()}`,
                aggs: [facet],
                filters: facetsConfig.filter((f) => f !== facet)
            });
        }
        else {
            const combinedBucket = buckets.find(({ name }) => name === 'facet_bucket_all');
            combinedBucket.aggs.push(facet);
        }
        return buckets;
    }, [{ name: 'facet_bucket_all', aggs: [], filters: [...facetsConfig] }]);
    const aggs = aggBuckets.reduce((sum, bucket) => {
        const subAggs = bucket.aggs.reduce((subAggs, subAgg) => (Object.assign(Object.assign({}, subAggs), subAgg.getAggregation(overrides[subAgg.getIdentifier()], queryManager))), {});
        const filter = exports.filterTransform(queryManager, bucket.filters);
        return Object.assign(Object.assign({}, sum), { [bucket.name]: {
                aggs: subAggs,
                filter: filter || { bool: { must: [] } }
            } });
    }, {});
    return { aggs };
};
exports.getAggregationsFromFacets = getAggregationsFromFacets;
const getFacetsFromResponse = (facetsConfig, response, queryManager) => {
    const facetBucketKeys = Object.keys(response.aggregations).filter((aggKey) => aggKey.indexOf('facet_bucket_') !== -1);
    const collapsedFacetAggsMap = facetBucketKeys.reduce((facetAggsResponse, bucketKey) => {
        const facetBucket = response.aggregations[bucketKey];
        const subAggKeys = Object.keys(facetBucket).filter((key) => key !== 'meta' && key !== 'doc_count');
        return Object.assign(Object.assign({}, facetAggsResponse), subAggKeys.reduce((sum, key) => (Object.assign(Object.assign({}, sum), { [key]: facetBucket[key] })), {}));
    }, {});
    const facetResponse = facetsConfig
        .map((facet) => {
        const aggFacetResponse = collapsedFacetAggsMap[facet.getIdentifier()];
        if ('transformResponse' in facet) {
            return facet.transformResponse(aggFacetResponse, queryManager);
        }
        return null;
    })
        .filter((transformedFacet) => transformedFacet !== null);
    return facetResponse;
};
exports.getFacetsFromResponse = getFacetsFromResponse;
