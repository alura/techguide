import { __extends } from "tslib";
import { ApolloLink } from "../core/index.js";
import { createHttpLink } from "./createHttpLink.js";
var HttpLink = /** @class */ (function (_super) {
    __extends(HttpLink, _super);
    function HttpLink(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, createHttpLink(options).request) || this;
        _this.options = options;
        return _this;
    }
    return HttpLink;
}(ApolloLink));
export { HttpLink };
//# sourceMappingURL=HttpLink.js.map