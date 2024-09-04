import type { ASTNode } from "graphql";
import { print } from "../../utilities/index.js";
import type { Operation } from "../core/index.js";
export interface Printer {
    (node: ASTNode, originalPrint: typeof print): string;
}
export interface UriFunction {
    (operation: Operation): string;
}
export interface Body {
    query?: string;
    operationName?: string;
    variables?: Record<string, any>;
    extensions?: Record<string, any>;
}
export interface HttpOptions {
    /**
     * The URI to use when fetching operations.
     *
     * Defaults to '/graphql'.
     */
    uri?: string | UriFunction;
    /**
     * Passes the extensions field to your graphql server.
     *
     * Defaults to false.
     */
    includeExtensions?: boolean;
    /**
     * A `fetch`-compatible API to use when making requests.
     */
    fetch?: typeof fetch;
    /**
     * An object representing values to be sent as headers on the request.
     */
    headers?: Record<string, string>;
    /**
     * If set to true, header names won't be automatically normalized to
     * lowercase. This allows for non-http-spec-compliant servers that might
     * expect capitalized header names.
     */
    preserveHeaderCase?: boolean;
    /**
     * The credentials policy you want to use for the fetch call.
     */
    credentials?: string;
    /**
     * Any overrides of the fetch options argument to pass to the fetch call.
     */
    fetchOptions?: any;
    /**
     * If set to true, use the HTTP GET method for query operations. Mutations
     * will still use the method specified in fetchOptions.method (which defaults
     * to POST).
     */
    useGETForQueries?: boolean;
    /**
     * If set to true, the default behavior of stripping unused variables
     * from the request will be disabled.
     *
     * Unused variables are likely to trigger server-side validation errors,
     * per https://spec.graphql.org/draft/#sec-All-Variables-Used, but this
     * includeUnusedVariables option can be useful if your server deviates
     * from the GraphQL specification by not strictly enforcing that rule.
     */
    includeUnusedVariables?: boolean;
    /**
     * A function to substitute for the default query print function. Can be
     * used to apply changes to the results of the print function.
     */
    print?: Printer;
}
export interface HttpQueryOptions {
    includeQuery?: boolean;
    includeExtensions?: boolean;
    preserveHeaderCase?: boolean;
}
export interface HttpConfig {
    http?: HttpQueryOptions;
    options?: any;
    headers?: Record<string, string>;
    credentials?: any;
}
export declare const fallbackHttpConfig: {
    http: HttpQueryOptions;
    headers: {
        accept: string;
        "content-type": string;
    };
    options: {
        method: string;
    };
};
export declare const defaultPrinter: Printer;
export declare function selectHttpOptionsAndBody(operation: Operation, fallbackConfig: HttpConfig, ...configs: Array<HttpConfig>): {
    options: HttpConfig & Record<string, any>;
    body: Body;
};
export declare function selectHttpOptionsAndBodyInternal(operation: Operation, printer: Printer, ...configs: HttpConfig[]): {
    options: HttpConfig & Record<string, any>;
    body: Body;
};
//# sourceMappingURL=selectHttpOptionsAndBody.d.ts.map