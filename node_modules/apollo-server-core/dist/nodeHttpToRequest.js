"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertNodeHttpToRequest = void 0;
const apollo_server_env_1 = require("apollo-server-env");
function convertNodeHttpToRequest(req) {
    const headers = new apollo_server_env_1.Headers();
    Object.keys(req.headers).forEach((key) => {
        const values = req.headers[key];
        if (Array.isArray(values)) {
            values.forEach((value) => headers.append(key, value));
        }
        else {
            headers.append(key, values);
        }
    });
    return new apollo_server_env_1.Request(req.url, {
        headers,
        method: req.method,
    });
}
exports.convertNodeHttpToRequest = convertNodeHttpToRequest;
//# sourceMappingURL=nodeHttpToRequest.js.map