const { toString, hasOwnProperty } = Object.prototype;
const fnToStr = Function.prototype.toString;
const previousComparisons = new Map<object, Set<object>>();

/**
 * Performs a deep equality check on two JavaScript values, tolerating cycles.
 */
export function equal(a: any, b: any): boolean {
  try {
    return check(a, b);
  } finally {
    previousComparisons.clear();
  }
}

// Allow default imports as well.
export default equal;

function check(a: any, b: any): boolean {
  // If the two values are strictly equal, our job is easy.
  if (a === b) {
    return true;
  }

  // Object.prototype.toString returns a representation of the runtime type of
  // the given value that is considerably more precise than typeof.
  const aTag = toString.call(a);
  const bTag = toString.call(b);

  // If the runtime types of a and b are different, they could maybe be equal
  // under some interpretation of equality, but for simplicity and performance
  // we just return false instead.
  if (aTag !== bTag) {
    return false;
  }

  switch (aTag) {
    case '[object Array]':
      // Arrays are a lot like other objects, but we can cheaply compare their
      // lengths as a short-cut before comparing their elements.
      if (a.length !== b.length) return false;
      // Fall through to object case...
    case '[object Object]': {
      if (previouslyCompared(a, b)) return true;

      const aKeys = definedKeys(a);
      const bKeys = definedKeys(b);

      // If `a` and `b` have a different number of enumerable keys, they
      // must be different.
      const keyCount = aKeys.length;
      if (keyCount !== bKeys.length) return false;

      // Now make sure they have the same keys.
      for (let k = 0; k < keyCount; ++k) {
        if (!hasOwnProperty.call(b, aKeys[k])) {
          return false;
        }
      }

      // Finally, check deep equality of all child properties.
      for (let k = 0; k < keyCount; ++k) {
        const key = aKeys[k];
        if (!check(a[key], b[key])) {
          return false;
        }
      }

      return true;
    }

    case '[object Error]':
      return a.name === b.name && a.message === b.message;

    case '[object Number]':
      // Handle NaN, which is !== itself.
      if (a !== a) return b !== b;
      // Fall through to shared +a === +b case...
    case '[object Boolean]':
    case '[object Date]':
      return +a === +b;

    case '[object RegExp]':
    case '[object String]':
      return a == `${b}`;

    case '[object Map]':
    case '[object Set]': {
      if (a.size !== b.size) return false;
      if (previouslyCompared(a, b)) return true;

      const aIterator = a.entries();
      const isMap = aTag === '[object Map]';

      while (true) {
        const info = aIterator.next();
        if (info.done) break;

        // If a instanceof Set, aValue === aKey.
        const [aKey, aValue] = info.value;

        // So this works the same way for both Set and Map.
        if (!b.has(aKey)) {
          return false;
        }

        // However, we care about deep equality of values only when dealing
        // with Map structures.
        if (isMap && !check(aValue, b.get(aKey))) {
          return false;
        }
      }

      return true;
    }

    case '[object Uint16Array]':
    case '[object Uint8Array]': // Buffer, in Node.js.
    case '[object Uint32Array]':
    case '[object Int32Array]':
    case '[object Int8Array]':
    case '[object Int16Array]':
    case '[object ArrayBuffer]':
      // DataView doesn't need these conversions, but the equality check is
      // otherwise the same.
      a = new Uint8Array(a);
      b = new Uint8Array(b);
      // Fall through...
    case '[object DataView]': {
      let len = a.byteLength;
      if (len === b.byteLength) {
        while (len-- && a[len] === b[len]) {
          // Keep looping as long as the bytes are equal.
        }
      }
      return len === -1;
    }

    case '[object AsyncFunction]':
    case '[object GeneratorFunction]':
    case '[object AsyncGeneratorFunction]':
    case '[object Function]': {
      const aCode = fnToStr.call(a);
      if (aCode !== fnToStr.call(b)) {
        return false;
      }

      // We consider non-native functions equal if they have the same code
      // (native functions require === because their code is censored).
      // Note that this behavior is not entirely sound, since !== function
      // objects with the same code can behave differently depending on
      // their closure scope. However, any function can behave differently
      // depending on the values of its input arguments (including this)
      // and its calling context (including its closure scope), even
      // though the function object is === to itself; and it is entirely
      // possible for functions that are not === to behave exactly the
      // same under all conceivable circumstances. Because none of these
      // factors are statically decidable in JavaScript, JS function
      // equality is not well-defined. This ambiguity allows us to
      // consider the best possible heuristic among various imperfect
      // options, and equating non-native functions that have the same
      // code has enormous practical benefits, such as when comparing
      // functions that are repeatedly passed as fresh function
      // expressions within objects that are otherwise deeply equal. Since
      // any function created from the same syntactic expression (in the
      // same code location) will always stringify to the same code
      // according to fnToStr.call, we can reasonably expect these
      // repeatedly passed function expressions to have the same code, and
      // thus behave "the same" (with all the caveats mentioned above),
      // even though the runtime function objects are !== to one another.
      return !endsWith(aCode, nativeCodeSuffix);
    }
  }

  // Otherwise the values are not equal.
  return false;
}

function definedKeys<TObject extends object>(obj: TObject) {
  // Remember that the second argument to Array.prototype.filter will be
  // used as `this` within the callback function.
  return Object.keys(obj).filter(isDefinedKey, obj);
}
function isDefinedKey<TObject extends object>(
  this: TObject,
  key: keyof TObject,
) {
  return this[key] !== void 0;
}

const nativeCodeSuffix = "{ [native code] }";

function endsWith(full: string, suffix: string) {
  const fromIndex = full.length - suffix.length;
  return fromIndex >= 0 &&
    full.indexOf(suffix, fromIndex) === fromIndex;
}

function previouslyCompared(a: object, b: object): boolean {
  // Though cyclic references can make an object graph appear infinite from the
  // perspective of a depth-first traversal, the graph still contains a finite
  // number of distinct object references. We use the previousComparisons cache
  // to avoid comparing the same pair of object references more than once, which
  // guarantees termination (even if we end up comparing every object in one
  // graph to every object in the other graph, which is extremely unlikely),
  // while still allowing weird isomorphic structures (like rings with different
  // lengths) a chance to pass the equality test.
  let bSet = previousComparisons.get(a);
  if (bSet) {
    // Return true here because we can be sure false will be returned somewhere
    // else if the objects are not equivalent.
    if (bSet.has(b)) return true;
  } else {
    previousComparisons.set(a, bSet = new Set);
  }
  bSet.add(b);
  return false;
}
