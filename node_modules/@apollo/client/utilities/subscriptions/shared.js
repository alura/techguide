import { __assign } from "tslib";
import { fallbackHttpConfig } from "../../link/http/selectHttpOptionsAndBody.js";
export function generateOptionsForMultipartSubscription(headers) {
    var options = __assign(__assign({}, fallbackHttpConfig.options), { headers: __assign(__assign(__assign({}, (headers || {})), fallbackHttpConfig.headers), { accept: "multipart/mixed;boundary=graphql;subscriptionSpec=1.0,application/json" }) });
    return options;
}
//# sourceMappingURL=shared.js.map