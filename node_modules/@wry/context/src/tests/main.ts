import * as assert from "assert";
import {
  Slot,
  bind,
  noContext,
  setTimeout,
  asyncFromGen
} from "../index.js";

function repeat(s: string, times: number) {
  let result = "";
  while (times --> 0) result += s;
  return result;
}

describe("Slot", function () {
  it("is importable", function () {
    assert.strictEqual(typeof Slot, "function");
  });

  it("has no value initially", function () {
    const slot = new Slot;
    assert.strictEqual(slot.hasValue(), false);
    assert.strictEqual(typeof slot.getValue(), "undefined");
  });

  it("retains values set by withValue", function () {
    const slot = new Slot<number>();

    const results = slot.withValue(123, () => {
      assert.strictEqual(slot.hasValue(), true);
      assert.strictEqual(slot.getValue(), 123);

      const results = [
        slot.getValue(),
        slot.withValue(456, () => {
          assert.strictEqual(slot.hasValue(), true);
          return slot.getValue();
        }),
        slot.withValue(789, () => {
          assert.strictEqual(slot.hasValue(), true);
          return slot.getValue();
        }),
      ];

      assert.strictEqual(slot.hasValue(), true);
      assert.strictEqual(slot.getValue(), 123);

      return results;
    });

    assert.strictEqual(slot.hasValue(), false);
    assert.deepEqual(results, [123, 456, 789]);
  });

  it("is not confused by other slots", function () {
    const stringSlot = new Slot<string>();
    const numberSlot = new Slot<number>();

    function inner() {
      return repeat(
        stringSlot.getValue()!,
        numberSlot.getValue()!,
      );
    }

    const oneWay = stringSlot.withValue("oyez", () => {
      return numberSlot.withValue(3, inner);
    });

    assert.strictEqual(stringSlot.hasValue(), false);
    assert.strictEqual(numberSlot.hasValue(), false);

    const otherWay = numberSlot.withValue(3, () => {
      return stringSlot.withValue("oyez", inner);
    });

    assert.strictEqual(stringSlot.hasValue(), false);
    assert.strictEqual(numberSlot.hasValue(), false);

    assert.strictEqual(oneWay, otherWay);
    assert.strictEqual(oneWay, "oyezoyezoyez");
  });

  it("is a singleton", async function () {
    const cjsSlotModule = await import("../slot.js");
    assert.ok(new Slot<number>() instanceof cjsSlotModule.Slot);
    assert.ok(new cjsSlotModule.Slot() instanceof Slot);
    assert.strictEqual(cjsSlotModule.Slot, Slot);
    const globalKey = "@wry/context:Slot";
    assert.strictEqual((global as any)[globalKey], Slot);
    assert.deepEqual(Object.keys(Array), []);
    assert.strictEqual(
      Object.keys(global).indexOf(globalKey),
      -1,
    );
  });

  it("can be subclassed", function () {
    class NamedSlot extends Slot<number> {
      constructor(public readonly name: string) {
        super();
        (this as any).id = name + ":" + this.id;
      }
    }

    const ageSlot = new NamedSlot("age");
    assert.strictEqual(ageSlot.hasValue(), false);
    ageSlot.withValue(87, () => {
      assert.strictEqual(ageSlot.hasValue(), true);
      const age = ageSlot.getValue()!;
      assert.strictEqual(age, 87);
      assert.strictEqual(ageSlot.name, "age");
      assert.ok(ageSlot.id.startsWith("age:slot:"));
    });

    class DefaultSlot<T> extends Slot<T> {
      constructor(public readonly defaultValue: T) {
        super();
      }

      hasValue() {
        return true;
      }

      getValue() {
        return super.hasValue() ? super.getValue() : this.defaultValue;
      }
    }

    const defaultSlot = new DefaultSlot("default");
    assert.strictEqual(defaultSlot.hasValue(), true);
    assert.strictEqual(defaultSlot.getValue(), "default");
    const check = defaultSlot.withValue("real", function () {
      assert.strictEqual(defaultSlot.hasValue(), true);
      assert.strictEqual(defaultSlot.getValue(), "real");
      return bind(function () {
        assert.strictEqual(defaultSlot.hasValue(), true);
        assert.strictEqual(defaultSlot.getValue(), "real");
      });
    });
    assert.strictEqual(defaultSlot.hasValue(), true);
    assert.strictEqual(defaultSlot.getValue(), "default");
    check();
  });
});

