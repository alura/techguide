'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('../utilities/globals');
var context = require('./context');
var hooks = require('./hooks');
var parser = require('./parser');
var tslib = require('tslib');
var internal = require('./internal');

function createQueryPreloader(client) {
    return function preloadQuery(query, options) {
        var _a, _b;
        if (options === void 0) { options = Object.create(null); }
        var queryRef = new internal.InternalQueryReference(client.watchQuery(tslib.__assign(tslib.__assign({}, options), { query: query })), {
            autoDisposeTimeoutMs: (_b = (_a = client.defaultOptions.react) === null || _a === void 0 ? void 0 : _a.suspense) === null || _b === void 0 ? void 0 : _b.autoDisposeTimeoutMs,
        });
        return internal.wrapQueryRef(queryRef);
    };
}

exports.ApolloConsumer = context.ApolloConsumer;
exports.ApolloProvider = context.ApolloProvider;
exports.getApolloContext = context.getApolloContext;
exports.resetApolloContext = context.resetApolloContext;
exports.DocumentType = parser.DocumentType;
exports.operationName = parser.operationName;
exports.parser = parser.parser;
exports.createQueryPreloader = createQueryPreloader;
for (var k in hooks) {
    if (k !== 'default' && !exports.hasOwnProperty(k)) exports[k] = hooks[k];
}
//# sourceMappingURL=react.cjs.map
