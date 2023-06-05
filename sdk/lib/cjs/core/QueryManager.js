"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryManager {
    constructor() {
        this.filters = [];
        this.query = null;
    }
    setQuery(query) {
        this.query = query;
    }
    setQueryOptions(options) {
        this.queryOptions = options;
    }
    setFilters(filters) {
        this.filters = filters;
    }
    hasFilters() {
        return this.filters && this.filters.length > 0;
    }
    hasQuery() {
        return !!(this.query && this.query.length > 0);
    }
    getQuery() {
        return this.query;
    }
    getQueryOptions() {
        return this.queryOptions;
    }
    getFilters() {
        return this.hasFilters() ? this.filters : [];
    }
    getFiltersById(id) {
        if (!this.hasFilters())
            return null;
        const idFilters = this.filters.filter((filter) => filter.identifier === id);
        return idFilters.length > 0 ? idFilters : null;
    }
    setSortBy(sort) {
        this.sortBy = sort;
    }
    getSortBy() {
        return this.sortBy;
    }
}
exports.default = QueryManager;
