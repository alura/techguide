import { valueMatchesCriteria } from '@graphql-tools/utils';
import FilterObjectFieldDirectives from './FilterObjectFieldDirectives.js';
import TransformObjectFields from './TransformObjectFields.js';
export default class RemoveObjectFieldDeprecations {
    constructor(reason) {
        const args = { reason };
        this.removeDirectives = new FilterObjectFieldDirectives((dirName, dirValue) => {
            return !(dirName === 'deprecated' && valueMatchesCriteria(dirValue, args));
        });
        this.removeDeprecations = new TransformObjectFields((_typeName, _fieldName, fieldConfig) => {
            if (fieldConfig.deprecationReason && valueMatchesCriteria(fieldConfig.deprecationReason, reason)) {
                fieldConfig = { ...fieldConfig };
                delete fieldConfig.deprecationReason;
            }
            return fieldConfig;
        });
    }
    transformSchema(originalWrappingSchema, subschemaConfig) {
        return this.removeDeprecations.transformSchema(this.removeDirectives.transformSchema(originalWrappingSchema, subschemaConfig), subschemaConfig);
    }
}
