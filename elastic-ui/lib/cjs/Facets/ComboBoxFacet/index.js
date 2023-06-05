"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComboBoxFacet = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
const client_1 = require("@searchkit/client");
const client_2 = require("@apollo/client");
const facetRefinementSearchQuery = client_2.gql `
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
exports.ComboBoxFacet = ({ facet }) => {
    const api = client_1.useSearchkit();
    const client = client_2.useApolloClient();
    const [data, setData] = react_1.useState(() => facet.entries.map((entry) => ({ label: entry.label })));
    const [loading, setLoading] = react_1.useState(false);
    const [filters, setFilters] = react_1.useState(() => api.getFiltersByIdentifier(facet.identifier).map((filter) => ({ label: filter.value })));
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
    react_1.useEffect(() => {
        const apiFilters = api.getFiltersByIdentifier(facet.identifier);
        if (apiFilters.length != filters.length) {
            api.removeFiltersByIdentifier(facet.identifier);
            filters.forEach((f) => {
                api.addFilter({ identifier: facet.identifier, value: f.label });
            });
            api.search();
        }
    }, [filters]);
    return (react_1.default.createElement(eui_1.EuiComboBox, { placeholder: `Search ${facet.label}`, async: true, options: data, selectedOptions: filters, onSearchChange: onSearchChange, isLoading: loading, onChange: (filters) => {
            setFilters(filters);
        } }));
};
exports.ComboBoxFacet.DISPLAY = 'ComboBoxFacet';
