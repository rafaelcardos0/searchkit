"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRegexQuery = void 0;
const createRegexQuery = (queryString) => {
    let query = queryString.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    query = query
        .split('')
        .map((char) => {
        if (/[a-z]/.test(char)) {
            return `[${char}${char.toUpperCase()}]`;
        }
        return char;
    })
        .join('');
    query = `${query}.*`;
    if (queryString.length > 2) {
        query = `([a-zA-Z]+ )+?${query}`;
    }
    return query;
};
exports.createRegexQuery = createRegexQuery;
