"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeSchemas = void 0;
const merge_1 = require("@graphql-tools/merge");
const utils_1 = require("@graphql-tools/utils");
const makeExecutableSchema_js_1 = require("./makeExecutableSchema.js");
/**
 * Synchronously merges multiple schemas, typeDefinitions and/or resolvers into a single schema.
 * @param config Configuration object
 */
function mergeSchemas(config) {
    const extractedTypeDefs = (0, utils_1.asArray)(config.typeDefs || []);
    const extractedResolvers = (0, utils_1.asArray)(config.resolvers || []);
    const extractedSchemaExtensions = (0, utils_1.asArray)(config.schemaExtensions || []);
    const schemas = config.schemas || [];
    for (const schema of schemas) {
        extractedTypeDefs.push(schema);
        extractedResolvers.push((0, utils_1.getResolversFromSchema)(schema, true));
        extractedSchemaExtensions.push((0, merge_1.extractExtensionsFromSchema)(schema));
    }
    return (0, makeExecutableSchema_js_1.makeExecutableSchema)({
        parseOptions: config,
        ...config,
        typeDefs: extractedTypeDefs,
        resolvers: extractedResolvers,
        schemaExtensions: extractedSchemaExtensions,
    });
}
exports.mergeSchemas = mergeSchemas;
