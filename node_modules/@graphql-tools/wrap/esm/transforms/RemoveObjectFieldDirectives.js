import { valueMatchesCriteria } from '@graphql-tools/utils';
import FilterObjectFieldDirectives from './FilterObjectFieldDirectives.js';
export default class RemoveObjectFieldDirectives {
    constructor(directiveName, args = {}) {
        this.transformer = new FilterObjectFieldDirectives((dirName, dirValue) => {
            return !(valueMatchesCriteria(dirName, directiveName) && valueMatchesCriteria(dirValue, args));
        });
    }
    transformSchema(originalWrappingSchema, subschemaConfig) {
        return this.transformer.transformSchema(originalWrappingSchema, subschemaConfig);
    }
}
