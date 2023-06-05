import { useSearchkit } from 'searchkit/client';
import { EuiSuperSelect } from '@elastic/eui';
import React, { useState, useEffect } from 'react';
export const SortingSelector = ({ data, loading }) => {
    var _a, _b;
    const api = useSearchkit();
    const [value, setValue] = useState('');
    useEffect(() => {
        if (data === null || data === void 0 ? void 0 : data.hits.sortedBy) {
            const selectedOptionId = data === null || data === void 0 ? void 0 : data.hits.sortedBy;
            setValue(selectedOptionId);
        }
    }, [data]);
    const options = ((_b = (_a = data === null || data === void 0 ? void 0 : data.summary) === null || _a === void 0 ? void 0 : _a.sortOptions) === null || _b === void 0 ? void 0 : _b.map((sortOption) => ({
        value: sortOption.id,
        inputDisplay: sortOption.label
    }))) || [];
    return (React.createElement(EuiSuperSelect, { options: options, valueOfSelected: value, isLoading: loading, onChange: (value) => {
            setValue(value);
            api.setSortBy(value);
            api.search();
        } }));
};
