"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pagination = void 0;
const client_1 = require("searchkit/client");
const eui_1 = require("@elastic/eui");
const react_1 = __importDefault(require("react"));
exports.Pagination = ({ data }) => {
    const api = client_1.useSearchkit();
    return (react_1.default.createElement(eui_1.EuiPagination, { "aria-label": "Pagination", pageCount: data === null || data === void 0 ? void 0 : data.hits.page.totalPages, activePage: data === null || data === void 0 ? void 0 : data.hits.page.pageNumber, onPageClick: (activePage) => {
            api.setPage({ size: data.hits.page.size, from: activePage * data.hits.page.size });
            api.search();
        } }));
};
