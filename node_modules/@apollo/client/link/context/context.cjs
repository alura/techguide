'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var core = require('../core');
var utilities = require('../../utilities');

function setContext(setter) {
    return new core.ApolloLink(function (operation, forward) {
        var request = tslib.__rest(operation, []);
        return new utilities.Observable(function (observer) {
            var handle;
            var closed = false;
            Promise.resolve(request)
                .then(function (req) { return setter(req, operation.getContext()); })
                .then(operation.setContext)
                .then(function () {
                if (closed)
                    return;
                handle = forward(operation).subscribe({
                    next: observer.next.bind(observer),
                    error: observer.error.bind(observer),
                    complete: observer.complete.bind(observer),
                });
            })
                .catch(observer.error.bind(observer));
            return function () {
                closed = true;
                if (handle)
                    handle.unsubscribe();
            };
        });
    });
}

exports.setContext = setContext;
//# sourceMappingURL=context.cjs.map
