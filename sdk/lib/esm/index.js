"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchkitRequest = void 0;
const QueryManager_1 = __importDefault(require("./core/QueryManager"));
const RequestBodyBuilder_1 = __importDefault(require("./core/RequestBodyBuilder"));
const facets_1 = require("./facets");
const transporters_1 = require("./transporters");
const FacetsFns_1 = require("./core/FacetsFns");
const transformers_1 = require("./transformers");
__exportStar(require("./query"), exports);
__exportStar(require("./facets"), exports);
__exportStar(require("./filters"), exports);
__exportStar(require("./transporters"), exports);
__exportStar(require("./suggestors"), exports);
const getFacets = (facets = [], queryManager, ctx) => facets.reduce((facetsList, facet) => {
    if (facet instanceof facets_1.VisibleWhenRuleSet) {
        return [...facetsList, ...facet.getActiveFacets(queryManager, ctx)];
    }
    return [...facetsList, facet];
}, []);
const createInstance = (config, transporter) => new SearchkitRequest(config, transporter);
function getSortOption(id, sortOptions) {
    const selectedSortOption = sortOptions.find((sortOption) => sortOption.id === id);
    if (!selectedSortOption) {
        throw new Error(`Sort Option: sorting option ${id} not found`);
    }
    return selectedSortOption;
}
class SearchkitRequest {
    constructor(config, transporter) {
        this.config = config;
        this.queryManager = new QueryManager_1.default();
        this.transporter = !transporter ? new transporters_1.FetchClientTransporter(config) : transporter;
        this.transformer = new transformers_1.ElasticSearchResponseTransformer();
        this.handleDefaults();
    }
    handleDefaults() {
        const defaultSortOptionId = this.config.sortOptions && this.config.sortOptions.find((option) => option.defaultOption);
        const defaultSortOption = defaultSortOptionId && getSortOption(defaultSortOptionId.id, this.config.sortOptions);
        this.queryManager.setSortBy(defaultSortOption);
    }
    query(query) {
        this.queryManager.setQuery(query);
        return this;
    }
    setFilters(filters) {
        this.queryManager.setFilters(filters);
        return this;
    }
    setQueryOptions(options) {
        this.queryManager.setQueryOptions(options);
        return this;
    }
    setSortBy(sortBy) {
        if (this.config.sortOptions && sortBy) {
            const sortOption = getSortOption(sortBy, this.config.sortOptions);
            this.queryManager.setSortBy(sortOption);
        }
        return this;
    }
    executeSuggestions(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const suggestions = yield Promise.all(this.config.suggestions.map((suggestor) => suggestor.getSuggestions(query, this.transporter)));
            return suggestions;
        });
    }
    execute(responseRequest, baseFilters = []) {
        return __awaiter(this, void 0, void 0, function* () {
            const partialQueries = [];
            const facets = getFacets(this.config.facets, this.queryManager, {});
            let filteredFacets = null;
            let overrides = {};
            if (!responseRequest.hits)
                responseRequest.hits = {};
            if (!responseRequest.hits.size)
                responseRequest.hits.size = 0;
            if (!responseRequest.hits.from)
                responseRequest.hits.from = 0;
            if (responseRequest.facets) {
                if (Array.isArray(responseRequest.facets)) {
                    const filteredFacetIdentifiers = responseRequest.facets.map((facet) => facet.identifier);
                    filteredFacets =
                        facets &&
                            facets.filter((facet) => filteredFacetIdentifiers.includes(facet.getIdentifier()));
                    overrides = responseRequest.facets.reduce((acc, facet) => (Object.assign(Object.assign({}, acc), { [facet.identifier]: {
                            query: facet.query,
                            size: facet.size
                        } })), {});
                }
                const aggs = FacetsFns_1.getAggregationsFromFacets(this.queryManager, overrides, filteredFacets || facets);
                partialQueries.push(aggs);
            }
            const chosenSortOption = this.queryManager.getSortBy();
            partialQueries.push({
                size: responseRequest.hits.size,
                from: responseRequest.hits.from,
                sort: chosenSortOption ? chosenSortOption.field : [{ _score: 'desc' }]
            });
            let skRequestBody = RequestBodyBuilder_1.default(this.queryManager, this.config, baseFilters, facets, partialQueries);
            if (this.config.postProcessRequest) {
                skRequestBody = this.config.postProcessRequest(skRequestBody);
            }
            const response = yield this.transporter.performRequest(skRequestBody);
            return this.transformer.transformResponse(response, filteredFacets || facets, this.queryManager, this.config, responseRequest);
        });
    }
}
exports.SearchkitRequest = SearchkitRequest;
exports.default = createInstance;
