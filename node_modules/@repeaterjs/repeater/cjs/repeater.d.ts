/** An error subclass which is thrown when there are too many pending push or next operations on a single repeater. */
export declare class RepeaterOverflowError extends Error {
    constructor(message: string);
}
/*** BUFFERS ***/
/** A special queue interface which allow multiple values to be pushed onto a repeater without having pushes wait or throw overflow errors, passed as the second argument to the repeater constructor. */
export interface RepeaterBuffer<TValue = unknown> {
    empty: boolean;
    full: boolean;
    add(value: TValue): unknown;
    remove(): TValue;
}
/** A buffer which allows you to push a set amount of values to the repeater without pushes waiting or throwing errors. */
export declare class FixedBuffer implements RepeaterBuffer {
    _c: number;
    _q: Array<unknown>;
    constructor(capacity: number);
    get empty(): boolean;
    get full(): boolean;
    add(value: unknown): void;
    remove(): unknown;
}
/** Sliding buffers allow you to push a set amount of values to the repeater without pushes waiting or throwing errors. If the number of values exceeds the capacity set in the constructor, the buffer will discard the earliest values added. */
export declare class SlidingBuffer implements RepeaterBuffer {
    _c: number;
    _q: Array<unknown>;
    constructor(capacity: number);
    get empty(): boolean;
    get full(): boolean;
    add(value: unknown): void;
    remove(): unknown;
}
/** Dropping buffers allow you to push a set amount of values to the repeater without the push function waiting or throwing errors. If the number of values exceeds the capacity set in the constructor, the buffer will discard the latest values added. */
export declare class DroppingBuffer implements RepeaterBuffer {
    _c: number;
    _q: Array<unknown>;
    constructor(capacity: number);
    get empty(): boolean;
    get full(): boolean;
    add(value: unknown): void;
    remove(): unknown;
}
/*** TYPES ***/
/** The type of the first argument passed to the executor callback. */
export declare type Push<T, TNext = unknown> = (value: PromiseLike<T> | T) => Promise<TNext | undefined>;
/** The type of the second argument passed to the executor callback. A callable promise. */
export declare type Stop = ((err?: unknown) => undefined) & Promise<undefined>;
/** The type of the callback passed to the Repeater constructor. */
export declare type RepeaterExecutor<T, TReturn = any, TNext = unknown> = (push: Push<T, TNext>, stop: Stop) => PromiseLike<TReturn> | TReturn;
/** The maximum number of push or next operations which may exist on a single repeater. */
export declare const MAX_QUEUE_LENGTH = 1024;
export declare class Repeater<T, TReturn = any, TNext = unknown> {
    constructor(executor: RepeaterExecutor<T, TReturn, TNext>, buffer?: RepeaterBuffer | undefined);
    next(value?: PromiseLike<TNext> | TNext): Promise<IteratorResult<T, TReturn>>;
    return(value?: PromiseLike<TReturn> | TReturn): Promise<IteratorResult<T, TReturn>>;
    throw(err: unknown): Promise<IteratorResult<T, TReturn>>;
    [Symbol.asyncIterator](): this;
    static race: typeof race;
    static merge: typeof merge;
    static zip: typeof zip;
    static latest: typeof latest;
}
declare function race<T>(contenders: Iterable<T>): Repeater<T extends AsyncIterable<infer U> | Iterable<infer U> ? U extends PromiseLike<infer V> ? V : U : never>;
declare function merge<T>(contenders: Iterable<T>): Repeater<T extends AsyncIterable<infer U> | Iterable<infer U> ? U extends PromiseLike<infer V> ? V : U : T extends PromiseLike<infer U> ? U : T>;
declare type Contender<T> = AsyncIterable<Promise<T> | T> | Iterable<Promise<T> | T> | PromiseLike<T> | T;
declare function zip(contenders: []): Repeater<never>;
declare function zip<T>(contenders: Iterable<Contender<T>>): Repeater<[T]>;
declare function zip<T1, T2>(contenders: [Contender<T1>, Contender<T2>]): Repeater<[T1, T2]>;
declare function zip<T1, T2, T3>(contenders: [Contender<T1>, Contender<T2>, Contender<T3>]): Repeater<[T1, T2, T3]>;
declare function zip<T1, T2, T3, T4>(contenders: [Contender<T1>, Contender<T2>, Contender<T3>, Contender<T4>]): Repeater<[T1, T2, T3, T4]>;
declare function zip<T1, T2, T3, T4, T5>(contenders: [Contender<T1>, Contender<T2>, Contender<T3>, Contender<T4>, Contender<T5>]): Repeater<[T1, T2, T3, T4, T5]>;
declare function zip<T1, T2, T3, T4, T5, T6>(contenders: [Contender<T1>, Contender<T2>, Contender<T3>, Contender<T4>, Contender<T5>, Contender<T6>]): Repeater<[T1, T2, T3, T4, T5, T6]>;
declare function zip<T1, T2, T3, T4, T5, T6, T7>(contenders: [Contender<T1>, Contender<T2>, Contender<T3>, Contender<T4>, Contender<T5>, Contender<T6>, Contender<T7>]): Repeater<[T1, T2, T3, T4, T5, T6, T7]>;
declare function zip<T1, T2, T3, T4, T5, T6, T7, T8>(contenders: [Contender<T1>, Contender<T2>, Contender<T3>, Contender<T4>, Contender<T5>, Contender<T6>, Contender<T7>, Contender<T8>]): Repeater<[T1, T2, T3, T4, T5, T6, T7, T8]>;
declare function zip<T1, T2, T3, T4, T5, T6, T7, T8, T9>(contenders: [Contender<T1>, Contender<T2>, Contender<T3>, Contender<T4>, Contender<T5>, Contender<T6>, Contender<T7>, Contender<T8>, Contender<T9>]): Repeater<[T1, T2, T3, T4, T5, T6, T7, T8, T9]>;
declare function zip<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(contenders: [Contender<T1>, Contender<T2>, Contender<T3>, Contender<T4>, Contender<T5>, Contender<T6>, Contender<T7>, Contender<T8>, Contender<T9>, Contender<T10>]): Repeater<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10]>;
declare function latest(contenders: []): Repeater<never>;
declare function latest<T>(contenders: Iterable<Contender<T>>): Repeater<[T]>;
declare function latest<T1, T2>(contenders: [Contender<T1>, Contender<T2>]): Repeater<[T1, T2]>;
declare function latest<T1, T2, T3>(contenders: [Contender<T1>, Contender<T2>, Contender<T3>]): Repeater<[T1, T2, T3]>;
declare function latest<T1, T2, T3, T4>(contenders: [Contender<T1>, Contender<T2>, Contender<T3>, Contender<T4>]): Repeater<[T1, T2, T3, T4]>;
declare function latest<T1, T2, T3, T4, T5>(contenders: [Contender<T1>, Contender<T2>, Contender<T3>, Contender<T4>, Contender<T5>]): Repeater<[T1, T2, T3, T4, T5]>;
declare function latest<T1, T2, T3, T4, T5, T6>(contenders: [Contender<T1>, Contender<T2>, Contender<T3>, Contender<T4>, Contender<T5>, Contender<T6>]): Repeater<[T1, T2, T3, T4, T5, T6]>;
declare function latest<T1, T2, T3, T4, T5, T6, T7>(contenders: [Contender<T1>, Contender<T2>, Contender<T3>, Contender<T4>, Contender<T5>, Contender<T6>, Contender<T7>]): Repeater<[T1, T2, T3, T4, T5, T6, T7]>;
declare function latest<T1, T2, T3, T4, T5, T6, T7, T8>(contenders: [Contender<T1>, Contender<T2>, Contender<T3>, Contender<T4>, Contender<T5>, Contender<T6>, Contender<T7>, Contender<T8>]): Repeater<[T1, T2, T3, T4, T5, T6, T7, T8]>;
declare function latest<T1, T2, T3, T4, T5, T6, T7, T8, T9>(contenders: [Contender<T1>, Contender<T2>, Contender<T3>, Contender<T4>, Contender<T5>, Contender<T6>, Contender<T7>, Contender<T8>, Contender<T9>]): Repeater<[T1, T2, T3, T4, T5, T6, T7, T8, T9]>;
declare function latest<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(contenders: [Contender<T1>, Contender<T2>, Contender<T3>, Contender<T4>, Contender<T5>, Contender<T6>, Contender<T7>, Contender<T8>, Contender<T9>, Contender<T10>]): Repeater<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10]>;
export {};
