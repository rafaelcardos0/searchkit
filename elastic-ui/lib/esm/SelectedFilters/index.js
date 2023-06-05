import { FilterLink, useSearchkit } from '@searchkit/client';
import { EuiButton, EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import React, { useRef } from 'react';
const NumericRangeFilter = ({ filter, loading }) => {
    const api = useSearchkit();
    return (React.createElement(EuiFlexItem, { grow: false },
        React.createElement(EuiButton, { onClick: () => {
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
    const api = useSearchkit();
    return (React.createElement(EuiFlexItem, { grow: false },
        React.createElement(EuiButton, { onClick: () => {
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
    const ref = useRef();
    return (React.createElement(EuiFlexItem, { grow: false },
        React.createElement(EuiButton, { iconSide: "right", iconType: "cross", isLoading: loading, onClick: (e) => {
                ref.current.onClick(e);
            } },
            React.createElement(FilterLink, { ref: ref, filter: filter },
                React.createElement(React.Fragment, null,
                    filter.label,
                    ": ",
                    filter.value)))));
};
export const SelectedFilters = ({ loading, data, customFilterComponents = {} }) => {
    var _a;
    const filterComponentMap = Object.assign({ ListFacet: ValueFilter, RangeSliderFacet: NumericRangeFilter, DateRangeFacet: DateRangeFilter, ComboBoxFacet: ValueFilter, HierarchicalMenuFacet: ValueFilter }, customFilterComponents);
    return (React.createElement(EuiFlexGroup, { gutterSize: "s", alignItems: "center" }, (_a = data === null || data === void 0 ? void 0 : data.summary) === null || _a === void 0 ? void 0 : _a.appliedFilters.map((filter) => {
        const FilterComponent = filterComponentMap[filter.display] || ValueFilter;
        if (!filterComponentMap[filter.display])
            throw new Error(`could not display selected filters for ${filter.identifier} facet. Use customFilterComponents prop to pass a component to handle this filter for ${filter.display} display`);
        return React.createElement(FilterComponent, { filter: filter, loading: loading, key: filter.id });
    })));
};
