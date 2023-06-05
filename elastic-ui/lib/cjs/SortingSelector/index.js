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
exports.SortingSelector = void 0;
const client_1 = require("@searchkit/client");
const eui_1 = require("@elastic/eui");
const react_1 = __importStar(require("react"));
exports.SortingSelector = ({ data, loading }) => {
    var _a, _b;
    const api = client_1.useSearchkit();
    const [value, setValue] = react_1.useState('');
    react_1.useEffect(() => {
        if (data === null || data === void 0 ? void 0 : data.hits.sortedBy) {
            const selectedOptionId = data === null || data === void 0 ? void 0 : data.hits.sortedBy;
            setValue(selectedOptionId);
        }
    }, [data]);
    const options = ((_b = (_a = data === null || data === void 0 ? void 0 : data.summary) === null || _a === void 0 ? void 0 : _a.sortOptions) === null || _b === void 0 ? void 0 : _b.map((sortOption) => ({
        value: sortOption.id,
        inputDisplay: sortOption.label
    }))) || [];
    return (react_1.default.createElement(eui_1.EuiSuperSelect, { options: options, valueOfSelected: value, isLoading: loading, onChange: (value) => {
            setValue(value);
            api.setSortBy(value);
            api.search();
        } }));
};
