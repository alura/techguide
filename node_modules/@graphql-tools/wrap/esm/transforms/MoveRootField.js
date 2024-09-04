import { GraphQLObjectType, GraphQLSchema, Kind, visit } from 'graphql';
import { MapperKind, getDefinedRootType, getRootTypeMap, mapSchema, } from '@graphql-tools/utils';
const defaultRootTypeNames = {
    query: 'Query',
    mutation: 'Mutation',
    subscription: 'Subscription',
};
export class MoveRootField {
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
        const rootTypeMap = getRootTypeMap(schema);
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
                schemaConfig[rootType] = new GraphQLObjectType({
                    name: defaultRootTypeNames[rootType],
                    fields: newRootFields,
                });
            }
        }
        return mapSchema(new GraphQLSchema(schemaConfig), {
            [MapperKind.QUERY]: type => {
                const queryConfig = type.toConfig();
                queryConfig.fields = newRootFieldsMap.query;
                return new GraphQLObjectType(queryConfig);
            },
            [MapperKind.MUTATION]: type => {
                const mutationConfig = type.toConfig();
                mutationConfig.fields = newRootFieldsMap.mutation;
                return new GraphQLObjectType(mutationConfig);
            },
            [MapperKind.SUBSCRIPTION]: type => {
                const subscriptionConfig = type.toConfig();
                subscriptionConfig.fields = newRootFieldsMap.subscription;
                return new GraphQLObjectType(subscriptionConfig);
            },
        });
    }
    transformRequest(originalRequest, delegationContext) {
        const newOperation = this.to[delegationContext.operation][delegationContext.fieldName];
        if (newOperation && newOperation !== delegationContext.operation) {
            return {
                ...originalRequest,
                document: visit(originalRequest.document, {
                    [Kind.OPERATION_DEFINITION]: node => {
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
                result.data.__typename = (_b = getDefinedRootType(delegationContext.targetSchema, newOperation)) === null || _b === void 0 ? void 0 : _b.name;
            }
        }
        return result;
    }
}
