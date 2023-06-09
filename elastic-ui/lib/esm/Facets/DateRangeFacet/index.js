import React, { useState, useEffect } from 'react';
import { EuiTitle, EuiDatePickerRange, EuiDatePicker } from '@elastic/eui';
import { useSearchkit } from 'searchkit/client';
export const DateRangeFacet = ({ facet, loading }) => {
    const api = useSearchkit();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const selectedOptions = api.getFiltersByIdentifier(facet.identifier);
    const selectedOption = selectedOptions && selectedOptions[0];
    useEffect(() => {
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
    return (React.createElement(React.Fragment, null,
        React.createElement(EuiTitle, { size: "xxs" },
            React.createElement("h3", null, facet.label)),
        React.createElement(EuiDatePickerRange, { startDateControl: React.createElement(EuiDatePicker, { isLoading: loading, selected: startDate, onChange: setStartDate, startDate: startDate, value: selectedOption && selectedOption.dateMin, endDate: endDate, adjustDateOnChange: false, placeholder: "from", isInvalid: startDate > endDate, "aria-label": "Start date" }), endDateControl: React.createElement(EuiDatePicker, { isLoading: loading, selected: endDate, onChange: setEndDate, startDate: startDate, value: selectedOption && selectedOption.dateMax, endDate: endDate, adjustDateOnChange: false, isInvalid: startDate > endDate, "aria-label": "End date", placeholder: "to" }) })));
};
DateRangeFacet.DISPLAY = 'DateRangeFacet';
