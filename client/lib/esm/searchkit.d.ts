import React from 'react';
export interface Filter {
    identifier: string;
    value?: string;
    min?: number;
    max?: number;
    dateMin?: string;
    dateMax?: string;
    level?: number;
}
export interface PageOptions {
    size: number;
    from: number;
}
interface SearchkitQueryVariables {
    query: string;
    filters: Array<Filter>;
    page: PageOptions;
    sortBy: string;
}
export interface SearchkitClientConfig {
    itemsPerPage?: number;
}
export declare const searchStateEqual: (a: SearchState, b: SearchState) => boolean;
export declare type SearchState = {
    query: string;
    filters: Filter[];
    sortBy: string;
    page: PageOptions;
};
declare class SearchkitClientState {
    searchState: SearchState;
    setSearchState: (searchState: SearchState | ((prevState: SearchState) => SearchState)) => void;
    getSearchState(): SearchState;
    setQuery(query: string): void;
    resetPage(): void;
    resetFilters(): void;
    getQuery(): string;
    setPage(page: PageOptions): void;
    getFilters(): Filter[];
    canResetSearch(): boolean;
    isFilterSelected(filter: Filter): boolean;
    getFiltersByIdentifier(identifier: string): Array<Filter> | null;
    removeFilter(filter: Filter): void;
    removeFiltersByIdentifier(identifier: string): void;
    addFilter(filter: Filter): void;
    toggleFilter(filter: Filter): void;
    setSortBy(sortBy: string): void;
}
export declare function createSearchState(state: SearchState): SearchkitClientState;
export declare class SearchkitClient extends SearchkitClientState {
    private onSearch;
    baseSearchState: SearchState;
    constructor({ itemsPerPage }?: SearchkitClientConfig);
    updateBaseSearchState(updates: Partial<SearchState>): void;
    private performSearch;
    setCallbackFn(callback: (variables: SearchkitQueryVariables) => void): void;
    search(): void;
}
export declare const SearchkitContext: React.Context<{}>;
export declare const SearchkitVariablesContext: React.Context<{}>;
export declare const SearchkitRoutingOptionsContext: React.Context<any>;
export declare function SearchkitProvider({ client, children }: {
    client: SearchkitClient;
    children: React.ReactElement;
}): JSX.Element;
export declare function useSearchkitVariables(): SearchState;
export declare function useSearchkit(): SearchkitClient;
interface SearchkitRoutingOptions {
    routeToState: any;
    stateToRoute: any;
    createURL: any;
    parseURL: any;
}
export declare function useSearchkitRoutingOptions(): SearchkitRoutingOptions | null;
export declare function useSearchkitQueryValue(): [string, (a: string) => void];
export declare function useSearchkitQuery(query: any): void;
export {};
