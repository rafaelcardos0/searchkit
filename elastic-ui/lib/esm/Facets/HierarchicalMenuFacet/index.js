import React, { Fragment, useRef } from 'react';
import { EuiFacetGroup, EuiTitle, EuiFacetButton } from '@elastic/eui';
import { useSearchkit, FilterLink } from 'searchkit/client';
const EntriesList = ({ entries, loading, facet }) => {
    const api = useSearchkit();
    const entriesElements = entries.map((entry) => {
        const ref = useRef();
        return (React.createElement(Fragment, { key: entry.label },
            React.createElement(EuiFacetButton, { style: { height: '28px', marginTop: 0, marginBottom: 0 }, quantity: entry.count, isSelected: api.isFilterSelected({
                    identifier: facet.identifier,
                    value: entry.label,
                    level: entry.level
                }), isLoading: loading, onClick: (e) => {
                    ref.current.onClick(e);
                } },
                React.createElement(FilterLink, { ref: ref, filter: { identifier: facet.identifier, value: entry.label, level: entry.level } }, entry.label)),
            React.createElement("div", { style: { marginLeft: '10px' } }, entry.entries && React.createElement(EntriesList, { entries: entry.entries, loading: loading, facet: facet }))));
    });
    return React.createElement(EuiFacetGroup, null, entriesElements);
};
export const HierarchicalMenuFacet = ({ facet, loading }) => (React.createElement(React.Fragment, null,
    React.createElement(EuiTitle, { size: "xxs" },
        React.createElement("h3", null, facet.label)),
    React.createElement(EntriesList, { entries: facet.entries, facet: facet, loading: loading })));
HierarchicalMenuFacet.DISPLAY = 'HierarchicalMenuFacet';
