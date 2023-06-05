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
exports.RangeSliderFacet = exports.getLevels = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
const client_1 = require("@searchkit/client");
const use_debounce_1 = require("use-debounce");
exports.getLevels = (entries) => entries.reduce((levels, entry, index, entries) => {
    const lastLevel = levels[levels.length - 1];
    const isLast = entries.length === index + 1;
    if (!lastLevel || lastLevel.max) {
        levels.push({
            min: lastLevel ? lastLevel.max : parseFloat(entry.label),
            hasResults: entry.count === 0 ? false : true
        });
    }
    else if (lastLevel &&
        !lastLevel.max &&
        ((entry.count > 0 && !lastLevel.hasResults) ||
            (entry.count === 0 && lastLevel.hasResults) ||
            (isLast && !lastLevel.max))) {
        lastLevel.max = parseFloat(entry.label);
        if (!isLast) {
            levels.push({
                min: parseFloat(entry.label),
                hasResults: entry.count === 0 ? false : true
            });
        }
    }
    return levels;
}, []);
exports.RangeSliderFacet = ({ facet }) => {
    const api = client_1.useSearchkit();
    const levels = exports.getLevels(facet.entries);
    const minBoundary = levels[0].min;
    const maxBoundary = levels[levels.length - 1].max;
    const [dualValue, setDualValue] = react_1.useState([minBoundary, maxBoundary]);
    const selectedOptions = api.getFiltersByIdentifier(facet.identifier);
    const selectedOption = selectedOptions && selectedOptions[0];
    const debouncedCallback = use_debounce_1.useDebouncedCallback((value) => {
        api.removeFiltersByIdentifier(facet.identifier);
        api.addFilter({ identifier: facet.identifier, min: value[0], max: value[1] });
        api.search();
    }, 400);
    react_1.useEffect(() => {
        if (selectedOption) {
            setDualValue([selectedOptions[0].min, selectedOptions[0].max]);
        }
    }, [selectedOption]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(eui_1.EuiTitle, { size: "xxs" },
            react_1.default.createElement("h3", null, facet.label)),
        react_1.default.createElement(eui_1.EuiDualRange, { id: facet.identifier, value: dualValue, min: minBoundary, max: maxBoundary, onChange: (value) => {
                setDualValue(value);
                debouncedCallback.callback(value);
            }, levels: levels.map((level) => ({
                min: level.min,
                max: level.max,
                color: level.hasResults ? 'primary' : 'warning'
            })) })));
};
exports.RangeSliderFacet.DISPLAY = 'RangeSliderFacet';
