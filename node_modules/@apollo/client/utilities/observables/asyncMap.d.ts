import { Observable } from "./Observable.js";
export declare function asyncMap<V, R>(observable: Observable<V>, mapFn: (value: V) => R | PromiseLike<R>, catchFn?: (error: any) => R | PromiseLike<R>): Observable<R>;
//# sourceMappingURL=asyncMap.d.ts.map