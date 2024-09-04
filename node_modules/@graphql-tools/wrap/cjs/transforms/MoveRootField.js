"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveRootField = void 0;
const graphql_1 = require("graphql");
const utils_1 = require("@graphql-tools/utils");
const defaultRootTypeNames = {
    query: 'Query',
    mutation: 'Mutation',
    subscription: 'Subscription',
};
class MoveRootField {
    constructor(from) {
        this.from = from;
        this.to = {
            query: {},
            mutation: {},
            subscription: {},
        };
        for (const operation in this.from) {
            const removedFields = this.from[operation];
            for (const fieldName in removedFields) {
                const newOperation = removedFields[fieldName];
                this.to[newOperation][fieldName] = operation;
            }
        }
    }
    transformSchema(schema, _subschemaConfig) {
        var _a, _b, _c, _d, _e, _f, _g;
        const rootTypeMap = (0, utils_1.getRootTypeMap)(schema);
        const newRootFieldsMap = {
            query: ((_b = (_a = rootTypeMap.get('query')) === null || _a === void 0 ? void 0 : _a.toConfig()) === null || _b === void 0 ? void 0 : _b.fields) || {},
            mutation: ((_d = (_c = rootTypeMap.get('mutation')) === null || _c === void 0 ? void 0 : _c.toConfig()) === null || _d === void 0 ? void 0 : _d.fields) || {},
            subscription: ((_f = (_e = rootTypeMap.get('subscription')) === null || _e === void 0 ? void 0 : _e.toConfig()) === null || _f === void 0 ? void 0 : _f.fields) || {},
        };
        for (const operation in this.from) {
            const removedFields = this.from[operation];
            for (const fieldName in removedFields) {
                const fieldConfig = newRootFieldsMap[operation][fieldName];
                (_g = newRootFieldsMap[operation]) === null || _g === void 0 ? true : delete _g[fieldName];
                const newOperation = removedFields[fieldName];
                newRootFieldsMap[newOperation][fieldName] = fieldConfig;
            }
        }
        const schemaConfig = schema.toConfig();
        for (const rootType in newRootFieldsMap) {
            const newRootFields = newRootFieldsMap[rootType];
            if (!schemaConfig[rootType] && Object.keys(newRootFields).length > 0) {
                schemaConfig[rootType] = new graphql_1.GraphQLObjectType({
                    name: defaultRootTypeNames[rootType],
                    fields: newRootFields,
                });
            }
        }
        return (0, utils_1.mapSchema)(new graphql_1.GraphQLSchema(schemaConfig), {
            [utils_1.MapperKind.QUERY]: type => {
                const queryConfig = type.toConfig();
                queryConfig.fields = newRootFieldsMap.query;
                return new graphql_1.GraphQLObjectType(queryConfig);
            },
            [utils_1.MapperKind.MUTATION]: type => {
                const mutationConfig = type.toConfig();
                mutationConfig.fields = newRootFieldsMap.mutation;
                return new graphql_1.GraphQLObjectType(mutationConfig);
            },
            [utils_1.MapperKind.SUBSCRIPTION]: type => {
                const subscriptionConfig = type.toConfig();
                subscriptionConfig.fields = newRootFieldsMap.subscription;
                return new graphql_1.GraphQLObjectType(subscriptionConfig);
            },
        });
    }
    transformRequest(originalRequest, delegationContext) {
        const newOperation = this.to[delegationContext.operation][delegationContext.fieldName];
        if (newOperation && newOperation !== delegationContext.operation) {
            return {
                ...originalRequest,
                document: (0, graphql_1.visit)(originalRequest.document, {
                    [graphql_1.Kind.OPERATION_DEFINITION]: node => {
                        return {
                            ...node,
                            operation: newOperation,
                        };
                    },
                }),
            };
        }
        return originalRequest;
    }
    transformResult(result, delegationContext) {
        var _a, _b;
        if ((_a = result.data) === null || _a === void 0 ? void 0 : _a.__typename) {
            const newOperation = this.to[delegationContext.operation][delegationContext.fieldName];
            if (newOperation && newOperation !== delegationContext.operation) {
                result.data.__typename = (_b = (0, utils_1.getDefinedRootType)(delegationContext.targetSchema, newOperation)) === null || _b === void 0 ? void 0 : _b.name;
            }
        }
        return result;
    }
}
exports.MoveRootField = MoveRootField;
