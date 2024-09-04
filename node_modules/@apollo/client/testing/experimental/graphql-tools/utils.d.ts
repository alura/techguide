import type { GraphQLSchema } from "graphql";
/**
 * A function that accepts a static `schema` and a `mocks` object for specifying
 * default scalar mocks and returns a `GraphQLSchema`.
 *
 * @param staticSchema - A static `GraphQLSchema`.
 * @param mocks - An object containing scalar mocks.
 * @returns A `GraphQLSchema` with scalar mocks.
 *
 * @example
 * ```js
 * const mockedSchema = createMockSchema(schema, {
     ID: () => "1",
     Int: () => 42,
     String: () => "String",
     Date: () => new Date("January 1, 2024 01:00:00").toJSON().split("T")[0],
  });
 * ```
 * @since 3.10.0
 * @alpha
 */
declare const createMockSchema: (staticSchema: GraphQLSchema, mocks: {
    [key: string]: any;
}) => GraphQLSchema;
export { createMockSchema };
//# sourceMappingURL=utils.d.ts.map