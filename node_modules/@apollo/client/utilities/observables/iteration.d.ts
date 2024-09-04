import type { Observer } from "./Observable.js";
export declare function iterateObserversSafely<E, A>(observers: Set<Observer<E>>, method: keyof Observer<E>, argument?: A): void;
//# sourceMappingURL=iteration.d.ts.map