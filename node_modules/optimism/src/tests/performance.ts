import * as assert from "assert";
import { wrap, dep, KeyTrie } from "../index";

describe("performance", function () {
  this.timeout(30000);

  it("should be able to tolerate lots of Entry objects", function () {
    let counter = 0;
    const child = wrap((a: any, b: any) => counter++);
    const parent = wrap((obj1: object, num: number, obj2: object) => {
      child(obj1, counter);
      child(counter, obj2);
      return counter++;
    });
    for (let i = 0; i < 100000; ++i) {
      parent({}, i, {});
    }
  });

  const keys: object[] = [];
  for (let i = 0; i < 100000; ++i) {
    keys.push({ i });
  }

  it("should be able to tolerate lots of deps", function () {
    const d = dep<object>();
    const parent = wrap((id: number) => {
      keys.forEach(d);
      return id;
    });
    parent(1);
    parent(2);
    parent(3);
    keys.forEach(key => d.dirty(key));
  });

  it("can speed up sorting with O(array.length) cache lookup", function () {
    let counter = 0;
    const trie = new KeyTrie(false);
    const sort = wrap((array: number[]) => {
      ++counter;
      return array.slice(0).sort();
    }, {
      makeCacheKey(array) {
        return trie.lookupArray(array);
      }
    });

    assert.deepEqual(sort([2, 1, 5, 4]), [1, 2, 4, 5]);
    assert.strictEqual(counter, 1);
    assert.strictEqual(
      sort([2, 1, 5, 4]),
      sort([2, 1, 5, 4]),
    );
    assert.strictEqual(counter, 1);

    assert.deepEqual(sort([3, 2, 1]), [1, 2, 3]);
    assert.strictEqual(counter, 2);

    const bigArray: number[] = [];
    for (let i = 0; i < 100000; ++i) {
      bigArray.push(Math.round(Math.random() * 100));
    }

    const bigArrayCopy = bigArray.slice(0);
    const rawSortStartTime = Date.now();
    bigArrayCopy.sort();
    const rawSortTime = Date.now() - rawSortStartTime;

    assert.deepEqual(
      sort(bigArray),
      bigArrayCopy,
    );

    const cachedSortStartTime = Date.now();
    const cached = sort(bigArray);
    const cachedSortTime = Date.now() - cachedSortStartTime;

    assert.deepEqual(cached, bigArrayCopy);
    assert.ok(
      cachedSortTime <= rawSortTime,
      `cached: ${cachedSortTime}ms, raw: ${rawSortTime}ms`,
    );
    assert.strictEqual(counter, 3);
  });
});
