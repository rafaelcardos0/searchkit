import React from 'react';
import { EuiSpacer } from '@elastic/eui';
import { ComboBoxFacet } from '../ComboBoxFacet';
import { ListFacet } from '../ListFacet';
import { RangeSliderFacet } from '../RangeSliderFacet';
import { DateRangeFacet } from '../DateRangeFacet';
import { HierarchicalMenuFacet } from '../HierarchicalMenuFacet';
export const FacetsList = (components = []) => {
    const componentTypeMap = [
        ...components,
        ListFacet,
        ComboBoxFacet,
        RangeSliderFacet,
        DateRangeFacet,
        HierarchicalMenuFacet
    ].reduce((sum, component) => {
        sum[component.DISPLAY] = component;
        return sum;
    }, {});
    return ({ data, loading }) => (React.createElement(React.Fragment, null, data === null || data === void 0 ? void 0 : data.facets.map((facet) => {
        const Component = componentTypeMap[facet.display];
        if (!Component) {
            throw new Error(facet.display + ' not available');
        }
        return (React.createElement("div", { key: facet.identifier },
            React.createElement(Component, { facet: facet, loading: loading }),
            React.createElement(EuiSpacer, { size: "l" })));
    })));
};
