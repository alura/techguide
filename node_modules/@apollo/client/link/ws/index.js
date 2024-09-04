import { __extends } from "tslib";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { ApolloLink } from "../core/index.js";
var WebSocketLink = /** @class */ (function (_super) {
    __extends(WebSocketLink, _super);
    function WebSocketLink(paramsOrClient) {
        var _this = _super.call(this) || this;
        if (paramsOrClient instanceof SubscriptionClient) {
            _this.subscriptionClient = paramsOrClient;
        }
        else {
            _this.subscriptionClient = new SubscriptionClient(paramsOrClient.uri, paramsOrClient.options, paramsOrClient.webSocketImpl);
        }
        return _this;
    }
    WebSocketLink.prototype.request = function (operation) {
        return this.subscriptionClient.request(operation);
    };
    return WebSocketLink;
}(ApolloLink));
export { WebSocketLink };
//# sourceMappingURL=index.js.map