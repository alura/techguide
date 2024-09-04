// This file is adapted from the graphql-ws npm package:
// https://github.com/enisdenjo/graphql-ws
//
// Most of the file comes from that package's README; some other parts (such as
// isLikeCloseEvent) come from its source.
//
// Here's the license of the original code:
//
// The MIT License (MIT)
//
// Copyright (c) 2020-2021 Denis Badurina
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
import { __assign, __extends } from "tslib";
import { print } from "../../utilities/index.js";
import { ApolloLink } from "../core/index.js";
import { isNonNullObject, Observable } from "../../utilities/index.js";
import { ApolloError } from "../../errors/index.js";
// https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/close_event
function isLikeCloseEvent(val) {
    return isNonNullObject(val) && "code" in val && "reason" in val;
}
// https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/error_event
function isLikeErrorEvent(err) {
    var _a;
    return isNonNullObject(err) && ((_a = err.target) === null || _a === void 0 ? void 0 : _a.readyState) === WebSocket.CLOSED;
}
var GraphQLWsLink = /** @class */ (function (_super) {
    __extends(GraphQLWsLink, _super);
    function GraphQLWsLink(client) {
        var _this = _super.call(this) || this;
        _this.client = client;
        return _this;
    }
    GraphQLWsLink.prototype.request = function (operation) {
        var _this = this;
        return new Observable(function (observer) {
            return _this.client.subscribe(__assign(__assign({}, operation), { query: print(operation.query) }), {
                next: observer.next.bind(observer),
                complete: observer.complete.bind(observer),
                error: function (err) {
                    if (err instanceof Error) {
                        return observer.error(err);
                    }
                    var likeClose = isLikeCloseEvent(err);
                    if (likeClose || isLikeErrorEvent(err)) {
                        return observer.error(
                        // reason will be available on clean closes
                        new Error("Socket closed".concat(likeClose ? " with event ".concat(err.code) : "").concat(likeClose ? " ".concat(err.reason) : "")));
                    }
                    return observer.error(new ApolloError({
                        graphQLErrors: Array.isArray(err) ? err : [err],
                    }));
                },
            });
        });
    };
    return GraphQLWsLink;
}(ApolloLink));
export { GraphQLWsLink };
//# sourceMappingURL=index.js.map