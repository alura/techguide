import { Slot } from "./slot.js";
export { Slot }
export const { bind, noContext } = Slot;

// Relying on the @types/node declaration of global.setTimeout can make
// things tricky for dowstream projects (see PR #7).
declare function setTimeout(
  callback: (...args: any[]) => any,
  ms?: number,
  ...args: any[]
): any;

// Like global.setTimeout, except the callback runs with captured context.
export { setTimeoutWithContext as setTimeout };
function setTimeoutWithContext(callback: () => any, delay: number) {
  return setTimeout(bind(callback), delay);
}

// Turn any generator function into an async function (using yield instead
// of await), with context automatically preserved across yields.
export function asyncFromGen<
  TArgs extends any[],
  TYield = any,
  TReturn = any,
  TNext = any,
>(
  genFn: (...args: TArgs) => Generator<TYield, TReturn, TNext>
) {
  return function (this: any) {
    const gen = genFn.apply(this, arguments as any);

    type Method = (
      this: Generator<TYield, TReturn, TNext>,
      arg: any,
    ) => IteratorResult<TYield, TReturn>;

    const boundNext: Method = bind(gen.next);
    const boundThrow: Method = bind(gen.throw!);

    return new Promise((resolve, reject) => {
      function invoke(method: Method, argument: any) {
        try {
          var result: any = method.call(gen, argument);
        } catch (error) {
          return reject(error);
        }
        const next = result.done ? resolve : invokeNext;
        if (isPromiseLike(result.value)) {
          result.value.then(next, result.done ? reject : invokeThrow);
        } else {
          next(result.value);
        }
      }
      const invokeNext = (value?: any) => invoke(boundNext, value);
      const invokeThrow = (error: any) => invoke(boundThrow, error);
      invokeNext();
    });
  } as (...args: TArgs) => Promise<any>;
}

function isPromiseLike(value: any): value is PromiseLike<any> {
  return value && typeof value.then === "function";
}

// If you use the fibers npm package to implement coroutines in Node.js,
// you should call this function at least once to ensure context management
// remains coherent across any yields.
const wrappedFibers: Function[] = [];
export function wrapYieldingFiberMethods<F extends Function>(Fiber: F): F {
  // There can be only one implementation of Fiber per process, so this array
  // should never grow longer than one element.
  if (wrappedFibers.indexOf(Fiber) < 0) {
    const wrap = (obj: any, method: string) => {
      const fn = obj[method];
      obj[method] = function () {
        return noContext(fn, arguments as any, this);
      };
    }
    // These methods can yield, according to
    // https://github.com/laverdet/node-fibers/blob/ddebed9b8ae3883e57f822e2108e6943e5c8d2a8/fibers.js#L97-L100
    wrap(Fiber, "yield");
    wrap(Fiber.prototype, "run");
    wrap(Fiber.prototype, "throwInto");
    wrappedFibers.push(Fiber);
  }
  return Fiber;
}
