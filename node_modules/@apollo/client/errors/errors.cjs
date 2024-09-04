'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
require('../utilities/globals');
var utilities = require('../utilities');

var PROTOCOL_ERRORS_SYMBOL = Symbol();
function graphQLResultHasProtocolErrors(result) {
    if (result.extensions) {
        return Array.isArray(result.extensions[PROTOCOL_ERRORS_SYMBOL]);
    }
    return false;
}
function isApolloError(err) {
    return err.hasOwnProperty("graphQLErrors");
}
var generateErrorMessage = function (err) {
    var errors = tslib.__spreadArray(tslib.__spreadArray(tslib.__spreadArray([], err.graphQLErrors, true), err.clientErrors, true), err.protocolErrors, true);
    if (err.networkError)
        errors.push(err.networkError);
    return (errors
        .map(function (err) {
        return (utilities.isNonNullObject(err) && err.message) || "Error message not found.";
    })
        .join("\n"));
};
var ApolloError =  (function (_super) {
    tslib.__extends(ApolloError, _super);
    function ApolloError(_a) {
        var graphQLErrors = _a.graphQLErrors, protocolErrors = _a.protocolErrors, clientErrors = _a.clientErrors, networkError = _a.networkError, errorMessage = _a.errorMessage, extraInfo = _a.extraInfo;
        var _this = _super.call(this, errorMessage) || this;
        _this.name = "ApolloError";
        _this.graphQLErrors = graphQLErrors || [];
        _this.protocolErrors = protocolErrors || [];
        _this.clientErrors = clientErrors || [];
        _this.networkError = networkError || null;
        _this.message = errorMessage || generateErrorMessage(_this);
        _this.extraInfo = extraInfo;
        _this.__proto__ = ApolloError.prototype;
        return _this;
    }
    return ApolloError;
}(Error));

exports.ApolloError = ApolloError;
exports.PROTOCOL_ERRORS_SYMBOL = PROTOCOL_ERRORS_SYMBOL;
exports.graphQLResultHasProtocolErrors = graphQLResultHasProtocolErrors;
exports.isApolloError = isApolloError;
//# sourceMappingURL=errors.cjs.map
