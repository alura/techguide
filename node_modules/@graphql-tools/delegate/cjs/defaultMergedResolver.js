"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultMergedResolver = void 0;
const graphql_1 = require("graphql");
const utils_1 = require("@graphql-tools/utils");
const resolveExternalValue_js_1 = require("./resolveExternalValue.js");
const mergeFields_js_1 = require("./mergeFields.js");
/**
 * Resolver that knows how to:
 * a) handle aliases for proxied schemas
 * b) handle errors from proxied schemas
 * c) handle external to internal enum conversion
 */
function defaultMergedResolver(parent, args, context, info) {
    if (!parent) {
        return null;
    }
    const responseKey = (0, utils_1.getResponseKeyFromInfo)(info);
    // check to see if parent is not a proxied result, i.e. if parent resolver was manually overwritten
    // See https://github.com/ardatan/graphql-tools/issues/967
    if (!(0, mergeFields_js_1.isExternalObject)(parent)) {
        return (0, graphql_1.defaultFieldResolver)(parent, args, context, info);
    }
    const data = parent[responseKey];
    const unpathedErrors = (0, mergeFields_js_1.getUnpathedErrors)(parent);
    const subschema = (0, mergeFields_js_1.getSubschema)(parent, responseKey);
    return (0, resolveExternalValue_js_1.resolveExternalValue)(data, unpathedErrors, subschema, context, info);
}
exports.defaultMergedResolver = defaultMergedResolver;
