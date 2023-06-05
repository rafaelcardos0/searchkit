"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacetsList = void 0;
const react_1 = __importDefault(require("react"));
const eui_1 = require("@elastic/eui");
const ComboBoxFacet_1 = require("../ComboBoxFacet");
const ListFacet_1 = require("../ListFacet");
const RangeSliderFacet_1 = require("../RangeSliderFacet");
const DateRangeFacet_1 = require("../DateRangeFacet");
const HierarchicalMenuFacet_1 = require("../HierarchicalMenuFacet");
exports.FacetsList = (components = []) => {
    const componentTypeMap = [
        ...components,
        ListFacet_1.ListFacet,
        ComboBoxFacet_1.ComboBoxFacet,
        RangeSliderFacet_1.RangeSliderFacet,
        DateRangeFacet_1.DateRangeFacet,
        HierarchicalMenuFacet_1.HierarchicalMenuFacet
    ].reduce((sum, component) => {
        sum[component.DISPLAY] = component;
        return sum;
    }, {});
    return ({ data, loading }) => (react_1.default.createElement(react_1.default.Fragment, null, data === null || data === void 0 ? void 0 : data.facets.map((facet) => {
        const Component = componentTypeMap[facet.display];
        if (!Component) {
            throw new Error(facet.display + ' not available');
        }
        return (react_1.default.createElement("div", { key: facet.identifier },
            react_1.default.createElement(Component, { facet: facet, loading: loading }),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "l" })));
    })));
};
