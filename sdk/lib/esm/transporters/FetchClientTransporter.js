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
const utils_1 = require("./utils");
class FetchClientTransporter {
    constructor(config) {
        this.config = config;
    }
    performRequest(requestBody, overrides = {}) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!fetch)
                throw new Error('Fetch is not supported in this browser / environment');
            if (!this.config.host && !this.config.cloud) {
                throw new Error('Host or cloud is required');
            }
            let host = this.config.host;
            if (this.config.cloud) {
                host = utils_1.getHostFromCloud(this.config.cloud);
            }
            const { index = this.config.index } = overrides;
            const response = yield fetch(host + '/' + index + '/_search', {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: Object.assign(Object.assign({ 'Content-Type': 'application/json' }, (((_a = this.config.connectionOptions) === null || _a === void 0 ? void 0 : _a.headers) || {})), (((_b = this.config.connectionOptions) === null || _b === void 0 ? void 0 : _b.apiKey)
                    ? { Authorization: `ApiKey ${this.config.connectionOptions.apiKey}` }
                    : {}))
            });
            const json = yield response.json();
            return json;
        });
    }
}
exports.default = FetchClientTransporter;
