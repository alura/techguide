import TransformRootFields from './TransformRootFields.js';
export default class FilterRootFields {
    constructor(filter) {
        this.transformer = new TransformRootFields((operation, fieldName, fieldConfig) => {
            if (filter(operation, fieldName, fieldConfig)) {
                return undefined;
            }
            return null;
        });
    }
    transformSchema(originalWrappingSchema, subschemaConfig) {
        return this.transformer.transformSchema(originalWrappingSchema, subschemaConfig);
    }
}
