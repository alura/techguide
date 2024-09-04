import type { CommonCache } from "./common";

interface Node<K, V> {
  key: K;
  value: V;
  newer: Node<K, V> | null;
  older: Node<K, V> | null;
}

function defaultDispose() {}

export class StrongCache<K = any, V = any> implements CommonCache<K, V> {
  private map = new Map<K, Node<K, V>>();
  private newest: Node<K, V> | null = null;
  private oldest: Node<K, V> | null = null;

  constructor(
    private max = Infinity,
    public dispose: (value: V, key: K) => void = defaultDispose,
  ) {}

  public has(key: K): boolean {
    return this.map.has(key);
  }

  public get(key: K): V | undefined {
    const node = this.getNode(key);
    return node && node.value;
  }

  public get size() {
    return this.map.size;
  }

  private getNode(key: K): Node<K, V> | undefined {
    const node = this.map.get(key);

    if (node && node !== this.newest) {
      const { older, newer } = node;

      if (newer) {
        newer.older = older;
      }

      if (older) {
        older.newer = newer;
      }

      node.older = this.newest;
      node.older!.newer = node;

      node.newer = null;
      this.newest = node;

      if (node === this.oldest) {
        this.oldest = newer;
      }
    }

    return node;
  }

  public set(key: K, value: V): V {
    let node = this.getNode(key);
    if (node) {
      return node.value = value;
    }

    node = {
      key,
      value,
      newer: null,
      older: this.newest
    };

    if (this.newest) {
      this.newest.newer = node;
    }

    this.newest = node;
    this.oldest = this.oldest || node;

    this.map.set(key, node);

    return node.value;
  }

  public clean() {
    while (this.oldest && this.map.size > this.max) {
      this.delete(this.oldest.key);
    }
  }

  public delete(key: K): boolean {
    const node = this.map.get(key);
    if (node) {
      if (node === this.newest) {
        this.newest = node.older;
      }

      if (node === this.oldest) {
        this.oldest = node.newer;
      }

      if (node.newer) {
        node.newer.older = node.older;
      }

      if (node.older) {
        node.older.newer = node.newer;
      }

      this.map.delete(key);
      this.dispose(node.value, key);

      return true;
    }

    return false;
  }
}
