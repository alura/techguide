import TransformCompositeFields from './TransformCompositeFields.js';
export default class MapFields {
    constructor(fieldNodeTransformerMap, objectValueTransformerMap, errorsTransformer) {
        this.fieldNodeTransformerMap = fieldNodeTransformerMap;
        this.objectValueTransformerMap = objectValueTransformerMap;
        this.errorsTransformer = errorsTransformer;
    }
    _getTransformer() {
        const transformer = this.transformer;
        if (transformer === undefined) {
            throw new Error(`The MapFields transform's  "transformRequest" and "transformResult" methods cannot be used without first calling "transformSchema".`);
        }
        return transformer;
    }
    transformSchema(originalWrappingSchema, subschemaConfig) {
        var _a;
        const subscriptionTypeName = (_a = originalWrappingSchema.getSubscriptionType()) === null || _a === void 0 ? void 0 : _a.name;
        const objectValueTransformerMap = this.objectValueTransformerMap;
        this.transformer = new TransformCompositeFields(() => undefined, (typeName, fieldName, fieldNode, fragments, transformationContext) => {
            const typeTransformers = this.fieldNodeTransformerMap[typeName];
            if (typeTransformers == null) {
                return undefined;
            }
            const fieldNodeTransformer = typeTransformers[fieldName];
            if (fieldNodeTransformer == null) {
                return undefined;
            }
            return fieldNodeTransformer(fieldNode, fragments, transformationContext);
        }, objectValueTransformerMap != null
            ? (data, transformationContext) => {
                if (data == null) {
                    return data;
                }
                let typeName = data.__typename;
                if (typeName == null) {
                    // see https://github.com/ardatan/graphql-tools/issues/2282
                    typeName = subscriptionTypeName;
                    if (typeName == null) {
                        return data;
                    }
                }
                const transformer = objectValueTransformerMap[typeName];
                if (transformer == null) {
                    return data;
                }
                return transformer(data, transformationContext);
            }
            : undefined, this.errorsTransformer != null ? this.errorsTransformer : undefined);
        return this.transformer.transformSchema(originalWrappingSchema, subschemaConfig);
    }
    transformRequest(originalRequest, delegationContext, transformationContext) {
        return this._getTransformer().transformRequest(originalRequest, delegationContext, transformationContext);
    }
    transformResult(originalResult, delegationContext, transformationContext) {
        return this._getTransformer().transformResult(originalResult, delegationContext, transformationContext);
    }
}
