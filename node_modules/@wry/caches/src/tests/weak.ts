import * as assert from "assert";
import { WeakCache } from "../weak.js";

describe("weak least-recently-used cache", function () {
  it("can hold lots of elements", async function () {
    this.timeout(10000);
    const cache = new WeakCache();
    const count = 1000000;
    const keys = [];

    for (let i = 0; i < count; ++i) {
      const key = {};
      cache.set(key, String(i));
      keys[i] = key;
    }
    await waitForCache(cache);

    cache.clean();

    assert.strictEqual(cache.size, count);
    assert.ok(cache.has(keys[0]));
    assert.ok(cache.has(keys[count - 1]));
    assert.strictEqual(cache.get(keys[43]), "43");
  });

  it("evicts excess old elements", function () {
    const max = 10;
    const evicted = [];
    const cache = new WeakCache(max, (value, key) => {
      assert.strictEqual(key.valueOf(), value.valueOf());
      evicted.push(key);
    });

    const count = 100;
    const keys = [];
    for (let i = 0; i < count; ++i) {
      const key = new String(i);
      cache.set(key, String(i));
      keys[i] = key;
    }

    cache.clean();

    assert.strictEqual((cache as any).size, max);
    assert.strictEqual(evicted.length, count - max);

    for (let i = count - max; i < count; ++i) {
      assert.ok(cache.has(keys[i]));
    }
  });

  it("evicts elements that are garbage collected", async function () {
    const cache = new WeakCache();

    const count = 100;
    const keys: Array<String | null> = [];
    for (let i = 0; i < count; ++i) {
      keys[i] = new String(i);
      cache.set(keys[i], String(i));
    }

    assert.strictEqual(cache.size, 100);
    await waitForCache(cache);
    assert.strictEqual(cache.size, 100);

    for (let i = 0; i < 50; ++i) {
      keys[i] = null;
    }

    return gcPromise(() => {
      return cache.size > 50 ? null : () => {
        assert.strictEqual(cache.size, 50);
        assert.strictEqual(keys.length, 100);
        assert.strictEqual(new Set(keys).size, 51);
      };
    });
  });

  function gcPromise(test: () => null | (() => void)) {
    return new Promise<void>(function (resolve, reject) {
      function pollGC() {
        global.gc!();
        const testCallback = test();
        if (!testCallback) {
          setTimeout(pollGC, 20);
        } else try {
          testCallback();
          resolve();
        } catch (e) {
          reject(e);
        }
      }
      pollGC();
    });
  }

  it("can cope with small max values", async function () {
    const cache = new WeakCache(2);
    const keys = Array(10)
      .fill(null)
      .map((_, i) => new Number(i));

    async function check(...sequence: number[]) {
      await waitForCache(cache);
      cache.clean();

      let entry = cache["newest"];
      const forwards = [];
      while (entry) {
        forwards.push(entry.keyRef?.deref());
        entry = entry.older;
      }
      assert.deepEqual(forwards.map(Number), sequence);

      const backwards = [];
      entry = cache["oldest"];
      while (entry) {
        backwards.push(entry.keyRef?.deref());
        entry = entry.newer;
      }
      backwards.reverse();
      assert.deepEqual(backwards.map(Number), sequence);

      sequence.forEach(function (n) {
        assert.strictEqual(cache["map"].get(keys[n])?.value, n + 1);
      });

      if (sequence.length > 0) {
        assert.strictEqual(
          cache["oldest"]?.keyRef?.deref().valueOf(),
          sequence[sequence.length - 1]
        );
      }
    }

    cache.set(keys[1], 2);
    await check(1);

    cache.set(keys[2], 3);
    await check(2, 1);

    cache.set(keys[3], 4);
    await check(3, 2);

    cache.get(keys[2]);
    await check(2, 3);

    cache.set(keys[4], 5);
    await check(4, 2);

    assert.strictEqual(cache.has(keys[1]), false);
    assert.strictEqual(cache.get(keys[2]), 3);
    assert.strictEqual(cache.has(keys[3]), false);
    assert.strictEqual(cache.get(keys[4]), 5);

    cache.delete(keys[2]);
    await check(4);
    cache.delete(keys[4]);
    await check();

    assert.strictEqual((cache as any).newest, null);
    assert.strictEqual((cache as any).oldest, null);
  });
});

async function waitForCache(cache: WeakCache) {
  while (cache["finalizationScheduled"]) {
    await new Promise<void>(queueMicrotask);
  }
}
