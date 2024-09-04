import * as assert from "assert";
import { createHash } from "crypto";
import {
  wrap,
  defaultMakeCacheKey,
  OptimisticWrapperFunction,
  CommonCache,
} from "../index";
import { equal } from '@wry/equality';
import { wrapYieldingFiberMethods } from '@wry/context';
import { dep } from "../dep";
import { permutations } from "./test-utils";

type NumThunk = OptimisticWrapperFunction<[], number>;

describe("optimism", function () {
  it("sanity", function () {
    assert.strictEqual(typeof wrap, "function");
    assert.strictEqual(typeof defaultMakeCacheKey, "function");
  });

  it("works with single functions", function () {
    const test = wrap(function (x: string) {
      return x + salt;
    }, {
      makeCacheKey: function (x: string) {
        return x;
      }
    });

    let salt = "salt";
    assert.strictEqual(test("a"), "asalt");

    salt = "NaCl";
    assert.strictEqual(test("a"), "asalt");
    assert.strictEqual(test("b"), "bNaCl");

    test.dirty("a");
    assert.strictEqual(test("a"), "aNaCl");
  });

  it("can manually specify a cache instance", () => {
    class Cache<K, V> implements CommonCache<K, V> {
      private _cache = new Map<K, V>()
      has = this._cache.has.bind(this._cache);
      get = this._cache.get.bind(this._cache);
      delete = this._cache.delete.bind(this._cache);
      get size(){ return this._cache.size }
      set(key: K, value: V): V {
        this._cache.set(key, value);
        return value;
      }
      clean(){};
    }

    const cache = new Cache<String, any>();

    const wrapped = wrap(
      (obj: { value: string }) => obj.value + " transformed",
      {
        cache,
        makeCacheKey(obj) {
          return obj.value;
        },
      }
    );
    assert.ok(cache instanceof Cache);
    assert.strictEqual(wrapped({ value: "test" }), "test transformed");
    assert.strictEqual(wrapped({ value: "test" }), "test transformed");
    cache.get("test").value[0] = "test modified";
    assert.strictEqual(wrapped({ value: "test" }), "test modified");
  });

  it("can manually specify a cache constructor", () => {
    class Cache<K, V> implements CommonCache<K, V> {
      private _cache = new Map<K, V>()
      has = this._cache.has.bind(this._cache);
      get = this._cache.get.bind(this._cache);
      delete = this._cache.delete.bind(this._cache);
      get size(){ return this._cache.size }
      set(key: K, value: V): V {
        this._cache.set(key, value);
        return value;
      }
      clean(){};
    }

    const wrapped = wrap(
      (obj: { value: string }) => obj.value + " transformed",
      {
        cache: Cache,
        makeCacheKey(obj) {
          return obj.value;
        },
      }
    );
    assert.ok(wrapped.options.cache instanceof Cache);
    assert.strictEqual(wrapped({ value: "test" }), "test transformed");
    assert.strictEqual(wrapped({ value: "test" }), "test transformed");
    wrapped.options.cache.get("test").value[0] = "test modified";
    assert.strictEqual(wrapped({ value: "test" }), "test modified");
  });

  it("works with two layers of functions", function () {
    const files: { [key: string]: string } = {
      "a.js": "a",
      "b.js": "b"
    };

    const fileNames = Object.keys(files);

    const read = wrap(function (path: string) {
      return files[path];
    });

    const hash = wrap(function (paths: string[]) {
      const h = createHash("sha1");
      paths.forEach(function (path) {
        h.update(read(path));
      });
      return h.digest("hex");
    });

    const hash1 = hash(fileNames);
    files["a.js"] += "yy";
    const hash2 = hash(fileNames);
    read.dirty("a.js");
    const hash3 = hash(fileNames);
    files["b.js"] += "ee";
    read.dirty("b.js");
    const hash4 = hash(fileNames);

    assert.strictEqual(hash1, hash2);
    assert.notStrictEqual(hash1, hash3);
    assert.notStrictEqual(hash1, hash4);
    assert.notStrictEqual(hash3, hash4);
  });

  it("works with subscription functions", function () {
    let dirty: () => void;
    let sep = ",";
    const unsubscribed = Object.create(null);
    const test = wrap(function (x: string) {
      return [x, x, x].join(sep);
    }, {
      max: 1,
      subscribe: function (x: string) {
        dirty = function () {
          test.dirty(x);
        };

        delete unsubscribed[x];

        return function () {
          unsubscribed[x] = true;
        };
      }
    });

    assert.strictEqual(test("a"), "a,a,a");

    assert.strictEqual(test("b"), "b,b,b");
    assert.deepEqual(unsubscribed, { a: true });

    assert.strictEqual(test("c"), "c,c,c");
    assert.deepEqual(unsubscribed, {
      a: true,
      b: true
    });

    sep = ":";

    assert.strictEqual(test("c"), "c,c,c");
    assert.deepEqual(unsubscribed, {
      a: true,
      b: true
    });

    dirty!();

    assert.strictEqual(test("c"), "c:c:c");
    assert.deepEqual(unsubscribed, {
      a: true,
      b: true
    });

    assert.strictEqual(test("d"), "d:d:d");
    assert.deepEqual(unsubscribed, {
      a: true,
      b: true,
      c: true
    });
  });

  // The fibers coroutine library no longer works with Node.js v16.
  it.skip("is not confused by fibers", function () {
    const Fiber = wrapYieldingFiberMethods(require("fibers"));

    const order = [];
    let result1 = "one";
    let result2 = "two";

    const f1 = new Fiber(function () {
      order.push(1);

      const o1 = wrap(function () {
        Fiber.yield();
        return result1;
      });

      order.push(2);
      assert.strictEqual(o1(), "one");
      order.push(3);
      result1 += ":dirty";
      assert.strictEqual(o1(), "one");
      order.push(4);
      Fiber.yield();
      order.push(5);
      assert.strictEqual(o1(), "one");
      order.push(6);
      o1.dirty();
      order.push(7);
      assert.strictEqual(o1(), "one:dirty");
      order.push(8);
      assert.strictEqual(o2(), "two:dirty");
      order.push(9);
    });

    result2 = "two"
    const o2 = wrap(function () {
      return result2;
    });

    order.push(0);

    f1.run();
    assert.deepEqual(order, [0, 1, 2]);

    // The primary goal of this test is to make sure this call to o2()
    // does not register a dirty-chain dependency for o1.
    assert.strictEqual(o2(), "two");

    f1.run();
    assert.deepEqual(order, [0, 1, 2, 3, 4]);

    // If the call to o2() captured o1() as a parent, then this o2.dirty()
    // call will report the o1() call dirty, which is not what we want.
    result2 += ":dirty";
    o2.dirty();

    f1.run();
    // The call to o1() between order.push(5) and order.push(6) should not
    // yield, because it should still be cached, because it should not be
    // dirty. However, the call to o1() between order.push(7) and
    // order.push(8) should yield, because we call o1.dirty() explicitly,
    // which is why this assertion stops at 7.
    assert.deepEqual(order, [0, 1, 2, 3, 4, 5, 6, 7]);

    f1.run();
    assert.deepEqual(order, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it("marks evicted cache entries dirty", function () {
    let childSalt = "*";
    let child = wrap(function (x: string) {
      return x + childSalt;
    }, { max: 1 });

    let parentSalt = "^";
    const parent = wrap(function (x: string) {
      return child(x) + parentSalt;
    });

    assert.strictEqual(parent("asdf"), "asdf*^");

    childSalt = "&";
    parentSalt = "%";

    assert.strictEqual(parent("asdf"), "asdf*^");
    assert.strictEqual(child("zxcv"), "zxcv&");
    assert.strictEqual(parent("asdf"), "asdf&%");
  });

  it("handles children throwing exceptions", function () {
    const expected = new Error("oyez");

    const child = wrap(function () {
      throw expected;
    });

    const parent = wrap(function () {
      try {
        child();
      } catch (e) {
        return e;
      }
    });

    assert.strictEqual(parent(), expected);
    assert.strictEqual(parent(), expected);

    child.dirty();
    assert.strictEqual(parent(), expected);

    parent.dirty();
    assert.strictEqual(parent(), expected);
  });

  it("reports clean children to correct parents", function () {
    let childResult = "a";
    const child = wrap(function () {
      return childResult;
    });

    const parent = wrap(function (x: any) {
      return child() + x;
    });

    assert.strictEqual(parent(1), "a1");
    assert.strictEqual(parent(2), "a2");

    childResult = "b";
    child.dirty();

    // If this call to parent(1) mistakenly reports child() as clean to
    // parent(2), then the second assertion will fail by returning "a2".
    assert.strictEqual(parent(1), "b1");
    assert.strictEqual(parent(2), "b2");
  });

  it("supports object cache keys", function () {
    let counter = 0;
    const wrapped = wrap(function (a: any, b: any) {
      return counter++;
    });

    const a = {};
    const b = {};

    // Different combinations of distinct object references should
    // increment the counter.
    assert.strictEqual(wrapped(a, a), 0);
    assert.strictEqual(wrapped(a, b), 1);
    assert.strictEqual(wrapped(b, a), 2);
    assert.strictEqual(wrapped(b, b), 3);

    // But the same combinations of arguments should return the same
    // cached values when passed again.
    assert.strictEqual(wrapped(a, a), 0);
    assert.strictEqual(wrapped(a, b), 1);
    assert.strictEqual(wrapped(b, a), 2);
    assert.strictEqual(wrapped(b, b), 3);
  });

  it("supports falsy non-void cache keys", function () {
    let callCount = 0;
    const wrapped = wrap((key: number | string | null | boolean | undefined) => {
      ++callCount;
      return key;
    }, {
      makeCacheKey(key) {
        return key;
      },
    });

    assert.strictEqual(wrapped(0), 0);
    assert.strictEqual(callCount, 1);
    assert.strictEqual(wrapped(0), 0);
    assert.strictEqual(callCount, 1);

    assert.strictEqual(wrapped(""), "");
    assert.strictEqual(callCount, 2);
    assert.strictEqual(wrapped(""), "");
    assert.strictEqual(callCount, 2);

    assert.strictEqual(wrapped(null), null);
    assert.strictEqual(callCount, 3);
    assert.strictEqual(wrapped(null), null);
    assert.strictEqual(callCount, 3);

    assert.strictEqual(wrapped(false), false);
    assert.strictEqual(callCount, 4);
    assert.strictEqual(wrapped(false), false);
    assert.strictEqual(callCount, 4);

    assert.strictEqual(wrapped(0), 0);
    assert.strictEqual(wrapped(""), "");
    assert.strictEqual(wrapped(null), null);
    assert.strictEqual(wrapped(false), false);
    assert.strictEqual(callCount, 4);

    assert.strictEqual(wrapped(1), 1);
    assert.strictEqual(wrapped("oyez"), "oyez");
    assert.strictEqual(wrapped(true), true);
    assert.strictEqual(callCount, 7);

    assert.strictEqual(wrapped(void 0), void 0);
    assert.strictEqual(wrapped(void 0), void 0);
    assert.strictEqual(wrapped(void 0), void 0);
    assert.strictEqual(callCount, 10);
  });

  it("detects problematic cycles", function () {
    const self: NumThunk = wrap(function () {
      return self() + 1;
    });

    const mutualA: NumThunk = wrap(function () {
      return mutualB() + 1;
    });

    const mutualB: NumThunk = wrap(function () {
      return mutualA() + 1;
    });

    function check(fn: typeof self) {
      try {
        fn();
        throw new Error("should not get here");
      } catch (e: any) {
        assert.strictEqual(e.message, "already recomputing");
      }

      // Try dirtying the function, now that there's a cycle in the Entry
      // graph. This should succeed.
      fn.dirty();
    }

    check(self);
    check(mutualA);
    check(mutualB);

    let returnZero = true;
    const fn: NumThunk = wrap(function () {
      if (returnZero) {
        returnZero = false;
        return 0;
      }
      returnZero = true;
      return fn() + 1;
    });

    assert.strictEqual(fn(), 0);
    assert.strictEqual(returnZero, false);

    returnZero = true;
    assert.strictEqual(fn(), 0);
    assert.strictEqual(returnZero, true);

    fn.dirty();

    returnZero = false;
    check(fn);
  });

  it("tolerates misbehaving makeCacheKey functions", function () {
    type NumNum = OptimisticWrapperFunction<[number], number>;

    let chaos = false;
    let counter = 0;
    const allOddsDep = wrap(() => ++counter);

    const sumOdd: NumNum = wrap((n: number) => {
      allOddsDep();
      if (n < 1) return 0;
      if (n % 2 === 1) {
        return n + sumEven(n - 1);
      }
      return sumEven(n);
    }, {
      makeCacheKey(n) {
        // Even though the computation completes, returning "constant" causes
        // cycles in the Entry graph.
        return chaos ? "constant" : n;
      }
    });

    const sumEven: NumNum = wrap((n: number) => {
      if (n < 1) return 0;
      if (n % 2 === 0) {
        return n + sumOdd(n - 1);
      }
      return sumOdd(n);
    });

    function check() {
      sumEven.dirty(10);
      sumOdd.dirty(10);
      if (chaos) {
        try {
          sumOdd(10);
        } catch (e: any) {
          assert.strictEqual(e.message, "already recomputing");
        }
        try {
          sumEven(10);
        } catch (e: any) {
          assert.strictEqual(e.message, "already recomputing");
        }
      } else {
        assert.strictEqual(sumEven(10), 55);
        assert.strictEqual(sumOdd(10), 55);
      }
    }

    check();

    allOddsDep.dirty();
    sumEven.dirty(10);
    check();

    allOddsDep.dirty();
    allOddsDep();
    check();

    chaos = true;
    check();

    allOddsDep.dirty();
    allOddsDep();
    check();

    allOddsDep.dirty();
    check();

    chaos = false;
    allOddsDep.dirty();
    check();

    chaos = true;
    sumOdd.dirty(9);
    sumOdd.dirty(7);
    sumOdd.dirty(5);
    check();

    chaos = false;
    check();
  });

  it("supports options.keyArgs", function () {
    const sumNums = wrap((...args: any[]) => ({
      sum: args.reduce(
        (sum, arg) => typeof arg === "number" ? arg + sum : sum,
        0,
      ) as number,
    }), {
      keyArgs(...args) {
        return args.filter(arg => typeof arg === "number");
      },
    });

    assert.strictEqual(sumNums().sum, 0);
    assert.strictEqual(sumNums("asdf", true, sumNums).sum, 0);

    const sumObj1 = sumNums(1, "zxcv", true, 2, false, 3);
    assert.strictEqual(sumObj1.sum, 6);
    // These results are === sumObj1 because the numbers involved are identical.
    assert.strictEqual(sumNums(1, 2, 3), sumObj1);
    assert.strictEqual(sumNums("qwer", 1, 2, true, 3, [3]), sumObj1);
    assert.strictEqual(sumNums("backwards", 3, 2, 1).sum, 6);
    assert.notStrictEqual(sumNums("backwards", 3, 2, 1), sumObj1);

    sumNums.dirty(1, 2, 3);
    const sumObj2 = sumNums(1, 2, 3);
    assert.strictEqual(sumObj2.sum, 6);
    assert.notStrictEqual(sumObj2, sumObj1);
    assert.strictEqual(sumNums("a", 1, "b", 2, "c", 3), sumObj2);
  });

  it("supports wrap(fn, {...}).options to reflect input options", function () {
    const keyArgs: () => [] = () => [];
    function makeCacheKey() { return "constant"; }
    function subscribe() {}
    let normalizeCalls: [number, number][] = [];
    function normalizeResult(newer: number, older: number) {
      normalizeCalls.push([newer, older]);
      return newer;
    }

    let counter1 = 0;
    const wrapped = wrap(() => ++counter1, {
      max: 10,
      keyArgs,
      makeCacheKey,
      normalizeResult,
      subscribe,
    });
    assert.strictEqual(wrapped.options.max, 10);
    assert.strictEqual(wrapped.options.keyArgs, keyArgs);
    assert.strictEqual(wrapped.options.makeCacheKey, makeCacheKey);
    assert.strictEqual(wrapped.options.normalizeResult, normalizeResult);
    assert.strictEqual(wrapped.options.subscribe, subscribe);

    assert.deepEqual(normalizeCalls, []);
    assert.strictEqual(wrapped(), 1);
    assert.deepEqual(normalizeCalls, []);
    assert.strictEqual(wrapped(), 1);
    assert.deepEqual(normalizeCalls, []);
    wrapped.dirty();
    assert.deepEqual(normalizeCalls, []);
    assert.strictEqual(wrapped(), 2);
    assert.deepEqual(normalizeCalls, [[2, 1]]);
    assert.strictEqual(wrapped(), 2);
    wrapped.dirty();
    assert.strictEqual(wrapped(), 3);
    assert.deepEqual(normalizeCalls, [[2, 1], [3, 2]]);
    assert.strictEqual(wrapped(), 3);
    assert.deepEqual(normalizeCalls, [[2, 1], [3, 2]]);
    assert.strictEqual(wrapped(), 3);

    let counter2 = 0;
    const wrappedWithDefaults = wrap(() => ++counter2);
    assert.strictEqual(wrappedWithDefaults.options.max, Math.pow(2, 16));
    assert.strictEqual(wrappedWithDefaults.options.keyArgs, void 0);
    assert.strictEqual(typeof wrappedWithDefaults.options.makeCacheKey, "function");
    assert.strictEqual(wrappedWithDefaults.options.normalizeResult, void 0);
    assert.strictEqual(wrappedWithDefaults.options.subscribe, void 0);
  });

  it("tolerates cycles when propagating dirty/clean signals", function () {
    let counter = 0;
    const dep = wrap(() => ++counter);

    const callChild = () => child();
    let parentBody = callChild;
    const parent = wrap(() => {
      dep();
      return parentBody();
    });

    const callParent = () => parent();
    let childBody = () => "child";
    const child = wrap(() => {
      dep();
      return childBody();
    });

    assert.strictEqual(parent(), "child");

    childBody = callParent;
    parentBody = () => "parent";
    child.dirty();
    assert.strictEqual(child(), "parent");
    dep.dirty();
    assert.strictEqual(child(), "parent");
  });

  it("is not confused by eviction during recomputation", function () {
    const fib: OptimisticWrapperFunction<[number], number> =
      wrap(function (n: number) {
        if (n > 1) {
          return fib(n - 1) + fib(n - 2);
        }
        return n;
      }, {
        max: 10
      });

    assert.strictEqual(fib.options.max, 10);

    assert.strictEqual(fib(78), 8944394323791464);
    assert.strictEqual(fib(68), 72723460248141);
    assert.strictEqual(fib(58), 591286729879);
    assert.strictEqual(fib(48), 4807526976);
    assert.strictEqual(fib(38), 39088169);
    assert.strictEqual(fib(28), 317811);
    assert.strictEqual(fib(18), 2584);
    assert.strictEqual(fib(8),  21);
  });

  it("allows peeking the current value", function () {
    const sumFirst = wrap(function (n: number): number {
      return n < 1 ? 0 : n + sumFirst(n - 1);
    });

    assert.strictEqual(sumFirst.peek(3), void 0);
    assert.strictEqual(sumFirst.peek(2), void 0);
    assert.strictEqual(sumFirst.peek(1), void 0);
    assert.strictEqual(sumFirst.peek(0), void 0);
    assert.strictEqual(sumFirst(3), 6);
    assert.strictEqual(sumFirst.peek(3), 6);
    assert.strictEqual(sumFirst.peek(2), 3);
    assert.strictEqual(sumFirst.peek(1), 1);
    assert.strictEqual(sumFirst.peek(0), 0);

    assert.strictEqual(sumFirst.peek(7), void 0);
    assert.strictEqual(sumFirst(10), 55);
    assert.strictEqual(sumFirst.peek(9), 55 - 10);
    assert.strictEqual(sumFirst.peek(8), 55 - 10 - 9);
    assert.strictEqual(sumFirst.peek(7), 55 - 10 - 9 - 8);

    sumFirst.dirty(7);
    // Everything from 7 and above is now unpeekable.
    assert.strictEqual(sumFirst.peek(10), void 0);
    assert.strictEqual(sumFirst.peek(9), void 0);
    assert.strictEqual(sumFirst.peek(8), void 0);
    assert.strictEqual(sumFirst.peek(7), void 0);
    // Since 6 < 7, its value is still cached.
    assert.strictEqual(sumFirst.peek(6), 6 * 7 / 2);
  });

  it("allows forgetting entries", function () {
    const ns: number[] = [];
    const sumFirst = wrap(function (n: number): number {
      ns.push(n);
      return n < 1 ? 0 : n + sumFirst(n - 1);
    });

    function inclusiveDescendingRange(n: number, limit = 0) {
      const range: number[] = [];
      while (n >= limit) range.push(n--);
      return range;
    }

    assert.strictEqual(sumFirst(10), 55);
    assert.deepStrictEqual(ns, inclusiveDescendingRange(10));

    assert.strictEqual(sumFirst.forget(6), true);
    assert.strictEqual(sumFirst(4), 10);
    assert.deepStrictEqual(ns, inclusiveDescendingRange(10));

    assert.strictEqual(sumFirst(11), 66);
    assert.deepStrictEqual(ns, [
      ...inclusiveDescendingRange(10),
      ...inclusiveDescendingRange(11, 6),
    ]);

    assert.strictEqual(sumFirst.forget(3), true);
    assert.strictEqual(sumFirst(7), 28);
    assert.deepStrictEqual(ns, [
      ...inclusiveDescendingRange(10),
      ...inclusiveDescendingRange(11, 6),
      ...inclusiveDescendingRange(7, 3),
    ]);

    assert.strictEqual(sumFirst.forget(123), false);
    assert.strictEqual(sumFirst.forget(-1), false);
    assert.strictEqual(sumFirst.forget("7" as any), false);
    assert.strictEqual((sumFirst.forget as any)(6, 4), false);
  });

  it("allows forgetting entries by key", function () {
    const ns: number[] = [];
    const sumFirst = wrap(function (n: number): number {
      ns.push(n);
      return n < 1 ? 0 : n + sumFirst(n - 1);
    }, {
        makeCacheKey: function (x: number) {
          return x * 2;
        }
    });

    assert.strictEqual(sumFirst.options.makeCacheKey!(7), 14);
    assert.strictEqual(sumFirst(10), 55);

    /*
     * Verify:
     * 1- Calling forgetKey will remove the entry.
     * 2- Calling forgetKey again will return false.
     * 3- Callling forget on the same entry will return false.
     */
    assert.strictEqual(sumFirst.forgetKey(6 * 2), true);
    assert.strictEqual(sumFirst.forgetKey(6 * 2), false);
    assert.strictEqual(sumFirst.forget(6), false);

    /*
     * Verify:
     * 1- Calling forget will remove the entry.
     * 2- Calling forget again will return false.
     * 3- Callling forgetKey on the same entry will return false.
     */
    assert.strictEqual(sumFirst.forget(7), true);
    assert.strictEqual(sumFirst.forget(7), false);
    assert.strictEqual(sumFirst.forgetKey(7 * 2), false);

    /*
     * Verify you can query an entry key.
     */
    assert.strictEqual(sumFirst.getKey(9), 18);
    assert.strictEqual(sumFirst.forgetKey(sumFirst.getKey(9)), true);
    assert.strictEqual(sumFirst.forgetKey(sumFirst.getKey(9)), false);
    assert.strictEqual(sumFirst.forget(9), false);
  });

  it("exposes optimistic.{size,options.cache.size} properties", function () {
    const d = dep<string>();
    const fib = wrap((n: number): number => {
      d("shared");
      return n > 1 ? fib(n - 1) + fib(n - 2) : n;
    }, {
      makeCacheKey(n) {
        return n;
      },
    });

    function size() {
      assert.strictEqual(fib.options.cache.size, fib.size);
      return fib.size;
    }

    assert.strictEqual(size(), 0);

    assert.strictEqual(fib(0), 0);
    assert.strictEqual(fib(1), 1);
    assert.strictEqual(fib(2), 1);
    assert.strictEqual(fib(3), 2);
    assert.strictEqual(fib(4), 3);
    assert.strictEqual(fib(5), 5);
    assert.strictEqual(fib(6), 8);
    assert.strictEqual(fib(7), 13);
    assert.strictEqual(fib(8), 21);

    assert.strictEqual(size(), 9);

    fib.dirty(6);
    // Merely dirtying an Entry does not remove it from the LRU cache.
    assert.strictEqual(size(), 9);

    fib.forget(6);
    // Forgetting an Entry both dirties it and removes it from the LRU cache.
    assert.strictEqual(size(), 8);

    fib.forget(4);
    assert.strictEqual(size(), 7);

    // This way of calling d.dirty causes any parent Entry objects to be
    // forgotten (removed from the LRU cache).
    d.dirty("shared", "forget");
    assert.strictEqual(size(), 0);
  });

  describe("wrapOptions.normalizeResult", function () {
    it("can normalize array results", function () {
      const normalizeArgs: [number[], number[]][] = [];
      const range = wrap((n: number) => {
        let result = [];
        for (let i = 0; i < n; ++i) {
          result[i] = i;
        }
        return result;
      }, {
        normalizeResult(newer, older) {
          normalizeArgs.push([newer, older]);
          return equal(newer, older) ? older : newer;
        },
      });

      const r3a = range(3);
      assert.deepStrictEqual(r3a, [0, 1, 2]);
      // Nothing surprising, just regular caching.
      assert.strictEqual(r3a, range(3));

      // Force range(3) to be recomputed below.
      range.dirty(3);

      const r3b = range(3);
      assert.deepStrictEqual(r3b, [0, 1, 2]);

      assert.strictEqual(r3a, r3b);

      assert.deepStrictEqual(normalizeArgs, [
        [r3b, r3a],
      ]);
      // Though r3a and r3b ended up ===, the normalizeResult callback should
      // have been called with two !== arrays.
      assert.notStrictEqual(
        normalizeArgs[0][0],
        normalizeArgs[0][1],
      );
    });

    it("can normalize recursive array results", function () {
      const range = wrap((n: number): number[] => {
        if (n <= 0) return [];
        return range(n - 1).concat(n - 1);
      }, {
        normalizeResult: (newer, older) => equal(newer, older) ? older : newer,
      });

      const ranges = [
        range(0),
        range(1),
        range(2),
        range(3),
        range(4),
      ];

      assert.deepStrictEqual(ranges[0], []);
      assert.deepStrictEqual(ranges[1], [0]);
      assert.deepStrictEqual(ranges[2], [0, 1]);
      assert.deepStrictEqual(ranges[3], [0, 1, 2]);
      assert.deepStrictEqual(ranges[4], [0, 1, 2, 3]);

      const perms = permutations(ranges[4]);
      assert.strictEqual(perms.length, 4 * 3 * 2 * 1);

      // For each permutation of the range sizes, check that strict equality
      // holds for r[i] and range(i) for all i after dirtying each number.
      let count = 0;
      perms.forEach(perm => {
        perm.forEach(toDirty => {
          range.dirty(toDirty);
          perm.forEach(i => {
            assert.strictEqual(ranges[i], range(i));
            ++count;
          });
        })
      });
      assert.strictEqual(count, perms.length * 4 * 4);
    });

    it("exceptions thrown by normalizeResult are ignored", function () {
      const normalizeCalls: [string | number, string | number][] = [];

      const maybeThrow = wrap((value: string | number, shouldThrow: boolean) => {
        if (shouldThrow) throw value;
        return value;
      }, {
        makeCacheKey(value, shouldThrow) {
          return JSON.stringify({
            // Coerce the value to a string so we can trigger normalizeResult
            // using either 2 or "2" below.
            value: String(value),
            shouldThrow,
          });
        },
        normalizeResult(a, b) {
          normalizeCalls.push([a, b]);
          throw new Error("from normalizeResult (expected)");
        },
      });

      assert.strictEqual(maybeThrow(1, false), 1);
      assert.strictEqual(maybeThrow(2, false), 2);

      maybeThrow.dirty(2, false);
      assert.strictEqual(maybeThrow("2", false), "2");
      assert.strictEqual(maybeThrow(2, false), "2");
      maybeThrow.dirty(2, false);
      assert.strictEqual(maybeThrow(2, false), 2);
      assert.strictEqual(maybeThrow("2", false), 2);

      assert.throws(
        () => maybeThrow(3, true),
        error => error === 3,
      );

      assert.throws(
        () => maybeThrow("3", true),
        // Still 3 because the previous maybeThrow(3, true) exception is cached.
        error => error === 3,
      );

      maybeThrow.dirty(3, true);
      assert.throws(
        () => maybeThrow("3", true),
        error => error === "3",
      );

      // Even though the exception thrown by normalizeResult was ignored, check
      // that it was in fact called (twice).
      assert.deepStrictEqual(normalizeCalls, [
        ["2", 2],
        [2, "2"],
      ]);
    });
  });
});
