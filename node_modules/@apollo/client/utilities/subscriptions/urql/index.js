import { Observable } from "../../index.js";
import { handleError, readMultipartBody, } from "../../../link/http/parseAndCheckHttpResponse.js";
import { maybe } from "../../index.js";
import { serializeFetchParameter } from "../../../core/index.js";
import { generateOptionsForMultipartSubscription } from "../shared.js";
var backupFetch = maybe(function () { return fetch; });
export function createFetchMultipartSubscription(uri, _a) {
    var _b = _a === void 0 ? {} : _a, preferredFetch = _b.fetch, headers = _b.headers;
    return function multipartSubscriptionForwarder(_a) {
        var query = _a.query, variables = _a.variables;
        var body = { variables: variables, query: query };
        var options = generateOptionsForMultipartSubscription(headers || {});
        return new Observable(function (observer) {
            try {
                options.body = serializeFetchParameter(body, "Payload");
            }
            catch (parseError) {
                observer.error(parseError);
            }
            var currentFetch = preferredFetch || maybe(function () { return fetch; }) || backupFetch;
            var observerNext = observer.next.bind(observer);
            currentFetch(uri, options)
                .then(function (response) {
                var _a;
                var ctype = (_a = response.headers) === null || _a === void 0 ? void 0 : _a.get("content-type");
                if (ctype !== null && /^multipart\/mixed/i.test(ctype)) {
                    return readMultipartBody(response, observerNext);
                }
                observer.error(new Error("Expected multipart response"));
            })
                .then(function () {
                observer.complete();
            })
                .catch(function (err) {
                handleError(err, observer);
            });
        });
    };
}
//# sourceMappingURL=index.js.map