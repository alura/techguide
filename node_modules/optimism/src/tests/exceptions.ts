import * as assert from "assert";
import { wrap } from "../index.js";

describe("exceptions", function () {
  it("should be cached", function () {
    const error = new Error("expected");
    let threw = false;
    function throwOnce() {
      if (!threw) {
        threw = true;
        throw error;
      }
      return "already threw";
    }

    const wrapper = wrap(throwOnce);

    try {
      wrapper();
      throw new Error("unreached");
    } catch (e) {
      assert.strictEqual(e, error);
    }

    try {
      wrapper();
      throw new Error("unreached");
    } catch (e) {
      assert.strictEqual(e, error);
    }

    wrapper.dirty();
    assert.strictEqual(wrapper(), "already threw");
    assert.strictEqual(wrapper(), "already threw");
    wrapper.dirty();
    assert.strictEqual(wrapper(), "already threw");
  });

  it("should memoize a throwing fibonacci function", function () {
    const fib = wrap((n: number) => {
      if (n < 2) throw n;
      try {
        fib(n - 1);
      } catch (minusOne: any) {
        try {
          fib(n - 2);
        } catch (minusTwo: any) {
          throw minusOne + minusTwo;
        }
      }
      throw new Error("unreached");
    });

    function check(n: number, expected: number) {
      try {
        fib(n);
        throw new Error("unreached");
      } catch (result) {
        assert.strictEqual(result, expected);
      }
    }

    check(78, 8944394323791464);
    check(68, 72723460248141);
    check(58, 591286729879);
    check(48, 4807526976);
    fib.dirty(28);
    check(38, 39088169);
    check(28, 317811);
    check(18, 2584);
    check(8,  21);
    fib.dirty(20);
    check(78, 8944394323791464);
    check(10, 55);
  });
});
