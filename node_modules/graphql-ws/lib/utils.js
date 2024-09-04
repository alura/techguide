"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.limitCloseReason = exports.areGraphQLErrors = exports.isAsyncGenerator = exports.isAsyncIterable = exports.isObject = exports.extendedTypeof = void 0;
/** @private */
function extendedTypeof(val) {
    if (val === null) {
        return 'null';
    }
    if (Array.isArray(val)) {
        return 'array';
    }
    return typeof val;
}
exports.extendedTypeof = extendedTypeof;
/** @private */
function isObject(val) {
    return extendedTypeof(val) === 'object';
}
exports.isObject = isObject;
/** @private */
function isAsyncIterable(val) {
    return typeof Object(val)[Symbol.asyncIterator] === 'function';
}
exports.isAsyncIterable = isAsyncIterable;
/** @private */
function isAsyncGenerator(val) {
    return (isObject(val) &&
        typeof Object(val)[Symbol.asyncIterator] === 'function' &&
        typeof val.return === 'function'
    // for lazy ones, we only need the return anyway
    // typeof val.throw === 'function' &&
    // typeof val.next === 'function'
    );
}
exports.isAsyncGenerator = isAsyncGenerator;
/** @private */
function areGraphQLErrors(obj) {
    return (Array.isArray(obj) &&
        // must be at least one error
        obj.length > 0 &&
        // error has at least a message
        obj.every((ob) => 'message' in ob));
}
exports.areGraphQLErrors = areGraphQLErrors;
/**
 * Limits the WebSocket close event reason to not exceed a length of one frame.
 * Reference: https://datatracker.ietf.org/doc/html/rfc6455#section-5.2.
 *
 * @private
 */
function limitCloseReason(reason, whenTooLong) {
    return reason.length < 124 ? reason : whenTooLong;
}
exports.limitCloseReason = limitCloseReason;
