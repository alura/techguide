import { serializeFetchParameter } from "./serializeFetchParameter.js";
// For GET operations, returns the given URI rewritten with parameters, or a
// parse error.
export function rewriteURIForGET(chosenURI, body) {
    // Implement the standard HTTP GET serialization, plus 'extensions'. Note
    // the extra level of JSON serialization!
    var queryParams = [];
    var addQueryParam = function (key, value) {
        queryParams.push("".concat(key, "=").concat(encodeURIComponent(value)));
    };
    if ("query" in body) {
        addQueryParam("query", body.query);
    }
    if (body.operationName) {
        addQueryParam("operationName", body.operationName);
    }
    if (body.variables) {
        var serializedVariables = void 0;
        try {
            serializedVariables = serializeFetchParameter(body.variables, "Variables map");
        }
        catch (parseError) {
            return { parseError: parseError };
        }
        addQueryParam("variables", serializedVariables);
    }
    if (body.extensions) {
        var serializedExtensions = void 0;
        try {
            serializedExtensions = serializeFetchParameter(body.extensions, "Extensions map");
        }
        catch (parseError) {
            return { parseError: parseError };
        }
        addQueryParam("extensions", serializedExtensions);
    }
    // Reconstruct the URI with added query params.
    // XXX This assumes that the URI is well-formed and that it doesn't
    //     already contain any of these query params. We could instead use the
    //     URL API and take a polyfill (whatwg-url@6) for older browsers that
    //     don't support URLSearchParams. Note that some browsers (and
    //     versions of whatwg-url) support URL but not URLSearchParams!
    var fragment = "", preFragment = chosenURI;
    var fragmentStart = chosenURI.indexOf("#");
    if (fragmentStart !== -1) {
        fragment = chosenURI.substr(fragmentStart);
        preFragment = chosenURI.substr(0, fragmentStart);
    }
    var queryParamsPrefix = preFragment.indexOf("?") === -1 ? "?" : "&";
    var newURI = preFragment + queryParamsPrefix + queryParams.join("&") + fragment;
    return { newURI: newURI };
}
//# sourceMappingURL=rewriteURIForGET.js.map