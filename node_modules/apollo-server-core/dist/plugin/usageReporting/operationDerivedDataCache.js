"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.operationDerivedDataCacheKey = exports.createOperationDerivedDataCache = void 0;
const lru_cache_1 = __importDefault(require("lru-cache"));
function createOperationDerivedDataCache({ logger, }) {
    let lastWarn;
    let lastDisposals = 0;
    return new lru_cache_1.default({
        length(obj) {
            return Buffer.byteLength(JSON.stringify(obj), 'utf8');
        },
        max: Math.pow(2, 20) * 10,
        dispose() {
            lastDisposals++;
            if (!lastWarn || new Date().getTime() - lastWarn.getTime() > 60000) {
                lastWarn = new Date();
                logger.warn([
                    'This server is processing a high number of unique operations.  ',
                    `A total of ${lastDisposals} records have been `,
                    'ejected from the ApolloServerPluginUsageReporting signature cache in the past ',
                    'interval.  If you see this warning frequently, please open an ',
                    'issue on the Apollo Server repository.',
                ].join(''));
                lastDisposals = 0;
            }
        },
    });
}
exports.createOperationDerivedDataCache = createOperationDerivedDataCache;
function operationDerivedDataCacheKey(queryHash, operationName) {
    return `${queryHash}${operationName && ':' + operationName}`;
}
exports.operationDerivedDataCacheKey = operationDerivedDataCacheKey;
//# sourceMappingURL=operationDerivedDataCache.js.map