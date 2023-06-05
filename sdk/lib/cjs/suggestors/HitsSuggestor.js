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
exports.HitsSuggestor = void 0;
const QueryManager_1 = __importDefault(require("../core/QueryManager"));
class HitsSuggestor {
    constructor(options) {
        this.options = options;
    }
    getSuggestions(query, transport) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { index, identifier, hits, query: queryHandler, size = 5 } = this.options;
            const qm = new QueryManager_1.default();
            qm.setQuery(query);
            const sourceFields = {
                _source: {
                    includes: hits.fields
                }
            };
            let highlight;
            (_a = hits.highlightedFields) === null || _a === void 0 ? void 0 : _a.forEach((field) => {
                if (!highlight) {
                    highlight = { fields: {} };
                }
                if (typeof field == 'string') {
                    highlight.fields[field] = {};
                }
                else {
                    highlight.fields[field.field] = field.config;
                }
            });
            const eql = Object.assign(Object.assign({ size, query: queryHandler.getFilter(qm) }, sourceFields), { highlight });
            const response = yield transport.performRequest(eql, { index });
            return {
                identifier,
                hits: response.hits.hits.map((hit) => ({
                    id: hit._id,
                    fields: hit._source,
                    highlight: hit.highlight || {},
                    rawHit: hit
                }))
            };
        });
    }
}
exports.HitsSuggestor = HitsSuggestor;
