import { getDirectives, valueMatchesCriteria } from '@graphql-tools/utils';
import FilterObjectFields from './FilterObjectFields.js';
export default class RemoveObjectFieldsWithDirective {
    constructor(directiveName, args = {}) {
        this.directiveName = directiveName;
        this.args = args;
    }
    transformSchema(originalWrappingSchema, subschemaConfig) {
        const transformer = new FilterObjectFields((_typeName, _fieldName, fieldConfig) => {
            const directives = getDirectives(originalWrappingSchema, fieldConfig);
            return !directives.some(directive => valueMatchesCriteria(directive.name, this.directiveName) && valueMatchesCriteria(directive.args, this.args));
        });
        return transformer.transformSchema(originalWrappingSchema, subschemaConfig);
    }
}
