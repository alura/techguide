'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var subscriptionsTransportWs = require('subscriptions-transport-ws');
var core = require('../core');

var WebSocketLink =  (function (_super) {
    tslib.__extends(WebSocketLink, _super);
    function WebSocketLink(paramsOrClient) {
        var _this = _super.call(this) || this;
        if (paramsOrClient instanceof subscriptionsTransportWs.SubscriptionClient) {
            _this.subscriptionClient = paramsOrClient;
        }
        else {
            _this.subscriptionClient = new subscriptionsTransportWs.SubscriptionClient(paramsOrClient.uri, paramsOrClient.options, paramsOrClient.webSocketImpl);
        }
        return _this;
    }
    WebSocketLink.prototype.request = function (operation) {
        return this.subscriptionClient.request(operation);
    };
    return WebSocketLink;
}(core.ApolloLink));

exports.WebSocketLink = WebSocketLink;
//# sourceMappingURL=ws.cjs.map
