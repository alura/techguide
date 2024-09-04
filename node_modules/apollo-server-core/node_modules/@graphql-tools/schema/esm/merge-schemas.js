import { extractExtensionsFromSchema } from '@graphql-tools/merge';
import { asArray, getResolversFromSchema } from '@graphql-tools/utils';
import { makeExecutableSchema } from './makeExecutableSchema.js';
/**
 * Synchronously merges multiple schemas, typeDefinitions and/or resolvers into a single schema.
 * @param config Configuration object
 */
export function mergeSchemas(config) {
    const extractedTypeDefs = asArray(config.typeDefs || []);
    const extractedResolvers = asArray(config.resolvers || []);
    const extractedSchemaExtensions = asArray(config.schemaExtensions || []);
    const schemas = config.schemas || [];
    for (const schema of schemas) {
        extractedTypeDefs.push(schema);
        extractedResolvers.push(getResolversFromSchema(schema, true));
        extractedSchemaExtensions.push(extractExtensionsFromSchema(schema));
    }
    return makeExecutableSchema({
        parseOptions: config,
        ...config,
        typeDefs: extractedTypeDefs,
        resolvers: extractedResolvers,
        schemaExtensions: extractedSchemaExtensions,
    });
}
