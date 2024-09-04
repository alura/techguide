import * as React from "rehackt";
var INIT = {};
export function useLazyRef(getInitialValue) {
    var ref = React.useRef(INIT);
    if (ref.current === INIT) {
        ref.current = getInitialValue();
    }
    return ref;
}
//# sourceMappingURL=useLazyRef.js.map