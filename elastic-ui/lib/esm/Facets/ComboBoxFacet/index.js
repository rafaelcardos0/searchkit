var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useState, useEffect } from 'react';
import { EuiComboBox } from '@elastic/eui';
import { useSearchkit } from 'searchkit/client';
import { gql, useApolloClient } from '@apollo/client';
const facetRefinementSearchQuery = gql `
  query refinementFacet(
    $facetQuery: String
    $query: String
    $filters: [SKFiltersSet]
    $facetId: String!
  ) {
    results(query: $query, filters: $filters) {
      facet(identifier: $facetId, query: $facetQuery) {
        identifier
        label
        entries {
          label
          count
        }
      }
    }
  }
`;
export const ComboBoxFacet = ({ facet }) => {
    const api = useSearchkit();
    const client = useApolloClient();
    const [data, setData] = useState(() => facet.entries.map((entry) => ({ label: entry.label })));
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState(() => api.getFiltersByIdentifier(facet.identifier).map((filter) => ({ label: filter.value })));
    const onSearchChange = (searchValue) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        const result = yield client.query({
            query: facetRefinementSearchQuery,
            variables: {
                facetId: facet.identifier,
                query: api.getQuery(),
                filters: api.getFilters(),
                facetQuery: searchValue
            }
        });
        const options = result.data.results.facet.entries.map((entry) => ({ label: entry.label }));
        setData(options);
        setLoading(false);
    });
    useEffect(() => {
        const apiFilters = api.getFiltersByIdentifier(facet.identifier);
        if (apiFilters.length != filters.length) {
            api.removeFiltersByIdentifier(facet.identifier);
            filters.forEach((f) => {
                api.addFilter({ identifier: facet.identifier, value: f.label });
            });
            api.search();
        }
    }, [filters]);
    return (React.createElement(EuiComboBox, { placeholder: `Search ${facet.label}`, async: true, options: data, selectedOptions: filters, onSearchChange: onSearchChange, isLoading: loading, onChange: (filters) => {
            setFilters(filters);
        } }));
};
ComboBoxFacet.DISPLAY = 'ComboBoxFacet';
