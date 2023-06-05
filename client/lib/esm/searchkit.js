import React, { createContext, useContext, useEffect, useState } from 'react';
import isEqual from 'fast-deep-equal';
import isUndefined from 'lodash/isUndefined';
const filterSelector = (filter) => (f) => {
    if (filter.identifier !== f.identifier)
        return false;
    if (!isUndefined(filter.min) &&
        !isUndefined(filter.max) &&
        filter.min === f.min &&
        filter.max === f.max)
        return true;
    if (!isUndefined(filter.dateMin) &&
        !isUndefined(filter.dateMax) &&
        filter.dateMin === f.dateMin &&
        filter.dateMax === f.dateMax)
        return true;
    if (filter.value && filter.level && filter.level === f.level && f.value === filter.value)
        return true;
    if (filter.value && filter.value === f.value)
        return true;
    return false;
};
export const searchStateEqual = (a, b) => isEqual(a, b);
class SearchkitClientState {
    getSearchState() {
        return this.searchState;
    }
    setQuery(query) {
        this.setSearchState((searchState) => (Object.assign(Object.assign({}, searchState), { query, filters: [], page: { from: 0, size: searchState.page.size } })));
    }
    resetPage() {
        this.setSearchState((searchState) => (Object.assign(Object.assign({}, searchState), { page: {
                from: 0,
                size: searchState.page.size
            } })));
    }
    resetFilters() {
        this.setSearchState((searchState) => (Object.assign(Object.assign({}, searchState), { filters: [] })));
    }
    getQuery() {
        return this.searchState.query;
    }
    setPage(page) {
        this.setSearchState((prevState) => (Object.assign(Object.assign({}, prevState), { page })));
    }
    getFilters() {
        return this.searchState.filters;
    }
    canResetSearch() {
        return !(this.searchState.filters.length === 0 && !this.searchState.query);
    }
    isFilterSelected(filter) {
        const foundFilter = this.searchState.filters.find(filterSelector(filter));
        return !!foundFilter;
    }
    getFiltersByIdentifier(identifier) {
        const filters = this.searchState.filters.filter((filter) => identifier === filter.identifier);
        return filters.length > 0 ? filters : [];
    }
    removeFilter(filter) {
        this.setSearchState((prevState) => {
            const filters = prevState.filters.reduce((filters, f) => {
                if (filterSelector(filter)(f)) {
                    return [...filters];
                }
                return [...filters, Object.assign({}, f)];
            }, []);
            return Object.assign(Object.assign({}, prevState), { filters });
        });
    }
    removeFiltersByIdentifier(identifier) {
        this.setSearchState((prevState) => {
            const filters = prevState.filters.filter((f) => f.identifier !== identifier);
            return Object.assign(Object.assign({}, prevState), { filters });
        });
    }
    addFilter(filter) {
        this.setSearchState((prevState) => {
            const filters = [Object.assign({}, filter), ...prevState.filters];
            return Object.assign(Object.assign({}, prevState), { filters });
        });
    }
    toggleFilter(filter) {
        if (this.isFilterSelected(filter)) {
            this.removeFilter(filter);
        }
        else {
            this.addFilter(filter);
        }
    }
    setSortBy(sortBy) {
        this.setSearchState((prevState) => (Object.assign(Object.assign({}, prevState), { sortBy })));
    }
}
export function createSearchState(state) {
    const searchState = Object.assign({}, state);
    const setSearchState = (fn) => {
        Object.assign(searchState, fn(searchState));
    };
    const scs = new SearchkitClientState();
    scs.setSearchState = setSearchState;
    scs.searchState = searchState;
    return scs;
}
export class SearchkitClient extends SearchkitClientState {
    constructor({ itemsPerPage } = {}) {
        super();
        this.baseSearchState = {
            query: '',
            filters: [],
            page: {
                size: itemsPerPage || 10,
                from: 0
            },
            sortBy: ''
        };
        this.onSearch = null;
    }
    updateBaseSearchState(updates) {
        this.baseSearchState = Object.assign(Object.assign(Object.assign({}, this.baseSearchState), updates), { page: Object.assign(Object.assign({}, this.baseSearchState.page), updates.page) });
    }
    performSearch() {
        if (this.onSearch)
            this.onSearch(this.getSearchState());
    }
    setCallbackFn(callback) {
        this.onSearch = callback;
    }
    search() {
        this.performSearch();
    }
}
export const SearchkitContext = createContext({});
export const SearchkitVariablesContext = createContext({});
export const SearchkitRoutingOptionsContext = createContext(null);
export function SearchkitProvider({ client, children }) {
    const baseState = Object.assign({}, client.baseSearchState);
    [client.searchState, client.setSearchState] = useState(baseState);
    const [pendingSearch, setPendingSearch] = useState(false);
    const [searchVariables, setSearchVariables] = useState(baseState);
    client.setCallbackFn(() => {
        setPendingSearch(true);
    });
    useEffect(() => {
        if (pendingSearch) {
            setPendingSearch(false);
            setSearchVariables(client.searchState);
        }
    }, [pendingSearch]);
    return (React.createElement(SearchkitContext.Provider, { value: client },
        React.createElement(SearchkitVariablesContext.Provider, { value: searchVariables }, children)));
}
export function useSearchkitVariables() {
    const variables = useContext(SearchkitVariablesContext);
    return variables;
}
export function useSearchkit() {
    const sk = useContext(SearchkitContext);
    return sk;
}
export function useSearchkitRoutingOptions() {
    return useContext(SearchkitRoutingOptionsContext);
}
export function useSearchkitQueryValue() {
    const api = useSearchkit();
    const [query, setQuery] = useState(api.getQuery());
    useEffect(() => {
        setQuery(api.getQuery() || '');
    }, [api.searchState]);
    return [query, setQuery];
}
export function useSearchkitQuery(query) {
    console.error('useSearchkitQuery has now been removed. Use useSearchkitVariables hook + useQuery instead.');
}
