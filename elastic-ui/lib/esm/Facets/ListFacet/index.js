import React, { useRef } from 'react';
import { EuiFacetGroup, EuiTitle, EuiFacetButton } from '@elastic/eui';
import { useSearchkit, FilterLink } from '@searchkit/client';
export const ListFacet = ({ facet, loading }) => {
    const api = useSearchkit();
    const entries = facet.entries.map((entry) => {
        const ref = useRef();
        return (React.createElement(EuiFacetButton, { style: { height: '28px', marginTop: 0, marginBottom: 0 }, key: entry.label, quantity: entry.count, isSelected: api.isFilterSelected({ identifier: facet.identifier, value: entry.label }), isLoading: loading, onClick: (e) => {
                ref.current.onClick(e);
            } },
            React.createElement(FilterLink, { ref: ref, filter: { identifier: facet.identifier, value: entry.label } }, entry.label)));
    });
    return (React.createElement(React.Fragment, null,
        React.createElement(EuiTitle, { size: "xxs" },
            React.createElement("h3", null, facet.label)),
        React.createElement(EuiFacetGroup, null, entries)));
};
ListFacet.DISPLAY = 'ListFacet';
