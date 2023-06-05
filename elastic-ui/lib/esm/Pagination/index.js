import { useSearchkit } from '@searchkit/client';
import { EuiPagination } from '@elastic/eui';
import React from 'react';
export const Pagination = ({ data }) => {
    const api = useSearchkit();
    return (React.createElement(EuiPagination, { "aria-label": "Pagination", pageCount: data === null || data === void 0 ? void 0 : data.hits.page.totalPages, activePage: data === null || data === void 0 ? void 0 : data.hits.page.pageNumber, onPageClick: (activePage) => {
            api.setPage({ size: data.hits.page.size, from: activePage * data.hits.page.size });
            api.search();
        } }));
};