describe("bind", function () {
  it("is importable", function () {
    assert.strictEqual(typeof bind, "function");
  });

  it("preserves multiple slots", function () {
    const stringSlot = new Slot<string>();
    const numberSlot = new Slot<number>();

    function neither() {
      assert.strictEqual(stringSlot.hasValue(), false);
      assert.strictEqual(numberSlot.hasValue(), false);
    }

    const checks = [bind(neither)];

    stringSlot.withValue("asdf", () => {
      function justStringAsdf() {
        assert.strictEqual(stringSlot.hasValue(), true);
        assert.strictEqual(stringSlot.getValue(), "asdf");
        assert.strictEqual(numberSlot.hasValue(), false);
      }

      checks.push(bind(justStringAsdf));

      numberSlot.withValue(54321, () => {
        checks.push(bind(function both() {
          assert.strictEqual(stringSlot.hasValue(), true);
          assert.strictEqual(stringSlot.getValue(), "asdf");
          assert.strictEqual(numberSlot.hasValue(), true);
          assert.strictEqual(numberSlot.getValue(), 54321);
        }));
      });

      stringSlot.withValue("oyez", () => {
        checks.push(bind(function justStringOyez() {
          assert.strictEqual(stringSlot.hasValue(), true);
          assert.strictEqual(stringSlot.getValue(), "oyez");
          assert.strictEqual(numberSlot.hasValue(), false);
        }));

        numberSlot.withValue(12345, () => {
          checks.push(bind(function bothAgain() {
            assert.strictEqual(stringSlot.hasValue(), true);
            assert.strictEqual(stringSlot.getValue(), "oyez");
            assert.strictEqual(numberSlot.hasValue(), true);
            assert.strictEqual(numberSlot.getValue(), 12345);
          }));
        });
      });

      checks.push(bind(justStringAsdf));
    });

    checks.push(bind(neither));

    checks.forEach(check => check());
  });

  it("does not permit rebinding", function () {
    const slot = new Slot<number>();
    const bound = slot.withValue(1, () => bind(function () {
      assert.strictEqual(slot.hasValue(), true);
      assert.strictEqual(slot.getValue(), 1);
      return slot.getValue();
    }));
    assert.strictEqual(bound(), 1);
    const rebound = slot.withValue(2, () => bind(bound));
    assert.strictEqual(rebound(), 1);
    assert.strictEqual(slot.hasValue(), false);
  });
});

describe("noContext", function () {
  it("is importable", function () {
    assert.strictEqual(typeof noContext, "function");
  });

  it("severs context set by withValue", function () {
    const slot = new Slot<string>();
    const result = slot.withValue("asdf", function () {
      assert.strictEqual(slot.getValue(), "asdf");
      return noContext(() => {
        assert.strictEqual(slot.hasValue(), false);
        return "inner";
      });
    });
    assert.strictEqual(result, "inner");
  });

  it("severs bound context", function () {
    const slot = new Slot<string>();
    const bound = slot.withValue("asdf", function () {
      assert.strictEqual(slot.getValue(), "asdf");
      return bind(function () {
        assert.strictEqual(slot.getValue(), "asdf");
        return noContext(() => {
          assert.strictEqual(slot.hasValue(), false);
          return "inner";
        });
      });
    });
    assert.strictEqual(slot.hasValue(), false);
    assert.strictEqual(bound(), "inner");
  });

  it("permits reestablishing inner context values", function () {
    const slot = new Slot<string>();
    const bound = slot.withValue("asdf", function () {
      assert.strictEqual(slot.getValue(), "asdf");
      return bind(function () {
        assert.strictEqual(slot.getValue(), "asdf");
        return noContext(() => {
          assert.strictEqual(slot.hasValue(), false);
          return slot.withValue("oyez", () => {
            assert.strictEqual(slot.hasValue(), true);
            return slot.getValue();
          });
        });
      });
    });
    assert.strictEqual(slot.hasValue(), false);
    assert.strictEqual(bound(), "oyez");
  });

  it("permits passing arguments and this", function () {
    const slot = new Slot<number>();
    const self = {};
    const notSelf = {};
    const result = slot.withValue(1, function (a: number) {
      assert.strictEqual(slot.hasValue(), true);
      assert.strictEqual(slot.getValue(), 1);
      assert.strictEqual(this, self);
      return noContext(function (b: number) {
        assert.strictEqual(slot.hasValue(), false);
        assert.strictEqual(this, notSelf);
        return slot.withValue(b, (aArg, bArg) => {
          assert.strictEqual(slot.hasValue(), true);
          assert.strictEqual(slot.getValue(), b);
          assert.strictEqual(this, notSelf);
          assert.strictEqual(a, aArg);
          assert.strictEqual(b, bArg);
          return aArg * bArg;
        }, [a, b], self);
      }, [3], notSelf);
    }, [2], self);
    assert.strictEqual(result, 2 * 3);
  });

  it("works with Array-like (arguments) objects", function () {
    function multiply(a: number, b: number) {
      return noContext(function inner(a, b) {
        return a * b;
      }, arguments as any);
    }
    assert.strictEqual(multiply(3, 7) * 2, 42);
  });
});

