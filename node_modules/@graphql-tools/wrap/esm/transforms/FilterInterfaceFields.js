import TransformInterfaceFields from './TransformInterfaceFields.js';
export default class FilterInterfaceFields {
    constructor(filter) {
        this.transformer = new TransformInterfaceFields((typeName, fieldName, fieldConfig) => filter(typeName, fieldName, fieldConfig) ? undefined : null);
    }
    transformSchema(originalWrappingSchema, subschemaConfig) {
        return this.transformer.transformSchema(originalWrappingSchema, subschemaConfig);
    }
}
