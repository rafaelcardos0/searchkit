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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationLink = exports.FilterLink = void 0;
const react_1 = __importStar(require("react"));
const searchkit_1 = require("./searchkit");
function isModifiedEvent(event) {
    const { target } = event.currentTarget;
    return ((target && target !== '_self') ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey || // triggers resource download
        (event.nativeEvent && event.nativeEvent.which === 2));
}
exports.FilterLink = react_1.forwardRef((props, ref) => {
    const { filter, resetPagination = true, children } = props;
    const api = searchkit_1.useSearchkit();
    const variables = searchkit_1.useSearchkitVariables();
    const routingOptions = searchkit_1.useSearchkitRoutingOptions();
    let href;
    const filterAdded = api.isFilterSelected(filter);
    if (routingOptions) {
        const scs = searchkit_1.createSearchState(variables);
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
    react_1.useImperativeHandle(ref, () => ({
        onClick: (e) => {
            clickHandler(e);
        }
    }));
    return (react_1.default.createElement("a", { href: href, onClick: !ref ? clickHandler : undefined }, children));
});
function PaginationLink({ page, children }) {
    const api = searchkit_1.useSearchkit();
    const variables = searchkit_1.useSearchkitVariables();
    const routingOptions = searchkit_1.useSearchkitRoutingOptions();
    const from = variables.page.size * (page - 1);
    let href;
    if (routingOptions) {
        const scs = searchkit_1.createSearchState(variables);
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
    return (react_1.default.createElement("a", { href: href, onClick: clickHandler }, children));
}
exports.PaginationLink = PaginationLink;
