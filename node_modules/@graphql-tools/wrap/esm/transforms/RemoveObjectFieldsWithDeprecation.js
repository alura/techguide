import { valueMatchesCriteria } from '@graphql-tools/utils';
import FilterObjectFields from './FilterObjectFields.js';
export default class RemoveObjectFieldsWithDeprecation {
    constructor(reason) {
        this.transformer = new FilterObjectFields((_typeName, _fieldName, fieldConfig) => {
            if (fieldConfig.deprecationReason) {
                return !valueMatchesCriteria(fieldConfig.deprecationReason, reason);
            }
            return true;
        });
    }
    transformSchema(originalWrappingSchema, subschemaConfig) {
        return this.transformer.transformSchema(originalWrappingSchema, subschemaConfig);
    }
}
