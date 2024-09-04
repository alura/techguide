import type { GraphQLSchema } from "graphql";
import type { Resolvers } from "../../core/types.js";
type ProxiedSchema = GraphQLSchema & TestSchemaFns;
interface TestSchemaFns {
    add: (addOptions: {
        resolvers: Resolvers;
    }) => ProxiedSchema;
    fork: (forkOptions?: {
        resolvers?: Resolvers;
    }) => ProxiedSchema;
    reset: () => void;
}
interface TestSchemaOptions {
    resolvers: Resolvers;
    scalars?: {
        [key: string]: any;
    };
}
/**
 * A function that creates a [Proxy object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
 * around a given `schema` with `resolvers`. This proxied schema can be used to
 * progressively layer resolvers on top of the original schema using the `add`
 * method. The `fork` method can be used to create a new proxied schema which
 * can be modified independently of the original schema. `reset` will restore
 * resolvers to the original proxied schema.
 *
 * @param schema - A `GraphQLSchema`.
 * @param options - An `options` object that accepts `scalars` and `resolvers` objects.
 * @returns A `ProxiedSchema` with `add`, `fork` and `reset` methods.
 *
 * @example
 * ```js
 *
 * const schema = createTestSchema(schemaWithTypeDefs, {
 *   resolvers: {
       Query: {
         writer: () => ({
           name: "Ada Lovelace",
         }),
       }
     },
     scalars: {
       ID: () => "1",
       Int: () => 36,
       String: () => "String",
       Date: () => new Date("December 10, 1815 01:00:00").toJSON().split("T")[0],
     }
   });
 * ```
 * @since 3.9.0
 * @alpha
 */
declare const createTestSchema: (schemaWithTypeDefs: GraphQLSchema, options: TestSchemaOptions) => ProxiedSchema;
export { createTestSchema };
//# sourceMappingURL=createTestSchema.d.ts.map