"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
module.exports = readerIterator;
function readerIterator(reader) {
    var iterator = {
        next: function next() {
            return reader.read();
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
