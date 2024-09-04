import { pruneSchema } from '@graphql-tools/utils';
export default class PruneTypes {
    constructor(options = {}) {
        this.options = options;
    }
    transformSchema(originalWrappingSchema, _subschemaConfig) {
        return pruneSchema(originalWrappingSchema, this.options);
    }
}
