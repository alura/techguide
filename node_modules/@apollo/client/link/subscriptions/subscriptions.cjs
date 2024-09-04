'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var utilities = require('../../utilities');
var core = require('../core');
var errors = require('../../errors');

function isLikeCloseEvent(val) {
    return utilities.isNonNullObject(val) && "code" in val && "reason" in val;
}
function isLikeErrorEvent(err) {
    var _a;
    return utilities.isNonNullObject(err) && ((_a = err.target) === null || _a === void 0 ? void 0 : _a.readyState) === WebSocket.CLOSED;
}
var GraphQLWsLink =  (function (_super) {
    tslib.__extends(GraphQLWsLink, _super);
    function GraphQLWsLink(client) {
        var _this = _super.call(this) || this;
        _this.client = client;
        return _this;
    }
    GraphQLWsLink.prototype.request = function (operation) {
        var _this = this;
        return new utilities.Observable(function (observer) {
            return _this.client.subscribe(tslib.__assign(tslib.__assign({}, operation), { query: utilities.print(operation.query) }), {
                next: observer.next.bind(observer),
                complete: observer.complete.bind(observer),
                error: function (err) {
                    if (err instanceof Error) {
                        return observer.error(err);
                    }
                    var likeClose = isLikeCloseEvent(err);
                    if (likeClose || isLikeErrorEvent(err)) {
                        return observer.error(
                        new Error("Socket closed".concat(likeClose ? " with event ".concat(err.code) : "").concat(likeClose ? " ".concat(err.reason) : "")));
                    }
                    return observer.error(new errors.ApolloError({
                        graphQLErrors: Array.isArray(err) ? err : [err],
                    }));
                },
            });
        });
    };
    return GraphQLWsLink;
}(core.ApolloLink));

exports.GraphQLWsLink = GraphQLWsLink;
//# sourceMappingURL=subscriptions.cjs.map
