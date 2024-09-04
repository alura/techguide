export var throwServerError = function (response, result, message) {
    var error = new Error(message);
    error.name = "ServerError";
    error.response = response;
    error.statusCode = response.status;
    error.result = result;
    throw error;
};
//# sourceMappingURL=throwServerError.js.map