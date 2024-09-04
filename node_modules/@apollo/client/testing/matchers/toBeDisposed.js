import { assertWrappedQueryRef, unwrapQueryRef, } from "../../react/internal/index.js";
export var toBeDisposed = function (_queryRef) {
    var _this = this;
    var hint = this.utils.matcherHint("toBeDisposed", "queryRef", "", {
        isNot: this.isNot,
    });
    var queryRef = _queryRef;
    assertWrappedQueryRef(queryRef);
    var pass = unwrapQueryRef(queryRef).disposed;
    return {
        pass: pass,
        message: function () {
            return "".concat(hint, "\n\nExpected queryRef ").concat(_this.isNot ? "not " : "", "to be disposed, but it was").concat(_this.isNot ? "" : " not", ".");
        },
    };
};
//# sourceMappingURL=toBeDisposed.js.map