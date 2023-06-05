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
const elasticsearch_1 = require("@elastic/elasticsearch");
const agentkeepalive_1 = __importStar(require("agentkeepalive"));
const keepaliveHttpsAgent = new agentkeepalive_1.HttpsAgent();
const keepaliveAgent = new agentkeepalive_1.default();
class ESClientTransporter {
    constructor(config) {
        var _a, _b;
        this.config = config;
        if (!this.config.host && !this.config.cloud) {
            throw new Error('Host or cloud is required');
        }
        const esClientConfig = Object.assign(Object.assign({}, (this.config.host ? { node: this.config.host } : { cloud: { id: this.config.cloud.id } })), { auth: {
                apiKey: (_a = this.config.connectionOptions) === null || _a === void 0 ? void 0 : _a.apiKey
            }, headers: Object.assign({}, (((_b = this.config.connectionOptions) === null || _b === void 0 ? void 0 : _b.headers) || {})) });
        if (this.config.host) {
            esClientConfig.agent = () => new URL(this.config.host).protocol === 'http:' ? keepaliveAgent : keepaliveHttpsAgent;
        }
        this.client = new elasticsearch_1.Client(esClientConfig);
    }
    performRequest(requestBody) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const debugMode = process.env.DEBUG_MODE === 'true';
            try {
                if (debugMode)
                    console.log(JSON.stringify(requestBody, null, 2));
                const response = yield this.client.search({
                    index: this.config.index,
                    body: requestBody
                });
                return response.body;
            }
            catch (e) {
                if (debugMode)
                    console.log(JSON.stringify(e, null, 2));
                if (((_a = e.meta) === null || _a === void 0 ? void 0 : _a.statusCode) === 400) {
                    if (debugMode) {
                        console.log(`Elasticsearch query failed. Check your custom filters or configuration. Above is the ES Query`);
                    }
                    throw e;
                }
                else {
                    throw e;
                }
            }
        });
    }
}
exports.default = ESClientTransporter;
