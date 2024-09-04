"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.URLSearchParams = exports.URL = exports.Headers = exports.Response = exports.Request = exports.fetch = void 0;
if (!global) {
    global = self;
}
let { fetch, Request, Response, Headers, URL, URLSearchParams } = global;
exports.fetch = fetch;
exports.Request = Request;
exports.Response = Response;
exports.Headers = Headers;
exports.URL = URL;
exports.URLSearchParams = URLSearchParams;
exports.fetch = fetch = fetch.bind(global);
if (!global.process) {
    global.process = {};
}
if (!global.process.env) {
    global.process.env = {
        NODE_ENV: typeof app !== 'undefined' ? app.env : 'production',
    };
}
if (!global.process.version) {
    global.process.version = '';
}
if (!global.process.hrtime) {
    global.process.hrtime = function hrtime(previousTimestamp) {
        var clockTime = Date.now() * 1e-3;
        var seconds = Math.floor(clockTime);
        var nanoseconds = Math.floor((clockTime % 1) * 1e9);
        if (previousTimestamp) {
            seconds = seconds - previousTimestamp[0];
            nanoseconds = nanoseconds - previousTimestamp[1];
            if (nanoseconds < 0) {
                seconds--;
                nanoseconds += 1e9;
            }
        }
        return [seconds, nanoseconds];
    };
}
if (!global.os) {
    global.os = {};
}
//# sourceMappingURL=index.browser.js.map