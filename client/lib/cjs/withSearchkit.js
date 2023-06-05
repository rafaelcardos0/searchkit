"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const searchkit_1 = require("./searchkit");
const defaultSearchkitClient = () => new searchkit_1.SearchkitClient();
exports.default = (Page, createSearchkitClient = defaultSearchkitClient) => {
    let _client = null;
    const getClient = () => {
        if (!_client) {
            _client = createSearchkitClient();
        }
        return _client;
    };
    const withSearchkit = (props) => {
        const client = getClient();
        if (props.searchState) {
            const searchState = props.searchState;
            client.updateBaseSearchState(searchState);
        }
        return (react_1.default.createElement(searchkit_1.SearchkitProvider, { client: getClient() },
            react_1.default.createElement(Page, Object.assign({}, props))));
    };
    withSearchkit.getInitialProps = (ctx) => {
        ctx.searchkitClient = getClient();
        if (Page.getInitialProps) {
            return Page.getInitialProps(ctx);
        }
        return {};
    };
    return withSearchkit;
};
