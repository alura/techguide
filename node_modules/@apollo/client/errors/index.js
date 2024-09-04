import { __extends, __spreadArray } from "tslib";
import "../utilities/globals/index.js";
import { isNonNullObject } from "../utilities/index.js";
// This Symbol allows us to pass transport-specific errors from the link chain
// into QueryManager/client internals without risking a naming collision within
// extensions (which implementers can use as they see fit).
export var PROTOCOL_ERRORS_SYMBOL = Symbol();
export function graphQLResultHasProtocolErrors(result) {
    if (result.extensions) {
        return Array.isArray(result.extensions[PROTOCOL_ERRORS_SYMBOL]);
    }
    return false;
}
export function isApolloError(err) {
    return err.hasOwnProperty("graphQLErrors");
}
// Sets the error message on this error according to the
// the GraphQL and network errors that are present.
// If the error message has already been set through the
// constructor or otherwise, this function is a nop.
var generateErrorMessage = function (err) {
    var errors = __spreadArray(__spreadArray(__spreadArray([], err.graphQLErrors, true), err.clientErrors, true), err.protocolErrors, true);
    if (err.networkError)
        errors.push(err.networkError);
    return (errors
        // The rest of the code sometimes unsafely types non-Error objects as GraphQLErrors
        .map(function (err) {
        return (isNonNullObject(err) && err.message) || "Error message not found.";
    })
        .join("\n"));
};
var ApolloError = /** @class */ (function (_super) {
    __extends(ApolloError, _super);
    // Constructs an instance of ApolloError given a GraphQLError
    // or a network error. Note that one of these has to be a valid
    // value or the constructed error will be meaningless.
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
        // We're not using `Object.setPrototypeOf` here as it isn't fully
        // supported on Android (see issue #3236).
        _this.__proto__ = ApolloError.prototype;
        return _this;
    }
    return ApolloError;
}(Error));
export { ApolloError };
//# sourceMappingURL=index.js.map