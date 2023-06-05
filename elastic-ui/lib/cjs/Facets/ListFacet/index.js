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
exports.ListFacet = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
const client_1 = require("@searchkit/client");
exports.ListFacet = ({ facet, loading }) => {
    const api = client_1.useSearchkit();
    const entries = facet.entries.map((entry) => {
        const ref = react_1.useRef();
        return (react_1.default.createElement(eui_1.EuiFacetButton, { style: { height: '28px', marginTop: 0, marginBottom: 0 }, key: entry.label, quantity: entry.count, isSelected: api.isFilterSelected({ identifier: facet.identifier, value: entry.label }), isLoading: loading, onClick: (e) => {
                ref.current.onClick(e);
            } },
            react_1.default.createElement(client_1.FilterLink, { ref: ref, filter: { identifier: facet.identifier, value: entry.label } }, entry.label)));
    });
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(eui_1.EuiTitle, { size: "xxs" },
            react_1.default.createElement("h3", null, facet.label)),
        react_1.default.createElement(eui_1.EuiFacetGroup, null, entries)));
};
exports.ListFacet.DISPLAY = 'ListFacet';
