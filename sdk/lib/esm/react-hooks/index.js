"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSearchkitSDK = void 0;
const react_1 = require("react");
const __1 = __importDefault(require("../"));
const useSearchkitSDK = (config, variables) => {
    const [results, setResponse] = react_1.useState(null);
    const [loading, setLoading] = react_1.useState(true);
    react_1.useEffect(() => {
        function fetchData(variables) {
            return __awaiter(this, void 0, void 0, function* () {
                setLoading(true);
                const request = __1.default(config)
                    .query(variables.query)
                    .setFilters(variables.filters)
                    .setSortBy(variables.sortBy);
                const response = yield request.execute({
                    facets: true,
                    hits: {
                        size: variables.page.size,
                        from: variables.page.from
                    }
                });
                setLoading(false);
                setResponse(response);
            });
        }
        variables && fetchData(variables);
    }, [variables]);
    return { results, loading };
};
exports.useSearchkitSDK = useSearchkitSDK;
