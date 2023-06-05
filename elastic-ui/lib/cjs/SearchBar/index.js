"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchBar = void 0;
const client_1 = require("@searchkit/client");
const eui_1 = require("@elastic/eui");
const react_1 = __importDefault(require("react"));
exports.SearchBar = ({ loading }) => {
    const [query, setQuery] = client_1.useSearchkitQueryValue();
    const api = client_1.useSearchkit();
    return (react_1.default.createElement(eui_1.EuiFieldSearch, { placeholder: "Search", value: query, onChange: (e) => {
            setQuery(e.target.value);
        }, isLoading: loading, onSearch: (value) => {
            setQuery(value);
            api.setQuery(value);
            api.search();
        }, isClearable: true, "aria-label": "Search" }));
};
