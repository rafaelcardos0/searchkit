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
exports.DateRangeFacet = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
const client_1 = require("@searchkit/client");
exports.DateRangeFacet = ({ facet, loading }) => {
    const api = client_1.useSearchkit();
    const [startDate, setStartDate] = react_1.useState(null);
    const [endDate, setEndDate] = react_1.useState(null);
    const selectedOptions = api.getFiltersByIdentifier(facet.identifier);
    const selectedOption = selectedOptions && selectedOptions[0];
    react_1.useEffect(() => {
        if (startDate && endDate) {
            if (selectedOption) {
                api.removeFilter(selectedOption);
            }
            api.addFilter({
                identifier: facet.identifier,
                dateMin: startDate.toISOString(),
                dateMax: endDate.toISOString()
            });
            api.search();
        }
    }, [startDate, endDate]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(eui_1.EuiTitle, { size: "xxs" },
            react_1.default.createElement("h3", null, facet.label)),
        react_1.default.createElement(eui_1.EuiDatePickerRange, { startDateControl: react_1.default.createElement(eui_1.EuiDatePicker, { isLoading: loading, selected: startDate, onChange: setStartDate, startDate: startDate, value: selectedOption && selectedOption.dateMin, endDate: endDate, adjustDateOnChange: false, placeholder: "from", isInvalid: startDate > endDate, "aria-label": "Start date" }), endDateControl: react_1.default.createElement(eui_1.EuiDatePicker, { isLoading: loading, selected: endDate, onChange: setEndDate, startDate: startDate, value: selectedOption && selectedOption.dateMax, endDate: endDate, adjustDateOnChange: false, isInvalid: startDate > endDate, "aria-label": "End date", placeholder: "to" }) })));
};
exports.DateRangeFacet.DISPLAY = 'DateRangeFacet';