describe("setTimeout", function () {
  it("is importable", function () {
    assert.strictEqual(typeof setTimeout, "function");
  });

  it("binds its callback", function () {
    const booleanSlot = new Slot<boolean>();
    const objectSlot = new Slot<{ foo: number }>();

    return new Promise<void>((resolve, reject) => {
      booleanSlot.withValue(true, () => {
        assert.strictEqual(booleanSlot.getValue(), true);
        objectSlot.withValue({ foo: 42 }, () => {
          setTimeout(function () {
            try {
              assert.strictEqual(booleanSlot.hasValue(), true);
              assert.strictEqual(booleanSlot.getValue(), true);
              assert.strictEqual(objectSlot.hasValue(), true);
              assert.strictEqual(objectSlot.getValue()!.foo, 42);
              resolve();
            } catch (error) {
              reject(error);
            }
          }, 10);
        })
      });
    }).then(() => {
      assert.strictEqual(booleanSlot.hasValue(), false);
      assert.strictEqual(objectSlot.hasValue(), false);
    });
  });
});

describe("asyncFromGen", function () {
  it("is importable", function () {
    assert.strictEqual(typeof asyncFromGen, "function");
  });

  it("works like an async function", asyncFromGen(
    function*(): Generator<number | Promise<number>, Promise<string>, number> {
      let sum = 0;
      const limit = yield new Promise(resolve => {
        setTimeout(() => resolve(10), 10);
      });
      for (let i = 0; i < limit; ++i) {
        sum += yield i + 1;
      }
      assert.strictEqual(sum, 55);
      return Promise.resolve("ok");
    },
  ));

  it("properly handles exceptions", async function () {
    const fn = asyncFromGen(function*(throwee?: object) {
      const result = yield Promise.resolve("ok");
      if (throwee) {
        throw yield throwee;
      }
      return result;
    });

    const okPromise = fn();
    const expected = {};
    const koPromise = fn(expected);

    assert.strictEqual(await okPromise, "ok");

    try {
      await koPromise;
      throw new Error("not reached");
    } catch (error) {
      assert.strictEqual(error, expected);
    }

    try {
      await fn(Promise.resolve("oyez"));
      throw new Error("not reached");
    } catch (thrown) {
      assert.strictEqual(thrown, "oyez");
    }
  });

  it("propagates contextual slot values across yields", function () {
    const stringSlot = new Slot<string>();
    const numberSlot = new Slot<number>();

    function checkNoValues() {
      assert.strictEqual(stringSlot.hasValue(), false);
      assert.strictEqual(numberSlot.hasValue(), false);
    }

    const inner = asyncFromGen(function*(
      stringValue: string,
      numberValue: number,
    ) {
      function checkValues() {
        assert.strictEqual(stringSlot.getValue(), stringValue);
        assert.strictEqual(numberSlot.getValue(), numberValue);
      }

      checkValues();

      yield new Promise<void>(resolve => setTimeout(function () {
        checkValues();
        resolve();
      }, 10));

      checkValues();

      yield new Promise<void>(resolve => {
        checkValues();
        resolve();
      });

      checkValues();

      yield Promise.resolve().then(checkNoValues);

      checkValues();

      return repeat(stringValue, numberValue);
    });

    const outer = asyncFromGen(function*() {
      checkNoValues();

      const oyezPromise = stringSlot.withValue("oyez", () => {
        return numberSlot.withValue(3, () => inner("oyez", 3));
      });

      checkNoValues();

      const hahaPromise = numberSlot.withValue(4, () => {
        return stringSlot.withValue("ha", () => inner("ha", 4));
      });

      checkNoValues();

      assert.strictEqual(yield oyezPromise, "oyezoyezoyez");
      assert.strictEqual(yield hahaPromise, "hahahaha");

      checkNoValues();

      return Promise.all([oyezPromise, hahaPromise]);
    });

    return outer().then(results => {
      checkNoValues();

      assert.deepEqual(results, [
        "oyezoyezoyez",
        "hahahaha",
      ]);
    });
  });

  it("allows Promise rejections to be caught", function () {
    const fn = asyncFromGen(function*() {
      try {
        yield Promise.reject(new Error("expected"));
        throw new Error("not reached");
      } catch (error: any) {
        assert.strictEqual(error?.message, "expected");
      }
      return "ok";
    });

    return fn().then(result => {
      assert.strictEqual(result, "ok");
    });
  });
});
