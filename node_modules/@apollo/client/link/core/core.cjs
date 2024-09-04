'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var globals = require('../../utilities/globals');
var utilities = require('../../utilities');
var utils = require('../utils');

function passthrough(op, forward) {
    return (forward ? forward(op) : utilities.Observable.of());
}
function toLink(handler) {
    return typeof handler === "function" ? new ApolloLink(handler) : handler;
}
function isTerminating(link) {
    return link.request.length <= 1;
}
var ApolloLink =  (function () {
    function ApolloLink(request) {
        if (request)
            this.request = request;
    }
    ApolloLink.empty = function () {
        return new ApolloLink(function () { return utilities.Observable.of(); });
    };
    ApolloLink.from = function (links) {
        if (links.length === 0)
            return ApolloLink.empty();
        return links.map(toLink).reduce(function (x, y) { return x.concat(y); });
    };
    ApolloLink.split = function (test, left, right) {
        var leftLink = toLink(left);
        var rightLink = toLink(right || new ApolloLink(passthrough));
        var ret;
        if (isTerminating(leftLink) && isTerminating(rightLink)) {
            ret = new ApolloLink(function (operation) {
                return test(operation) ?
                    leftLink.request(operation) || utilities.Observable.of()
                    : rightLink.request(operation) || utilities.Observable.of();
            });
        }
        else {
            ret = new ApolloLink(function (operation, forward) {
                return test(operation) ?
                    leftLink.request(operation, forward) || utilities.Observable.of()
                    : rightLink.request(operation, forward) || utilities.Observable.of();
            });
        }
        return Object.assign(ret, { left: leftLink, right: rightLink });
    };
    ApolloLink.execute = function (link, operation) {
        return (link.request(utils.createOperation(operation.context, utils.transformOperation(utils.validateOperation(operation)))) || utilities.Observable.of());
    };
    ApolloLink.concat = function (first, second) {
        var firstLink = toLink(first);
        if (isTerminating(firstLink)) {
            globalThis.__DEV__ !== false && globals.invariant.warn(35, firstLink);
            return firstLink;
        }
        var nextLink = toLink(second);
        var ret;
        if (isTerminating(nextLink)) {
            ret = new ApolloLink(function (operation) {
                return firstLink.request(operation, function (op) { return nextLink.request(op) || utilities.Observable.of(); }) || utilities.Observable.of();
            });
        }
        else {
            ret = new ApolloLink(function (operation, forward) {
                return (firstLink.request(operation, function (op) {
                    return nextLink.request(op, forward) || utilities.Observable.of();
                }) || utilities.Observable.of());
            });
        }
        return Object.assign(ret, { left: firstLink, right: nextLink });
    };
    ApolloLink.prototype.split = function (test, left, right) {
        return this.concat(ApolloLink.split(test, left, right || new ApolloLink(passthrough)));
    };
    ApolloLink.prototype.concat = function (next) {
        return ApolloLink.concat(this, next);
    };
    ApolloLink.prototype.request = function (operation, forward) {
        throw globals.newInvariantError(36);
    };
    ApolloLink.prototype.onError = function (error, observer) {
        if (observer && observer.error) {
            observer.error(error);
            return false;
        }
        throw error;
    };
    ApolloLink.prototype.setOnError = function (fn) {
        this.onError = fn;
        return this;
    };
    return ApolloLink;
}());

var empty = ApolloLink.empty;

var from = ApolloLink.from;

var split = ApolloLink.split;

var concat = ApolloLink.concat;

var execute = ApolloLink.execute;

exports.ApolloLink = ApolloLink;
exports.concat = concat;
exports.empty = empty;
exports.execute = execute;
exports.from = from;
exports.split = split;
//# sourceMappingURL=core.cjs.map
