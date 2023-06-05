"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSearchkitQuery = exports.useSearchkitQueryValue = exports.useSearchkitRoutingOptions = exports.useSearchkit = exports.useSearchkitVariables = exports.SearchkitProvider = exports.SearchkitRoutingOptionsContext = exports.SearchkitVariablesContext = exports.SearchkitContext = exports.SearchkitClient = exports.createSearchState = exports.searchStateEqual = void 0;
const react_1 = __importStar(require("react"));
const fast_deep_equal_1 = __importDefault(require("fast-deep-equal"));
const isUndefined_1 = __importDefault(require("lodash/isUndefined"));
const filterSelector = (filter) => (f) => {
    if (filter.identifier !== f.identifier)
        return false;
    if (!isUndefined_1.default(filter.min) &&
        !isUndefined_1.default(filter.max) &&
        filter.min === f.min &&
        filter.max === f.max)
        return true;
    if (!isUndefined_1.default(filter.dateMin) &&
        !isUndefined_1.default(filter.dateMax) &&
        filter.dateMin === f.dateMin &&
        filter.dateMax === f.dateMax)
        return true;
    if (filter.value && filter.level && filter.level === f.level && f.value === filter.value)
        return true;
    if (filter.value && filter.value === f.value)
        return true;
    return false;
};
const searchStateEqual = (a, b) => fast_deep_equal_1.default(a, b);
exports.searchStateEqual = searchStateEqual;
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
function createSearchState(state) {
    const searchState = Object.assign({}, state);
    const setSearchState = (fn) => {
        Object.assign(searchState, fn(searchState));
    };
    const scs = new SearchkitClientState();
    scs.setSearchState = setSearchState;
    scs.searchState = searchState;
    return scs;
}
exports.createSearchState = createSearchState;
class SearchkitClient extends SearchkitClientState {
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
exports.SearchkitClient = SearchkitClient;
exports.SearchkitContext = react_1.createContext({});
exports.SearchkitVariablesContext = react_1.createContext({});
exports.SearchkitRoutingOptionsContext = react_1.createContext(null);
function SearchkitProvider({ client, children }) {
    const baseState = Object.assign({}, client.baseSearchState);
    [client.searchState, client.setSearchState] = react_1.useState(baseState);
    const [pendingSearch, setPendingSearch] = react_1.useState(false);
    const [searchVariables, setSearchVariables] = react_1.useState(baseState);
    client.setCallbackFn(() => {
        setPendingSearch(true);
    });
    react_1.useEffect(() => {
        if (pendingSearch) {
            setPendingSearch(false);
            setSearchVariables(client.searchState);
        }
    }, [pendingSearch]);
    return (react_1.default.createElement(exports.SearchkitContext.Provider, { value: client },
        react_1.default.createElement(exports.SearchkitVariablesContext.Provider, { value: searchVariables }, children)));
}
exports.SearchkitProvider = SearchkitProvider;
function useSearchkitVariables() {
    const variables = react_1.useContext(exports.SearchkitVariablesContext);
    return variables;
}
exports.useSearchkitVariables = useSearchkitVariables;
function useSearchkit() {
    const sk = react_1.useContext(exports.SearchkitContext);
    return sk;
}
exports.useSearchkit = useSearchkit;
function useSearchkitRoutingOptions() {
    return react_1.useContext(exports.SearchkitRoutingOptionsContext);
}
exports.useSearchkitRoutingOptions = useSearchkitRoutingOptions;
function useSearchkitQueryValue() {
    const api = useSearchkit();
    const [query, setQuery] = react_1.useState(api.getQuery());
    react_1.useEffect(() => {
        setQuery(api.getQuery() || '');
    }, [api.searchState]);
    return [query, setQuery];
}
exports.useSearchkitQueryValue = useSearchkitQueryValue;
function useSearchkitQuery(query) {
    console.error('useSearchkitQuery has now been removed. Use useSearchkitVariables hook + useQuery instead.');
}
exports.useSearchkitQuery = useSearchkitQuery;
