import { Observable } from "../../utilities/index.js";
export function fromError(errorValue) {
    return new Observable(function (observer) {
        observer.error(errorValue);
    });
}
//# sourceMappingURL=fromError.js.map