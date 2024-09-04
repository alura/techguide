import type { Observable } from "../../utilities/index.js";
interface TakeOptions {
    timeout?: number;
}
type ObservableEvent<T> = {
    type: "next";
    value: T;
} | {
    type: "error";
    error: any;
} | {
    type: "complete";
};
declare class IteratorStream<T> {
    private iterator;
    constructor(iterator: AsyncGenerator<T, void, unknown>);
    take({ timeout }?: TakeOptions): Promise<T>;
}
export declare class ObservableStream<T> extends IteratorStream<ObservableEvent<T>> {
    constructor(observable: Observable<T>);
    takeNext(options?: TakeOptions): Promise<T>;
    takeError(options?: TakeOptions): Promise<any>;
    takeComplete(options?: TakeOptions): Promise<void>;
}
export {};
//# sourceMappingURL=ObservableStream.d.ts.map