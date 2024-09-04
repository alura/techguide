import { __assign, __spreadArray } from "tslib";
import { print } from "../../utilities/index.js";
var defaultHttpOptions = {
    includeQuery: true,
    includeExtensions: false,
    preserveHeaderCase: false,
};
var defaultHeaders = {
    // headers are case insensitive (https://stackoverflow.com/a/5259004)
    accept: "*/*",
    // The content-type header describes the type of the body of the request, and
    // so it typically only is sent with requests that actually have bodies. One
    // could imagine that Apollo Client would remove this header when constructing
    // a GET request (which has no body), but we historically have not done that.
    // This means that browsers will preflight all Apollo Client requests (even
    // GET requests). Apollo Server's CSRF prevention feature (introduced in
    // AS3.7) takes advantage of this fact and does not block requests with this
    // header. If you want to drop this header from GET requests, then you should
    // probably replace it with a `apollo-require-preflight` header, or servers
    // with CSRF prevention enabled might block your GET request. See
    // https://www.apollographql.com/docs/apollo-server/security/cors/#preventing-cross-site-request-forgery-csrf
    // for more details.
    "content-type": "application/json",
};
var defaultOptions = {
    method: "POST",
};
export var fallbackHttpConfig = {
    http: defaultHttpOptions,
    headers: defaultHeaders,
    options: defaultOptions,
};
export var defaultPrinter = function (ast, printer) { return printer(ast); };
export function selectHttpOptionsAndBody(operation, fallbackConfig) {
    var configs = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        configs[_i - 2] = arguments[_i];
    }
    configs.unshift(fallbackConfig);
    return selectHttpOptionsAndBodyInternal.apply(void 0, __spreadArray([operation,
        defaultPrinter], configs, false));
}
export function selectHttpOptionsAndBodyInternal(operation, printer) {
    var configs = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        configs[_i - 2] = arguments[_i];
    }
    var options = {};
    var http = {};
    configs.forEach(function (config) {
        options = __assign(__assign(__assign({}, options), config.options), { headers: __assign(__assign({}, options.headers), config.headers) });
        if (config.credentials) {
            options.credentials = config.credentials;
        }
        http = __assign(__assign({}, http), config.http);
    });
    if (options.headers) {
        options.headers = removeDuplicateHeaders(options.headers, http.preserveHeaderCase);
    }
    //The body depends on the http options
    var operationName = operation.operationName, extensions = operation.extensions, variables = operation.variables, query = operation.query;
    var body = { operationName: operationName, variables: variables };
    if (http.includeExtensions)
        body.extensions = extensions;
    // not sending the query (i.e persisted queries)
    if (http.includeQuery)
        body.query = printer(query, print);
    return {
        options: options,
        body: body,
    };
}
// Remove potential duplicate header names, preserving last (by insertion order).
// This is done to prevent unintentionally duplicating a header instead of
// overwriting it (See #8447 and #8449).
function removeDuplicateHeaders(headers, preserveHeaderCase) {
    // If we're not preserving the case, just remove duplicates w/ normalization.
    if (!preserveHeaderCase) {
        var normalizedHeaders_1 = Object.create(null);
        Object.keys(Object(headers)).forEach(function (name) {
            normalizedHeaders_1[name.toLowerCase()] = headers[name];
        });
        return normalizedHeaders_1;
    }
    // If we are preserving the case, remove duplicates w/ normalization,
    // preserving the original name.
    // This allows for non-http-spec-compliant servers that expect intentionally
    // capitalized header names (See #6741).
    var headerData = Object.create(null);
    Object.keys(Object(headers)).forEach(function (name) {
        headerData[name.toLowerCase()] = {
            originalName: name,
            value: headers[name],
        };
    });
    var normalizedHeaders = Object.create(null);
    Object.keys(headerData).forEach(function (name) {
        normalizedHeaders[headerData[name].originalName] = headerData[name].value;
    });
    return normalizedHeaders;
}
//# sourceMappingURL=selectHttpOptionsAndBody.js.map