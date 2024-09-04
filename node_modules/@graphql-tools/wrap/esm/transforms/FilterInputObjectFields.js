import TransformInputObjectFields from './TransformInputObjectFields.js';
export default class FilterInputObjectFields {
    constructor(filter, inputObjectNodeTransformer) {
        this.transformer = new TransformInputObjectFields((typeName, fieldName, inputFieldConfig) => filter(typeName, fieldName, inputFieldConfig) ? undefined : null, undefined, inputObjectNodeTransformer);
    }
    transformSchema(originalWrappingSchema, subschemaConfig) {
        return this.transformer.transformSchema(originalWrappingSchema, subschemaConfig);
    }
    transformRequest(originalRequest, delegationContext, transformationContext) {
        return this.transformer.transformRequest(originalRequest, delegationContext, transformationContext);
    }
}
