import { validate, } from 'graphql';
import { ValueOrPromise } from 'value-or-promise';
import { getBatchingExecutor } from '@graphql-tools/batch-execute';
import { mapAsyncIterator, AggregateError, isAsyncIterable, getDefinedRootType, memoize1, getOperationASTFromRequest, } from '@graphql-tools/utils';
import { isSubschemaConfig } from './subschemaConfig.js';
import { Subschema } from './Subschema.js';
import { createRequest, getDelegatingOperation } from './createRequest.js';
import { Transformer } from './Transformer.js';
import { applySchemaTransforms } from './applySchemaTransforms.js';
import { normalizedExecutor } from '@graphql-tools/executor';
export function delegateToSchema(options) {
    var _a, _b;
    const { info, schema, rootValue = (_a = schema.rootValue) !== null && _a !== void 0 ? _a : info.rootValue, operationName = (_b = info.operation.name) === null || _b === void 0 ? void 0 : _b.value, operation = getDelegatingOperation(info.parentType, info.schema), fieldName = info.fieldName, selectionSet, fieldNodes = info.fieldNodes, context, } = options;
    const request = createRequest({
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
function getDelegationReturnType(targetSchema, operation, fieldName) {
    const rootType = getDefinedRootType(targetSchema, operation);
    const rootFieldType = rootType.getFields()[fieldName];
    if (!rootFieldType) {
        throw new Error(`Unable to find field '${fieldName}' in type '${rootType}'.`);
    }
    return rootFieldType.type;
}
export function delegateRequest(options) {
    const delegationContext = getDelegationContext(options);
    const transformer = new Transformer(delegationContext);
    const processedRequest = transformer.transformRequest(options.request);
    if (options.validateRequest) {
        validateRequest(delegationContext, processedRequest.document);
    }
    const executor = getExecutor(delegationContext);
    return new ValueOrPromise(() => executor(processedRequest))
        .then(originalResult => {
        if (isAsyncIterable(originalResult)) {
            const iterator = originalResult[Symbol.asyncIterator]();
            // "subscribe" to the subscription result and map the result through the transforms
            return mapAsyncIterator(iterator, result => transformer.transformResult(result));
        }
        return transformer.transformResult(originalResult);
    })
        .resolve();
}
function getDelegationContext({ request, schema, fieldName, returnType, args, info, transforms = [], transformedSchema, skipTypeMerging = false, }) {
    var _a, _b, _c, _d;
    const operationDefinition = getOperationASTFromRequest(request);
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
    if (isSubschemaConfig(subschemaOrSubschemaConfig)) {
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
            transformedSchema: transformedSchema !== null && transformedSchema !== void 0 ? transformedSchema : (subschemaOrSubschemaConfig instanceof Subschema
                ? subschemaOrSubschemaConfig.transformedSchema
                : applySchemaTransforms(targetSchema, subschemaOrSubschemaConfig)),
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
    const errors = validate(delegationContext.targetSchema, document);
    if (errors.length > 0) {
        if (errors.length > 1) {
            const combinedError = new AggregateError(errors, errors.map(error => error.message).join(', \n'));
            throw combinedError;
        }
        const error = errors[0];
        throw error.originalError || error;
    }
}
const GLOBAL_CONTEXT = {};
function getExecutor(delegationContext) {
    const { subschemaConfig, targetSchema, context } = delegationContext;
    let executor = (subschemaConfig === null || subschemaConfig === void 0 ? void 0 : subschemaConfig.executor) || createDefaultExecutor(targetSchema);
    if (subschemaConfig === null || subschemaConfig === void 0 ? void 0 : subschemaConfig.batch) {
        const batchingOptions = subschemaConfig === null || subschemaConfig === void 0 ? void 0 : subschemaConfig.batchingOptions;
        executor = getBatchingExecutor(context !== null && context !== void 0 ? context : GLOBAL_CONTEXT, executor, batchingOptions === null || batchingOptions === void 0 ? void 0 : batchingOptions.dataLoaderOptions, batchingOptions === null || batchingOptions === void 0 ? void 0 : batchingOptions.extensionsReducer);
    }
    return executor;
}
export const createDefaultExecutor = memoize1(function createDefaultExecutor(schema) {
    return function defaultExecutor(request) {
        return normalizedExecutor({
            schema,
            document: request.document,
            rootValue: request.rootValue,
            contextValue: request.context,
            variableValues: request.variables,
            operationName: request.operationName,
        });
    };
});
