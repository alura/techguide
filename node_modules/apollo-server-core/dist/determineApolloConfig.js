"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.determineApolloConfig = void 0;
const createSHA_1 = __importDefault(require("./utils/createSHA"));
function determineApolloConfig(input, logger) {
    var _a, _b, _c;
    const apolloConfig = {};
    const { APOLLO_KEY, APOLLO_GRAPH_REF, APOLLO_GRAPH_ID, APOLLO_GRAPH_VARIANT, } = process.env;
    if (input === null || input === void 0 ? void 0 : input.key) {
        apolloConfig.key = input.key.trim();
    }
    else if (APOLLO_KEY) {
        apolloConfig.key = APOLLO_KEY.trim();
    }
    if (((_a = input === null || input === void 0 ? void 0 : input.key) !== null && _a !== void 0 ? _a : APOLLO_KEY) !== apolloConfig.key) {
        logger.warn('The provided API key has unexpected leading or trailing whitespace. ' +
            'Apollo Server will trim the key value before use.');
    }
    if (apolloConfig.key) {
        assertValidHeaderValue(apolloConfig.key);
    }
    if (apolloConfig.key) {
        apolloConfig.keyHash = (0, createSHA_1.default)('sha512')
            .update(apolloConfig.key)
            .digest('hex');
    }
    if (input === null || input === void 0 ? void 0 : input.graphRef) {
        apolloConfig.graphRef = input.graphRef;
    }
    else if (APOLLO_GRAPH_REF) {
        apolloConfig.graphRef = APOLLO_GRAPH_REF;
    }
    const graphId = (_b = input === null || input === void 0 ? void 0 : input.graphId) !== null && _b !== void 0 ? _b : APOLLO_GRAPH_ID;
    const graphVariant = (_c = input === null || input === void 0 ? void 0 : input.graphVariant) !== null && _c !== void 0 ? _c : APOLLO_GRAPH_VARIANT;
    if (apolloConfig.graphRef) {
        if (graphId) {
            throw new Error('Cannot specify both graph ref and graph ID. Please use ' +
                '`apollo.graphRef` or `APOLLO_GRAPH_REF` without also setting the graph ID.');
        }
        if (graphVariant) {
            throw new Error('Cannot specify both graph ref and graph variant. Please use ' +
                '`apollo.graphRef` or `APOLLO_GRAPH_REF` without also setting the graph variant.');
        }
    }
    else if (graphId) {
        apolloConfig.graphRef = graphVariant
            ? `${graphId}@${graphVariant}`
            : graphId;
    }
    return apolloConfig;
}
exports.determineApolloConfig = determineApolloConfig;
function assertValidHeaderValue(value) {
    const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/g;
    if (invalidHeaderCharRegex.test(value)) {
        const invalidChars = value.match(invalidHeaderCharRegex);
        throw new Error(`The API key provided to Apollo Server contains characters which are invalid as HTTP header values. The following characters found in the key are invalid: ${invalidChars.join(', ')}. Valid header values may only contain ASCII visible characters. If you think there is an issue with your key, please contact Apollo support.`);
    }
}
//# sourceMappingURL=determineApolloConfig.js.map