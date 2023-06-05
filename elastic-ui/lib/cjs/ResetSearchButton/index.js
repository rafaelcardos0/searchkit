"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetSearchButton = void 0;
const client_1 = require("@searchkit/client");
const eui_1 = require("@elastic/eui");
const react_1 = __importDefault(require("react"));
exports.ResetSearchButton = ({ loading }) => {
    const api = client_1.useSearchkit();
    return (react_1.default.createElement(eui_1.EuiButtonEmpty, { disabled: !api.canResetSearch(), isLoading: loading, onClick: () => {
            api.setQuery('');
            api.search();
        } }, "Reset Search"));
};
