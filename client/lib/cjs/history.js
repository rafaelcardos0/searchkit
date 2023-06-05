"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultParseURL = exports.defaultCreateURL = void 0;
const qs_1 = __importDefault(require("qs"));
const defaultCreateURL = ({ qsModule, routeState, location }) => {
    if (location) {
        const { protocol, hostname, port = '', pathname, hash } = location;
        const queryString = qsModule.stringify(routeState);
        const portWithPrefix = port === '' ? '' : `:${port}`;
        // IE <= 11 has no proper `location.origin` so we cannot rely on it.
        if (!queryString) {
            return `${protocol}//${hostname}${portWithPrefix}${pathname}${hash}`;
        }
        return `${protocol}//${hostname}${portWithPrefix}${pathname}?${queryString}${hash}`;
    }
    return `?${qsModule.stringify(routeState)}`;
};
exports.defaultCreateURL = defaultCreateURL;
const defaultParseURL = ({ qsModule, location }) => qsModule.parse(location.search.slice(1), { arrayLimit: 99 });
exports.defaultParseURL = defaultParseURL;
class BrowserHistory {
    constructor({ writeDelay = 400, createURL = exports.defaultCreateURL, parseURL = exports.defaultParseURL } = {}) {
        this.writeTimer = undefined;
        this.writeDelay = writeDelay;
        this._createURL = createURL;
        this._parseURL = parseURL;
    }
    read() {
        return this._parseURL({ qsModule: qs_1.default, location: window.location });
    }
    write(routeState, shouldPushToHistory = true) {
        const url = this.createURL(routeState);
        if (this.writeTimer) {
            window.clearTimeout(this.writeTimer);
        }
        this.writeTimer = window.setTimeout(() => {
            if (shouldPushToHistory) {
                window.history.pushState(routeState, null, url);
            }
            this.writeTimer = undefined;
        }, this.writeDelay);
    }
    onUpdate(callback) {
        this._onPopState = (event) => {
            if (this.writeTimer) {
                window.clearTimeout(this.writeTimer);
                this.writeTimer = undefined;
            }
            const routeState = event.state;
            if (!routeState) {
                callback(this.read());
            }
            else {
                callback(routeState);
            }
        };
        window.addEventListener('popstate', this._onPopState);
    }
    createURL(routeState) {
        return this._createURL({
            qsModule: qs_1.default,
            routeState,
            location: window.location
        });
    }
    dispose() {
        if (this._onPopState) {
            window.removeEventListener('popstate', this._onPopState);
        }
        if (this.writeTimer) {
            window.clearTimeout(this.writeTimer);
        }
        this.write({}, false);
    }
}
function default_1(props) {
    return new BrowserHistory(props);
}
exports.default = default_1;
