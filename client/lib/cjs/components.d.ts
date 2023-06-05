import React from 'react';
interface FilterLinkProps {
    filter: any;
    resetPagination?: boolean;
    children: React.ReactChildren | React.ReactChild;
}
interface PaginationLinkProps {
    page: number;
    children: React.ReactChildren | React.ReactChild;
}
export declare type FilterLinkClickRef = {
    onClick: (e: React.MouseEvent) => void;
};
export declare const FilterLink: React.ForwardRefExoticComponent<FilterLinkProps & React.RefAttributes<FilterLinkClickRef>>;
export declare function PaginationLink({ page, children }: PaginationLinkProps): JSX.Element;
export {};
