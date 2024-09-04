import TransformRootFields from './TransformRootFields.js';
export default class RenameRootFields {
    constructor(renamer) {
        this.transformer = new TransformRootFields((operation, fieldName, fieldConfig) => [renamer(operation, fieldName, fieldConfig), fieldConfig]);
    }
    transformSchema(originalWrappingSchema, subschemaConfig) {
        return this.transformer.transformSchema(originalWrappingSchema, subschemaConfig);
    }
    transformRequest(originalRequest, delegationContext, transformationContext) {
        return this.transformer.transformRequest(originalRequest, delegationContext, transformationContext);
    }
}
