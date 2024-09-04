"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applySchemaTransforms = void 0;
const utils_1 = require("@graphql-tools/utils");
// TODO: Instead of memoization, we can make sure that this isn't called multiple times
exports.applySchemaTransforms = (0, utils_1.memoize2)(function applySchemaTransforms(originalWrappingSchema, subschemaConfig) {
    const schemaTransforms = subschemaConfig.transforms;
    if (schemaTransforms == null) {
        return originalWrappingSchema;
    }
    return schemaTransforms.reduce((schema, transform) => { var _a; return ((_a = transform.transformSchema) === null || _a === void 0 ? void 0 : _a.call(transform, schema, subschemaConfig)) || schema; }, originalWrappingSchema);
});
