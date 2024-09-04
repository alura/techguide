import { memoize2 } from '@graphql-tools/utils';
// TODO: Instead of memoization, we can make sure that this isn't called multiple times
export const applySchemaTransforms = memoize2(function applySchemaTransforms(originalWrappingSchema, subschemaConfig) {
    const schemaTransforms = subschemaConfig.transforms;
    if (schemaTransforms == null) {
        return originalWrappingSchema;
    }
    return schemaTransforms.reduce((schema, transform) => { var _a; return ((_a = transform.transformSchema) === null || _a === void 0 ? void 0 : _a.call(transform, schema, subschemaConfig)) || schema; }, originalWrappingSchema);
});
