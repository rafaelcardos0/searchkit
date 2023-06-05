"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomQuery {
    constructor(config) {
        this.config = config;
    }
    getFilter(queryManager) {
        return this.config.queryFn(queryManager.getQuery(), queryManager);
    }
}
exports.default = CustomQuery;
