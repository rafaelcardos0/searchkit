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
exports.SelectedFilters = void 0;
const client_1 = require("searchkit/client");
const eui_1 = require("@elastic/eui");
const react_1 = __importStar(require("react"));
const NumericRangeFilter = ({ filter, loading }) => {
    const api = client_1.useSearchkit();
    return (react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
        react_1.default.createElement(eui_1.EuiButton, { onClick: () => {
                api.removeFilter(filter);
                api.search();
            }, iconSide: "right", iconType: "cross", isLoading: loading },
            filter.label,
            ": ",
            filter.min,
            " - ",
            filter.max)));
};
const DateRangeFilter = ({ filter, loading }) => {
    const api = client_1.useSearchkit();
    return (react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
        react_1.default.createElement(eui_1.EuiButton, { onClick: () => {
                api.removeFilter(filter);
                api.search();
            }, iconSide: "right", iconType: "cross", isLoading: loading },
            filter.label,
            ": ",
            new Date(filter.dateMin).toDateString(),
            " -",
            ' ',
            new Date(filter.dateMax).toDateString())));
};
const ValueFilter = ({ filter, loading }) => {
    const ref = react_1.useRef();
    return (react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
        react_1.default.createElement(eui_1.EuiButton, { iconSide: "right", iconType: "cross", isLoading: loading, onClick: (e) => {
                ref.current.onClick(e);
            } },
            react_1.default.createElement(client_1.FilterLink, { ref: ref, filter: filter },
                react_1.default.createElement(react_1.default.Fragment, null,
                    filter.label,
                    ": ",
                    filter.value)))));
};
exports.SelectedFilters = ({ loading, data, customFilterComponents = {} }) => {
    var _a;
    const filterComponentMap = Object.assign({ ListFacet: ValueFilter, RangeSliderFacet: NumericRangeFilter, DateRangeFacet: DateRangeFilter, ComboBoxFacet: ValueFilter, HierarchicalMenuFacet: ValueFilter }, customFilterComponents);
    return (react_1.default.createElement(eui_1.EuiFlexGroup, { gutterSize: "s", alignItems: "center" }, (_a = data === null || data === void 0 ? void 0 : data.summary) === null || _a === void 0 ? void 0 : _a.appliedFilters.map((filter) => {
        const FilterComponent = filterComponentMap[filter.display] || ValueFilter;
        if (!filterComponentMap[filter.display])
            throw new Error(`could not display selected filters for ${filter.identifier} facet. Use customFilterComponents prop to pass a component to handle this filter for ${filter.display} display`);
        return react_1.default.createElement(FilterComponent, { filter: filter, loading: loading, key: filter.id });
    })));
};
