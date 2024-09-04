"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultExecutor = exports.delegateRequest = exports.delegateToSchema = void 0;
const graphql_1 = require("graphql");
const value_or_promise_1 = require("value-or-promise");
const batch_execute_1 = require("@graphql-tools/batch-execute");
const utils_1 = require("@graphql-tools/utils");
const subschemaConfig_js_1 = require("./subschemaConfig.js");
const Subschema_js_1 = require("./Subschema.js");
const createRequest_js_1 = require("./createRequest.js");
const Transformer_js_1 = require("./Transformer.js");
const applySchemaTransforms_js_1 = require("./applySchemaTransforms.js");
const executor_1 = require("@graphql-tools/executor");
function delegateToSchema(options) {
    var _a, _b;
    const { info, schema, rootValue = (_a = schema.rootValue) !== null && _a !== void 0 ? _a : info.rootValue, operationName = (_b = info.operation.name) === null || _b === void 0 ? void 0 : _b.value, operation = (0, createRequest_js_1.getDelegatingOperation)(info.parentType, info.schema), fieldName = info.fieldName, selectionSet, fieldNodes = info.fieldNodes, context, } = options;
    const request = (0, createRequest_js_1.createRequest)({
        sourceSchema: info.schema,
        sourceParentType: info.parentType,
        sourceFieldName: info.fieldName,
        fragments: info.fragments,
        variableDefinitions: info.operation.variableDefinitions,
        variableValues: info.variableValues,
        targetRootValue: rootValue,
        targetOperationName: operationName,
        targetOperation: operation,
        targetFieldName: fieldName,
        selectionSet,
        fieldNodes,
        context,
        info,
    });
    return delegateRequest({
        ...options,
        request,
    });
}
exports.delegateToSchema = delegateToSchema;
function getDelegationReturnType(targetSchema, operation, fieldName) {
    const rootType = (0, utils_1.getDefinedRootType)(targetSchema, operation);
    const rootFieldType = rootType.getFields()[fieldName];
    if (!rootFieldType) {
        throw new Error(`Unable to find field '${fieldName}' in type '${rootType}'.`);
    }
    return rootFieldType.type;
}
function delegateRequest(options) {
    const delegationContext = getDelegationContext(options);
    const transformer = new Transformer_js_1.Transformer(delegationContext);
    const processedRequest = transformer.transformRequest(options.request);
    if (options.validateRequest) {
        validateRequest(delegationContext, processedRequest.document);
    }
    const executor = getExecutor(delegationContext);
    return new value_or_promise_1.ValueOrPromise(() => executor(processedRequest))
        .then(originalResult => {
        if ((0, utils_1.isAsyncIterable)(originalResult)) {
            const iterator = originalResult[Symbol.asyncIterator]();
            // "subscribe" to the subscription result and map the result through the transforms
            return (0, utils_1.mapAsyncIterator)(iterator, result => transformer.transformResult(result));
        }
        return transformer.transformResult(originalResult);
    })
        .resolve();
}
exports.delegateRequest = delegateRequest;
function getDelegationContext({ request, schema, fieldName, returnType, args, info, transforms = [], transformedSchema, skipTypeMerging = false, }) {
    var _a, _b, _c, _d;
    const operationDefinition = (0, utils_1.getOperationASTFromRequest)(request);
    let targetFieldName;
    if (fieldName == null) {
        targetFieldName = operationDefinition.selectionSet.selections[0].name.value;
    }
    else {
        targetFieldName = fieldName;
    }
    const stitchingInfo = (_a = info === null || info === void 0 ? void 0 : info.schema.extensions) === null || _a === void 0 ? void 0 : _a['stitchingInfo'];
    const subschemaOrSubschemaConfig = (_b = stitchingInfo === null || stitchingInfo === void 0 ? void 0 : stitchingInfo.subschemaMap.get(schema)) !== null && _b !== void 0 ? _b : schema;
    const operation = operationDefinition.operation;
    if ((0, subschemaConfig_js_1.isSubschemaConfig)(subschemaOrSubschemaConfig)) {
        const targetSchema = subschemaOrSubschemaConfig.schema;
        return {
            subschema: schema,
            subschemaConfig: subschemaOrSubschemaConfig,
            targetSchema,
            operation,
            fieldName: targetFieldName,
            args,
            context: request.context,
            info,
            returnType: (_c = returnType !== null && returnType !== void 0 ? returnType : info === null || info === void 0 ? void 0 : info.returnType) !== null && _c !== void 0 ? _c : getDelegationReturnType(targetSchema, operation, targetFieldName),
            transforms: subschemaOrSubschemaConfig.transforms != null
                ? subschemaOrSubschemaConfig.transforms.concat(transforms)
                : transforms,
            transformedSchema: transformedSchema !== null && transformedSchema !== void 0 ? transformedSchema : (subschemaOrSubschemaConfig instanceof Subschema_js_1.Subschema
                ? subschemaOrSubschemaConfig.transformedSchema
                : (0, applySchemaTransforms_js_1.applySchemaTransforms)(targetSchema, subschemaOrSubschemaConfig)),
            skipTypeMerging,
        };
    }
    return {
        subschema: schema,
        subschemaConfig: undefined,
        targetSchema: subschemaOrSubschemaConfig,
        operation,
        fieldName: targetFieldName,
        args,
        context: request.context,
        info,
        returnType: (_d = returnType !== null && returnType !== void 0 ? returnType : info === null || info === void 0 ? void 0 : info.returnType) !== null && _d !== void 0 ? _d : getDelegationReturnType(subschemaOrSubschemaConfig, operation, targetFieldName),
        transforms,
        transformedSchema: transformedSchema !== null && transformedSchema !== void 0 ? transformedSchema : subschemaOrSubschemaConfig,
        skipTypeMerging,
    };
}
function validateRequest(delegationContext, document) {
    const errors = (0, graphql_1.validate)(delegationContext.targetSchema, document);
    if (errors.length > 0) {
        if (errors.length > 1) {
            const combinedError = new utils_1.AggregateError(errors, errors.map(error => error.message).join(', \n'));
            throw combinedError;
        }
        const error = errors[0];
        throw error.originalError || error;
    }
}
const GLOBAL_CONTEXT = {};
function getExecutor(delegationContext) {
    const { subschemaConfig, targetSchema, context } = delegationContext;
    let executor = (subschemaConfig === null || subschemaConfig === void 0 ? void 0 : subschemaConfig.executor) || (0, exports.createDefaultExecutor)(targetSchema);
    if (subschemaConfig === null || subschemaConfig === void 0 ? void 0 : subschemaConfig.batch) {
        const batchingOptions = subschemaConfig === null || subschemaConfig === void 0 ? void 0 : subschemaConfig.batchingOptions;
        executor = (0, batch_execute_1.getBatchingExecutor)(context !== null && context !== void 0 ? context : GLOBAL_CONTEXT, executor, batchingOptions === null || batchingOptions === void 0 ? void 0 : batchingOptions.dataLoaderOptions, batchingOptions === null || batchingOptions === void 0 ? void 0 : batchingOptions.extensionsReducer);
    }
    return executor;
}
exports.createDefaultExecutor = (0, utils_1.memoize1)(function createDefaultExecutor(schema) {
    return function defaultExecutor(request) {
        return (0, executor_1.normalizedExecutor)({
            schema,
            document: request.document,
            rootValue: request.rootValue,
            contextValue: request.context,
            variableValues: request.variables,
            operationName: request.operationName,
        });
    };
});
