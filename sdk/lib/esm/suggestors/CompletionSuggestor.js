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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompletionSuggester = void 0;
class CompletionSuggester {
    constructor(options) {
        this.options = options;
    }
    getSuggestions(query, transport) {
        return __awaiter(this, void 0, void 0, function* () {
            const { index, identifier, field, size = 5, skip_duplicates } = this.options;
            const eql = {
                size: 0,
                _source: [],
                suggest: {
                    suggest: {
                        prefix: query,
                        completion: {
                            size: size,
                            skip_duplicates: !skip_duplicates,
                            field: field,
                            fuzzy: {
                                fuzziness: 1
                            }
                        }
                    }
                }
            };
            const response = yield transport.performRequest(eql, { index });
            return {
                identifier: identifier,
                suggestions: response.suggest.suggest[0].options.map((suggestion) => suggestion.text)
            };
        });
    }
}
exports.CompletionSuggester = CompletionSuggester;
