import React, { forwardRef, useImperativeHandle } from 'react';
import { createSearchState, useSearchkit, useSearchkitRoutingOptions, useSearchkitVariables } from './searchkit';
function isModifiedEvent(event) {
    const { target } = event.currentTarget;
    return ((target && target !== '_self') ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey || // triggers resource download
        (event.nativeEvent && event.nativeEvent.which === 2));
}
export const FilterLink = forwardRef((props, ref) => {
    const { filter, resetPagination = true, children } = props;
    const api = useSearchkit();
    const variables = useSearchkitVariables();
    const routingOptions = useSearchkitRoutingOptions();
    let href;
    const filterAdded = api.isFilterSelected(filter);
    if (routingOptions) {
        const scs = createSearchState(variables);
        scs.toggleFilter(filter);
        if (resetPagination)
            scs.resetPage();
        if (filter.level) {
            const appliedFilters = scs.getFiltersByIdentifier(filter.identifier);
            const levelFilters = appliedFilters.filter((f) => f.level === filter.level || (!filterAdded && f.level > filter.level));
            if ((levelFilters === null || levelFilters === void 0 ? void 0 : levelFilters.length) > 0) {
                levelFilters.forEach((f) => scs.removeFilter(f));
            }
        }
        const nextRouteState = routingOptions.stateToRoute(scs.searchState);
        href = routingOptions.createURL({ routeState: nextRouteState });
    }
    const clickHandler = (e) => {
        const { nodeName } = e.currentTarget;
        if (nodeName === 'A' && isModifiedEvent(e)) {
            return;
        }
        e.preventDefault();
        api.toggleFilter(filter);
        if (resetPagination)
            api.resetPage();
        if (filter.level) {
            const appliedFilters = api.getFiltersByIdentifier(filter.identifier);
            const levelFilters = appliedFilters.filter((f) => f.level === filter.level || f.level > filter.level);
            if ((levelFilters === null || levelFilters === void 0 ? void 0 : levelFilters.length) > 0) {
                levelFilters.forEach((f) => api.removeFilter(f));
            }
        }
        api.search();
    };
    useImperativeHandle(ref, () => ({
        onClick: (e) => {
            clickHandler(e);
        }
    }));
    return (React.createElement("a", { href: href, onClick: !ref ? clickHandler : undefined }, children));
});
export function PaginationLink({ page, children }) {
    const api = useSearchkit();
    const variables = useSearchkitVariables();
    const routingOptions = useSearchkitRoutingOptions();
    const from = variables.page.size * (page - 1);
    let href;
    if (routingOptions) {
        const scs = createSearchState(variables);
        scs.setPage({
            from,
            size: variables.page.size
        });
        const nextRouteState = routingOptions.stateToRoute(scs.searchState);
        href = routingOptions.createURL({ routeState: nextRouteState });
    }
    const clickHandler = (e) => {
        const { nodeName } = e.currentTarget;
        if (nodeName === 'A' && isModifiedEvent(e)) {
            return;
        }
        e.preventDefault();
        api.setPage({
            from,
            size: variables.page.size
        });
        api.search();
    };
    return (React.createElement("a", { href: href, onClick: clickHandler }, children));
}
