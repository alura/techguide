"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCancelToResponseStream = void 0;
const utils_1 = require("@graphql-tools/utils");
function addCancelToResponseStream(resultStream, controller) {
    return (0, utils_1.withCancel)(resultStream, () => {
        if (!controller.signal.aborted) {
            controller.abort();
        }
    });
}
exports.addCancelToResponseStream = addCancelToResponseStream;
