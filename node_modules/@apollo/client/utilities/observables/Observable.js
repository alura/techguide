import { Observable } from "zen-observable-ts";
// This simplified polyfill attempts to follow the ECMAScript Observable
// proposal (https://github.com/zenparsing/es-observable)
import "symbol-observable";
// The zen-observable package defines Observable.prototype[Symbol.observable]
// when Symbol is supported, but RxJS interop depends on also setting this fake
// '@@observable' string as a polyfill for Symbol.observable.
var prototype = Observable.prototype;
var fakeObsSymbol = "@@observable";
if (!prototype[fakeObsSymbol]) {
    // @ts-expect-error
    prototype[fakeObsSymbol] = function () {
        return this;
    };
}
export { Observable };
//# sourceMappingURL=Observable.js.map