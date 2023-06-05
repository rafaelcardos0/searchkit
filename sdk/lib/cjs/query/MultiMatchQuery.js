"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MultiMatchQuery {
    constructor(config) {
        this.config = config;
    }
    getFilter(queryManager) {
        if (queryManager.hasQuery()) {
            return {
                bool: {
                    should: [
                        {
                            multi_match: {
                                query: queryManager.getQuery(),
                                fields: this.config.fields,
                                type: 'best_fields',
                                operator: 'and'
                            }
                        },
                        {
                            multi_match: {
                                query: queryManager.getQuery(),
                                fields: this.config.fields,
                                type: 'cross_fields'
                            }
                        },
                        {
                            multi_match: {
                                query: queryManager.getQuery(),
                                fields: this.config.fields,
                                type: 'phrase'
                            }
                        },
                        {
                            multi_match: {
                                query: queryManager.getQuery(),
                                fields: this.config.fields,
                                type: 'phrase_prefix'
                            }
                        }
                    ]
                }
            };
        }
        return null;
    }
}
exports.default = MultiMatchQuery;
