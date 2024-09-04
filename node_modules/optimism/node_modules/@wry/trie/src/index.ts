// A [trie](https://en.wikipedia.org/wiki/Trie) data structure that holds
// object keys weakly, yet can also hold non-object keys, unlike the
// native `WeakMap`.

// If no makeData function is supplied, the looked-up data will be an empty,
// null-prototype Object.
const defaultMakeData = () => Object.create(null);

// Useful for processing arguments objects as well as arrays.
const { forEach, slice } = Array.prototype;
const { hasOwnProperty } = Object.prototype;

export class Trie<Data> {
  // Since a `WeakMap` cannot hold primitive values as keys, we need a
  // backup `Map` instance to hold primitive keys. Both `this._weakMap`
  // and `this._strongMap` are lazily initialized.
  private weak?: WeakMap<any, Trie<Data>>;
  private strong?: Map<any, Trie<Data>>;
  private data?: Data;

  constructor(
    private weakness = true,
    private makeData: (array: any[]) => Data = defaultMakeData,
  ) {}

  public lookup<T extends any[]>(...array: T): Data {
    return this.lookupArray(array);
  }

  public lookupArray<T extends IArguments | any[]>(array: T): Data {
    let node: Trie<Data> = this;
    forEach.call(array, key => node = node.getChildTrie(key));
    return hasOwnProperty.call(node, "data")
      ? node.data as Data
      : node.data = this.makeData(slice.call(array));
  }

  public peek<T extends any[]>(...array: T): Data | undefined {
    return this.peekArray(array);
  }

  public peekArray<T extends IArguments | any[]>(array: T): Data | undefined {
    let node: Trie<Data> | undefined = this;

    for (let i = 0, len = array.length; node && i < len; ++i) {
      const map: Trie<Data>["weak" | "strong"] =
        this.weakness && isObjRef(array[i]) ? node.weak : node.strong;

      node = map && map.get(array[i]);
    }

    return node && node.data;
  }

  private getChildTrie(key: any) {
    const map = this.weakness && isObjRef(key)
      ? this.weak || (this.weak = new WeakMap<any, Trie<Data>>())
      : this.strong || (this.strong = new Map<any, Trie<Data>>());
    let child = map.get(key);
    if (!child) map.set(key, child = new Trie<Data>(this.weakness, this.makeData));
    return child;
  }
}

function isObjRef(value: any) {
  switch (typeof value) {
  case "object":
    if (value === null) break;
    // Fall through to return true...
  case "function":
    return true;
  }
  return false;
}
