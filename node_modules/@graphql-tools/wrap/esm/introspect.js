import { getIntrospectionQuery, buildClientSchema, parse, } from 'graphql';
import { ValueOrPromise } from 'value-or-promise';
import { isAsyncIterable, AggregateError, createGraphQLError, inspect, } from '@graphql-tools/utils';
function getSchemaFromIntrospection(introspectionResult, options) {
    var _a;
    if ((_a = introspectionResult === null || introspectionResult === void 0 ? void 0 : introspectionResult.data) === null || _a === void 0 ? void 0 : _a.__schema) {
        return buildClientSchema(introspectionResult.data, options);
    }
    if (introspectionResult === null || introspectionResult === void 0 ? void 0 : introspectionResult.errors) {
        const graphqlErrors = introspectionResult.errors.map(error => createGraphQLError(error.message, error));
        if (introspectionResult.errors.length === 1) {
            throw graphqlErrors[0];
        }
        else {
            throw new AggregateError(graphqlErrors, 'Could not obtain introspection result');
        }
    }
    throw createGraphQLError(`Could not obtain introspection result, received the following as response; \n ${inspect(introspectionResult)}`);
}
let hasWarned = false;
export const introspectSchema = function introspectSchema(...args) {
    if (!hasWarned) {
        hasWarned = true;
        console.warn(`\`introspectSchema\` is deprecated, and will be removed in the next major. Please use \`schemaFromExecutor\` instead.`);
    }
    return schemaFromExecutor(...args);
};
export function schemaFromExecutor(executor, context, options) {
    const parsedIntrospectionQuery = parse(getIntrospectionQuery(options), options);
    return new ValueOrPromise(() => executor({
        document: parsedIntrospectionQuery,
        context,
    }))
        .then(introspection => {
        if (isAsyncIterable(introspection)) {
            const iterator = introspection[Symbol.asyncIterator]();
            return iterator.next().then(({ value }) => value);
        }
        return introspection;
    })
        .then(introspection => getSchemaFromIntrospection(introspection, options))
        .resolve();
}
