import { __extends } from "tslib";
import { ApolloLink } from "../core/index.js";
import { OperationBatcher } from "./batching.js";
export { OperationBatcher } from "./batching.js";
var BatchLink = /** @class */ (function (_super) {
    __extends(BatchLink, _super);
    function BatchLink(fetchParams) {
        var _this = _super.call(this) || this;
        var _a = fetchParams || {}, batchDebounce = _a.batchDebounce, _b = _a.batchInterval, batchInterval = _b === void 0 ? 10 : _b, _c = _a.batchMax, batchMax = _c === void 0 ? 0 : _c, _d = _a.batchHandler, batchHandler = _d === void 0 ? function () { return null; } : _d, _e = _a.batchKey, batchKey = _e === void 0 ? function () { return ""; } : _e;
        _this.batcher = new OperationBatcher({
            batchDebounce: batchDebounce,
            batchInterval: batchInterval,
            batchMax: batchMax,
            batchHandler: batchHandler,
            batchKey: batchKey,
        });
        //make this link terminating
        if (fetchParams.batchHandler.length <= 1) {
            _this.request = function (operation) { return _this.batcher.enqueueRequest({ operation: operation }); };
        }
        return _this;
    }
    BatchLink.prototype.request = function (operation, forward) {
        return this.batcher.enqueueRequest({
            operation: operation,
            forward: forward,
        });
    };
    return BatchLink;
}(ApolloLink));
export { BatchLink };
//# sourceMappingURL=batchLink.js.map