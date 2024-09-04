import TransformInterfaceFields from './TransformInterfaceFields.js';
export default class RenameInterfaceFields {
    constructor(renamer) {
        this.transformer = new TransformInterfaceFields((typeName, fieldName, fieldConfig) => [
            renamer(typeName, fieldName, fieldConfig),
            fieldConfig,
        ]);
    }
    transformSchema(originalWrappingSchema, subschemaConfig) {
        return this.transformer.transformSchema(originalWrappingSchema, subschemaConfig);
    }
    transformRequest(originalRequest, delegationContext, transformationContext) {
        return this.transformer.transformRequest(originalRequest, delegationContext, transformationContext);
    }
}
