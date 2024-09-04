"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
module.exports = nodeStreamIterator;
function nodeStreamIterator(stream) {
    var onData = function onData(chunk) {
        if (error) return;
        if (waiting.length) return waiting.shift()[0]({
            value: chunk,
            done: false
        });
        data.push(chunk);
    };
    var onError = function onError(err) {
        error = err;
        var all = waiting.slice();
        all.forEach(function(pair) {
            pair[1](err);
        });
        !cleanup || cleanup();
    };
    var onEnd = function onEnd() {
        done = true;
        var all = waiting.slice();
        all.forEach(function(pair) {
            pair[0]({
                value: undefined,
                done: true
            });
        });
        !cleanup || cleanup();
    };
    var getNext = function getNext() {
        return new Promise(function(resolve, reject) {
            if (error) return reject(error);
            if (data.length) return resolve({
                value: data.shift(),
                done: false
            });
            if (done) return resolve({
                value: undefined,
                done: true
            });
            waiting.push([
                resolve,
                reject
            ]);
        });
    };
    var cleanup = null;
    var error = null;
    var done = false;
    var data = [];
    var waiting = [];
    cleanup = function() {
        cleanup = null;
        stream.removeListener("data", onData);
        stream.removeListener("error", onError);
        stream.removeListener("end", onEnd);
        stream.removeListener("finish", onEnd);
        stream.removeListener("close", onEnd);
    };
    stream.on("data", onData);
    stream.on("error", onError);
    stream.on("end", onEnd);
    stream.on("finish", onEnd);
    stream.on("close", onEnd);
    var iterator = {
        next: function next() {
            return getNext();
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
