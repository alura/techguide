import { Observable } from "relay-runtime";
import { handleError, readMultipartBody, } from "../../../link/http/parseAndCheckHttpResponse.js";
import { maybe } from "../../index.js";
import { serializeFetchParameter } from "../../../core/index.js";
import { generateOptionsForMultipartSubscription } from "../shared.js";
var backupFetch = maybe(function () { return fetch; });
export function createFetchMultipartSubscription(uri, _a) {
    var _b = _a === void 0 ? {} : _a, preferredFetch = _b.fetch, headers = _b.headers;
    return function fetchMultipartSubscription(operation, variables) {
        var body = {
            operationName: operation.name,
            variables: variables,
            query: operation.text || "",
        };
        var options = generateOptionsForMultipartSubscription(headers || {});
        return Observable.create(function (sink) {
            try {
                options.body = serializeFetchParameter(body, "Payload");
            }
            catch (parseError) {
                sink.error(parseError);
            }
            var currentFetch = preferredFetch || maybe(function () { return fetch; }) || backupFetch;
            var observerNext = sink.next.bind(sink);
            currentFetch(uri, options)
                .then(function (response) {
                var _a;
                var ctype = (_a = response.headers) === null || _a === void 0 ? void 0 : _a.get("content-type");
                if (ctype !== null && /^multipart\/mixed/i.test(ctype)) {
                    return readMultipartBody(response, observerNext);
                }
                sink.error(new Error("Expected multipart response"));
            })
                .then(function () {
                sink.complete();
            })
                .catch(function (err) {
                handleError(err, sink);
            });
        });
    };
}
//# sourceMappingURL=index.js.map