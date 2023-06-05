"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PrefixQuery {
    constructor(options) {
        this.fields = options.fields;
    }
    getFilter(queryManager) {
        return {
            bool: {
                must: [
                    {
                        multi_match: {
                            query: queryManager.getQuery(),
                            type: 'bool_prefix',
                            fields: this.fields
                        }
                    }
                ]
            }
        };
    }
}
exports.default = PrefixQuery;
