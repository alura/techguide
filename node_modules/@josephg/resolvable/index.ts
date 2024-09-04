export type Resolvable<T> = Promise<T> & {
  resolve: (t: T) => void,
  reject: (e: any) => void,
}
const resolvablePromise = <T = void>(): Resolvable<T> => {
  let resolve: (val: T) => void
  let reject: (err: any) => void
  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  }) as Resolvable<T>
  promise.resolve = resolve!
  promise.reject = reject!
  return promise
}
export default resolvablePromise
module.exports = resolvablePromise
