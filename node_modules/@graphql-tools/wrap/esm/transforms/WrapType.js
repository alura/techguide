import WrapFields from './WrapFields.js';
export default class WrapType {
    constructor(outerTypeName, innerTypeName, fieldName) {
        this.transformer = new WrapFields(outerTypeName, [fieldName], [innerTypeName]);
    }
    transformSchema(originalWrappingSchema, subschemaConfig) {
        return this.transformer.transformSchema(originalWrappingSchema, subschemaConfig);
    }
    transformRequest(originalRequest, delegationContext, transformationContext) {
        return this.transformer.transformRequest(originalRequest, delegationContext, transformationContext);
    }
    transformResult(originalResult, delegationContext, transformationContext) {
        return this.transformer.transformResult(originalResult, delegationContext, transformationContext);
    }
}
