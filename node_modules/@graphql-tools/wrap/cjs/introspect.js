"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaFromExecutor = exports.introspectSchema = void 0;
const graphql_1 = require("graphql");
const value_or_promise_1 = require("value-or-promise");
const utils_1 = require("@graphql-tools/utils");
function getSchemaFromIntrospection(introspectionResult, options) {
    var _a;
    if ((_a = introspectionResult === null || introspectionResult === void 0 ? void 0 : introspectionResult.data) === null || _a === void 0 ? void 0 : _a.__schema) {
        return (0, graphql_1.buildClientSchema)(introspectionResult.data, options);
    }
    if (introspectionResult === null || introspectionResult === void 0 ? void 0 : introspectionResult.errors) {
        const graphqlErrors = introspectionResult.errors.map(error => (0, utils_1.createGraphQLError)(error.message, error));
        if (introspectionResult.errors.length === 1) {
            throw graphqlErrors[0];
        }
        else {
            throw new utils_1.AggregateError(graphqlErrors, 'Could not obtain introspection result');
        }
    }
    throw (0, utils_1.createGraphQLError)(`Could not obtain introspection result, received the following as response; \n ${(0, utils_1.inspect)(introspectionResult)}`);
}
let hasWarned = false;
exports.introspectSchema = function introspectSchema(...args) {
    if (!hasWarned) {
        hasWarned = true;
        console.warn(`\`introspectSchema\` is deprecated, and will be removed in the next major. Please use \`schemaFromExecutor\` instead.`);
    }
    return schemaFromExecutor(...args);
};
function schemaFromExecutor(executor, context, options) {
    const parsedIntrospectionQuery = (0, graphql_1.parse)((0, graphql_1.getIntrospectionQuery)(options), options);
    return new value_or_promise_1.ValueOrPromise(() => executor({
        document: parsedIntrospectionQuery,
        context,
    }))
        .then(introspection => {
        if ((0, utils_1.isAsyncIterable)(introspection)) {
            const iterator = introspection[Symbol.asyncIterator]();
            return iterator.next().then(({ value }) => value);
        }
        return introspection;
    })
        .then(introspection => getSchemaFromIntrospection(introspection, options))
        .resolve();
}
exports.schemaFromExecutor = schemaFromExecutor;
