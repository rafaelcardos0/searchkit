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
exports.routeToStateFn = exports.stateToRouteFn = exports.routeStateEqual = void 0;
const react_1 = __importStar(require("react"));
const fast_deep_equal_1 = __importDefault(require("fast-deep-equal"));
const qs_1 = __importDefault(require("qs"));
const history_1 = __importStar(require("./history"));
const searchkit_1 = require("./searchkit");
const sanitiseRouteState = (routeState) => {
    const intKeys = ['size', 'from'];
    for (const key of intKeys) {
        if (routeState[key] !== undefined && typeof routeState[key] === 'string') {
            routeState[key] = parseInt(routeState[key]);
        }
    }
    return routeState;
};
const routeStateEqual = (a, b) => fast_deep_equal_1.default(sanitiseRouteState(a), sanitiseRouteState(b));
exports.routeStateEqual = routeStateEqual;
const stateToRouteFn = (searchState) => {
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
exports.stateToRouteFn = stateToRouteFn;
const routeToStateFn = (routeState) => ({
    query: routeState.query || '',
    sortBy: routeState.sort || '',
    filters: routeState.filters || [],
    page: {
        size: Number(routeState.size) || 10,
        from: Number(routeState.from) || 0
    }
});
exports.routeToStateFn = routeToStateFn;
function withSearchkitRouting(Page, { stateToRoute = exports.stateToRouteFn, routeToState = exports.routeToStateFn, createURL = history_1.defaultCreateURL, parseURL = history_1.defaultParseURL, router = null } = {}) {
    let routingInstance = router;
    const getRouting = () => {
        if (routingInstance)
            return routingInstance;
        if (typeof window === 'undefined') {
            return null;
        }
        routingInstance = history_1.default({ createURL, parseURL });
        return routingInstance;
    };
    const routingOptions = {
        stateToRoute,
        routeToState,
        createURL: (config) => createURL(Object.assign(Object.assign({}, config), { qsModule: qs_1.default })),
        parseURL: (config) => parseURL(Object.assign(Object.assign({}, config), { qsModule: qs_1.default }))
    };
    const withSearchkitRouting = (props) => {
        const searchkitVariables = searchkit_1.useSearchkitVariables();
        const api = searchkit_1.useSearchkit();
        react_1.useEffect(() => {
            var _a;
            const router = getRouting();
            if (router) {
                const routeState = stateToRoute(searchkitVariables);
                const currentRouteState = Object.assign({ size: (_a = api.baseSearchState.page) === null || _a === void 0 ? void 0 : _a.size }, router.read());
                if (!exports.routeStateEqual(currentRouteState, routeState)) {
                    router.write(routeState, true);
                }
            }
        }, [searchkitVariables]);
        react_1.useEffect(() => {
            const router = getRouting();
            const routeToSearchFn = (routeState) => {
                const searchState = routeToState(routeState);
                if (!searchkit_1.searchStateEqual(searchState, api.searchState)) {
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
        return (react_1.default.createElement(searchkit_1.SearchkitRoutingOptionsContext.Provider, { value: routingOptions },
            react_1.default.createElement(Page, Object.assign({}, props))));
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
exports.default = withSearchkitRouting;
