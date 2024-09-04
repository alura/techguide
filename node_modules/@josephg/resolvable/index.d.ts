export declare type Resolvable<T> = Promise<T> & {
    resolve: (t: T) => void;
    reject: (e: any) => void;
};
declare const resolvablePromise: <T = void>() => Resolvable<T>;
export default resolvablePromise;
