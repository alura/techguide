import * as React from "rehackt";
import { equal } from "@wry/equality";
export function useDeepMemo(memoFn, deps) {
    var ref = React.useRef();
    if (!ref.current || !equal(ref.current.deps, deps)) {
        ref.current = { value: memoFn(), deps: deps };
    }
    return ref.current.value;
}
//# sourceMappingURL=useDeepMemo.js.map