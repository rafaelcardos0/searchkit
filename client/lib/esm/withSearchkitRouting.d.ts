/// <reference types="react" />
import qs from 'qs';
import { RouteState } from './history';
export declare const routeStateEqual: (a: any, b: any) => boolean;
export declare const stateToRouteFn: (searchState: any) => {};
export declare const routeToStateFn: (routeState: any) => {
    query: any;
    sortBy: any;
    filters: any;
    page: {
        size: number;
        from: number;
    };
};
export default function withSearchkitRouting(Page: any, { stateToRoute, routeToState, createURL, parseURL, router }?: {
    stateToRoute?: (searchState: any) => {};
    routeToState?: (routeState: any) => {
        query: any;
        sortBy: any;
        filters: any;
        page: {
            size: number;
            from: number;
        };
    };
    createURL?: ({ qsModule, routeState, location }: {
        qsModule: typeof qs;
        routeState: RouteState;
        location: Location;
    }) => string;
    parseURL?: ({ qsModule, location }: {
        qsModule: typeof qs;
        location: Location;
    }) => RouteState;
    router?: any;
}): {
    (props: any): JSX.Element;
    getInitialProps(pageCtx: any): Promise<any>;
};
