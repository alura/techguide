import type { Observer, Subscriber } from "./Observable.js";
import { Observable } from "./Observable.js";
type MaybeAsync<T> = T | PromiseLike<T>;
type Source<T> = MaybeAsync<Observable<T>>;
export type ConcastSourcesIterable<T> = Iterable<Source<T>>;
export type ConcastSourcesArray<T> = Array<Source<T>>;
export declare class Concast<T> extends Observable<T> {
    private observers;
    private sub?;
    constructor(sources: MaybeAsync<ConcastSourcesIterable<T>> | Subscriber<T>);
    private sources;
    private start;
    private deliverLastMessage;
    addObserver(observer: Observer<T>): void;
    removeObserver(observer: Observer<T>): void;
    private resolve;
    private reject;
    readonly promise: Promise<T | undefined>;
    private latest?;
    private handlers;
    private nextResultListeners;
    private notify;
    beforeNext(callback: NextResultListener): void;
    cancel: (reason: any) => void;
}
type NextResultListener = (method: "next" | "error" | "complete", arg?: any) => any;
export {};
//# sourceMappingURL=Concast.d.ts.map