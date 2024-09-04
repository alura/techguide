import { invariant } from "../../utilities/globals/index.js";
export function toPromise(observable) {
    var completed = false;
    return new Promise(function (resolve, reject) {
        observable.subscribe({
            next: function (data) {
                if (completed) {
                    globalThis.__DEV__ !== false && invariant.warn(42);
                }
                else {
                    completed = true;
                    resolve(data);
                }
            },
            error: reject,
        });
    });
}
//# sourceMappingURL=toPromise.js.map