"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
module.exports = promiseIterator;
function promiseIterator(promise) {
    var resolved = false;
    var iterator = {
        next: function next() {
            if (resolved) return Promise.resolve({
                value: undefined,
                done: true
            });
            resolved = true;
            return new Promise(function(resolve, reject) {
                promise.then(function(value) {
                    resolve({
                        value: value,
                        done: false
                    });
                }).catch(reject);
            });
        }
    };
    if (hasIterator) {
        iterator[Symbol.asyncIterator] = function() {
            return this;
        };
    }
    return iterator;
} /* c8 ignore stop */ 
var hasIterator = typeof Symbol !== "undefined" && Symbol.asyncIterator;
