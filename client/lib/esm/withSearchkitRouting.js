var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useEffect } from 'react';
import isEqual from 'fast-deep-equal';
import qs from 'qs';
import history, { defaultParseURL, defaultCreateURL } from './history';
import { useSearchkitVariables, useSearchkit, searchStateEqual, SearchkitRoutingOptionsContext } from './searchkit';
const sanitiseRouteState = (routeState) => {
    const intKeys = ['size', 'from'];
    for (const key of intKeys) {
        if (routeState[key] !== undefined && typeof routeState[key] === 'string') {
            routeState[key] = parseInt(routeState[key]);
        }
    }
    return routeState;
};
export const routeStateEqual = (a, b) => isEqual(sanitiseRouteState(a), sanitiseRouteState(b));
export const stateToRouteFn = (searchState) => {
    var _a, _b;
    const routeState = {
        query: searchState.query,
        sort: searchState.sortBy,
        filters: searchState.filters,
        size: parseInt((_a = searchState.page) === null || _a === void 0 ? void 0 : _a.size),
        from: parseInt((_b = searchState.page) === null || _b === void 0 ? void 0 : _b.from)
    };
    return Object.keys(routeState).reduce((sum, key) => {
        if ((Array.isArray(routeState[key]) && routeState[key].length > 0) ||
            (!Array.isArray(routeState[key]) && !!routeState[key])) {
            sum[key] = routeState[key];
        }
        return sum;
    }, {});
};
export const routeToStateFn = (routeState) => ({
    query: routeState.query || '',
    sortBy: routeState.sort || '',
    filters: routeState.filters || [],
    page: {
        size: Number(routeState.size) || 10,
        from: Number(routeState.from) || 0
    }
});
export default function withSearchkitRouting(Page, { stateToRoute = stateToRouteFn, routeToState = routeToStateFn, createURL = defaultCreateURL, parseURL = defaultParseURL, router = null } = {}) {
    let routingInstance = router;
    const getRouting = () => {
        if (routingInstance)
            return routingInstance;
        if (typeof window === 'undefined') {
            return null;
        }
        routingInstance = history({ createURL, parseURL });
        return routingInstance;
    };
    const routingOptions = {
        stateToRoute,
        routeToState,
        createURL: (config) => createURL(Object.assign(Object.assign({}, config), { qsModule: qs })),
        parseURL: (config) => parseURL(Object.assign(Object.assign({}, config), { qsModule: qs }))
    };
    const withSearchkitRouting = (props) => {
        const searchkitVariables = useSearchkitVariables();
        const api = useSearchkit();
        useEffect(() => {
            var _a;
            const router = getRouting();
            if (router) {
                const routeState = stateToRoute(searchkitVariables);
                const currentRouteState = Object.assign({ size: (_a = api.baseSearchState.page) === null || _a === void 0 ? void 0 : _a.size }, router.read());
                if (!routeStateEqual(currentRouteState, routeState)) {
                    router.write(routeState, true);
                }
            }
        }, [searchkitVariables]);
        useEffect(() => {
            const router = getRouting();
            const routeToSearchFn = (routeState) => {
                const searchState = routeToState(routeState);
                if (!searchStateEqual(searchState, api.searchState)) {
                    api.setSearchState(searchState);
                    api.search();
                }
            };
            if (router) {
                router.onUpdate(routeToSearchFn);
            }
            const routeState = router.read();
            const searchState = routeToState(routeState);
            api.setSearchState(searchState);
            api.search();
            return function cleanup() {
                router.dispose();
            };
        }, []);
        return (React.createElement(SearchkitRoutingOptionsContext.Provider, { value: routingOptions },
            React.createElement(Page, Object.assign({}, props))));
    };
    withSearchkitRouting.getInitialProps = (pageCtx) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        let props;
        const ctx = 'Component' in pageCtx ? pageCtx.ctx : pageCtx;
        const searchkitClient = pageCtx.searchkitClient;
        if (Page.getInitialProps) {
            props = yield Page.getInitialProps(ctx);
        }
        const mockLocation = {
            hostname: (_a = ctx.req) === null || _a === void 0 ? void 0 : _a.headers.host,
            href: ctx.asPath,
            pathname: ctx.pathname,
            search: ctx.asPath.substring(ctx.pathname.length)
        };
        const searchState = routeToState(routingOptions.parseURL({ location: mockLocation }));
        searchkitClient.updateBaseSearchState(searchState);
        return Object.assign(Object.assign({}, props), { searchState });
    });
    return withSearchkitRouting;
}
