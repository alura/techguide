import type { GraphQLSchema } from "graphql";
import type { Operation, FetchResult } from "../core/index.js";
import { ApolloLink } from "../core/index.js";
import { Observable } from "../../utilities/index.js";
export declare namespace SchemaLink {
    type ResolverContext = Record<string, any>;
    type ResolverContextFunction = (operation: Operation) => ResolverContext | PromiseLike<ResolverContext>;
    interface Options {
        /**
         * The schema to generate responses from.
         */
        schema: GraphQLSchema;
        /**
         * The root value to use when generating responses.
         */
        rootValue?: any;
        /**
         * A context to provide to resolvers declared within the schema.
         */
        context?: ResolverContext | ResolverContextFunction;
        /**
         * Validate incoming queries against the given schema, returning
         * validation errors as a GraphQL server would.
         */
        validate?: boolean;
    }
}
export declare class SchemaLink extends ApolloLink {
    schema: SchemaLink.Options["schema"];
    rootValue: SchemaLink.Options["rootValue"];
    context: SchemaLink.Options["context"];
    validate: boolean;
    constructor(options: SchemaLink.Options);
    request(operation: Operation): Observable<FetchResult>;
}
//# sourceMappingURL=index.d.ts.map