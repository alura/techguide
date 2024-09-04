"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const isNodeLike_1 = __importDefault(require("./isNodeLike"));
function default_1(kind) {
    if (isNodeLike_1.default) {
        return module.require('crypto').createHash(kind);
    }
    return require('sha.js')(kind);
}
exports.default = default_1;
//# sourceMappingURL=createSHA.js.map