import * as assert from "assert";
import { StrongCache as Cache } from "@wry/caches";

describe("least-recently-used cache", function () {
  it("can hold lots of elements", function () {
    const cache = new Cache();
    const count = 1000000;

    for (let i = 0; i < count; ++i) {
      cache.set(i, String(i));
    }

    cache.clean();

    assert.strictEqual((cache as any).map.size, count);
    assert.ok(cache.has(0));
    assert.ok(cache.has(count - 1));
    assert.strictEqual(cache.get(43), "43");
  });

  it("evicts excess old elements", function () {
    const max = 10;
    const evicted = [];
    const cache = new Cache(max, (value, key) => {
      assert.strictEqual(String(key), value);
      evicted.push(key);
    });

    const count = 100;
    const keys = [];
    for (let i = 0; i < count; ++i) {
      cache.set(i, String(i));
      keys.push(i);
    }

    cache.clean();

    assert.strictEqual((cache as any).map.size, max);
    assert.strictEqual(evicted.length, count - max);

    for (let i = count - max; i < count; ++i) {
      assert.ok(cache.has(i));
    }
  });

  it("can cope with small max values", function () {
    const cache = new Cache(2);

    function check(...sequence: number[]) {
      cache.clean();

      let entry = (cache as any).newest;
      const forwards = [];
      while (entry) {
        forwards.push(entry.key);
        entry = entry.older;
      }
      assert.deepEqual(forwards, sequence);

      const backwards = [];
      entry = (cache as any).oldest;
      while (entry) {
        backwards.push(entry.key);
        entry = entry.newer;
      }
      backwards.reverse();
      assert.deepEqual(backwards, sequence);

      sequence.forEach(function (n) {
        assert.strictEqual((cache as any).map.get(n).value, n + 1);
      });

      if (sequence.length > 0) {
        assert.strictEqual((cache as any).newest.key, sequence[0]);
        assert.strictEqual(
          (cache as any).oldest.key,
          sequence[sequence.length - 1]
        );
      }
    }

    cache.set(1, 2);
    check(1);

    cache.set(2, 3);
    check(2, 1);

    cache.set(3, 4);
    check(3, 2);

    cache.get(2);
    check(2, 3);

    cache.set(4, 5);
    check(4, 2);

    assert.strictEqual(cache.has(1), false);
    assert.strictEqual(cache.get(2), 3);
    assert.strictEqual(cache.has(3), false);
    assert.strictEqual(cache.get(4), 5);

    cache.delete(2);
    check(4);
    cache.delete(4);
    check();

    assert.strictEqual((cache as any).newest, null);
    assert.strictEqual((cache as any).oldest, null);
  });
});
