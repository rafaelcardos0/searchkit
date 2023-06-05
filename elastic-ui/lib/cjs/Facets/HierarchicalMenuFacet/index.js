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
exports.HierarchicalMenuFacet = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
const client_1 = require("@searchkit/client");
const EntriesList = ({ entries, loading, facet }) => {
    const api = client_1.useSearchkit();
    const entriesElements = entries.map((entry) => {
        const ref = react_1.useRef();
        return (react_1.default.createElement(react_1.Fragment, { key: entry.label },
            react_1.default.createElement(eui_1.EuiFacetButton, { style: { height: '28px', marginTop: 0, marginBottom: 0 }, quantity: entry.count, isSelected: api.isFilterSelected({
                    identifier: facet.identifier,
                    value: entry.label,
                    level: entry.level
                }), isLoading: loading, onClick: (e) => {
                    ref.current.onClick(e);
                } },
                react_1.default.createElement(client_1.FilterLink, { ref: ref, filter: { identifier: facet.identifier, value: entry.label, level: entry.level } }, entry.label)),
            react_1.default.createElement("div", { style: { marginLeft: '10px' } }, entry.entries && react_1.default.createElement(EntriesList, { entries: entry.entries, loading: loading, facet: facet }))));
    });
    return react_1.default.createElement(eui_1.EuiFacetGroup, null, entriesElements);
};
exports.HierarchicalMenuFacet = ({ facet, loading }) => (react_1.default.createElement(react_1.default.Fragment, null,
    react_1.default.createElement(eui_1.EuiTitle, { size: "xxs" },
        react_1.default.createElement("h3", null, facet.label)),
    react_1.default.createElement(EntriesList, { entries: facet.entries, facet: facet, loading: loading })));
exports.HierarchicalMenuFacet.DISPLAY = 'HierarchicalMenuFacet';
