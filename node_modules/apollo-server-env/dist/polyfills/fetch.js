"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Headers = exports.Response = exports.Request = exports.fetch = void 0;
var node_fetch_1 = require("node-fetch");
Object.defineProperty(exports, "fetch", { enumerable: true, get: function () { return __importDefault(node_fetch_1).default; } });
Object.defineProperty(exports, "Request", { enumerable: true, get: function () { return node_fetch_1.Request; } });
Object.defineProperty(exports, "Response", { enumerable: true, get: function () { return node_fetch_1.Response; } });
Object.defineProperty(exports, "Headers", { enumerable: true, get: function () { return node_fetch_1.Headers; } });
//# sourceMappingURL=fetch.js.map