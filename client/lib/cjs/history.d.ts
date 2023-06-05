import qs from 'qs';
export declare type RouteState = {
    [stateKey: string]: any;
};
export declare type Router = {
    onUpdate(callback: (route: RouteState) => void): void;
    read(): RouteState;
    write(route: RouteState, shouldPushToHistory: boolean): void;
    createURL(state: RouteState): string;
    dispose(): void;
};
declare type CreateURL = ({ qsModule, routeState, location }: {
    qsModule: typeof qs;
    routeState: RouteState;
    location: Location;
}) => string;
declare type ParseURL = ({ qsModule, location }: {
    qsModule: typeof qs;
    location: Location;
}) => RouteState;
declare type BrowserHistoryArgs = {
    writeDelay?: number;
    createURL?: CreateURL;
    parseURL?: ParseURL;
};
export declare const defaultCreateURL: CreateURL;
export declare const defaultParseURL: ParseURL;
declare class BrowserHistory implements Router {
    private readonly writeDelay;
    private readonly _createURL;
    private readonly _parseURL;
    private writeTimer?;
    private _onPopState;
    constructor({ writeDelay, createURL, parseURL }?: BrowserHistoryArgs);
    read(): RouteState;
    write(routeState: RouteState, shouldPushToHistory?: boolean): void;
    onUpdate(callback: (routeState: RouteState) => void): void;
    createURL(routeState: RouteState): string;
    dispose(): void;
}
export default function (props?: BrowserHistoryArgs): BrowserHistory;
export {};
