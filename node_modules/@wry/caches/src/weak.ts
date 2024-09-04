import type { CommonCache } from "./common";

interface PartialNode<K extends object, V> {
  value: V;
  newer: Node<K, V> | null;
  older: Node<K, V> | null;
}

interface UnfinalizedNode<K extends object, V> extends PartialNode<K, V> {
  keyRef?: undefined;
  key: K;
}

interface FullNode<K extends object, V> extends PartialNode<K, V> {
  keyRef: WeakRef<K>;
  key?: undefined;
}

type Node<K extends object, V> = FullNode<K, V> | UnfinalizedNode<K, V>;

function noop() {}
const defaultDispose = noop;

const _WeakRef =
  typeof WeakRef !== "undefined"
    ? WeakRef
    : (function <T>(value: T) {
        return { deref: () => value } satisfies Omit<
          WeakRef<any>,
          typeof Symbol.toStringTag
        >;
      } as any as typeof WeakRef);
const _WeakMap = typeof WeakMap !== "undefined" ? WeakMap : Map;
const _FinalizationRegistry =
  typeof FinalizationRegistry !== "undefined"
    ? FinalizationRegistry
    : (function <T>() {
        return {
          register: noop,
          unregister: noop,
        } satisfies Omit<FinalizationRegistry<T>, typeof Symbol.toStringTag>;
      } as any as typeof FinalizationRegistry);

const finalizationBatchSize = 10024;

export class WeakCache<K extends object = any, V = any>
  implements CommonCache<K, V>
{
  private map = new _WeakMap<K, Node<K, V>>();
  private registry: FinalizationRegistry<Node<K, V>>;
  private newest: Node<K, V> | null = null;
  private oldest: Node<K, V> | null = null;
  private unfinalizedNodes: Set<UnfinalizedNode<K, V>> = new Set();
  private finalizationScheduled = false;
  public size = 0;

  constructor(
    private max = Infinity,
    public dispose: (value: V, key?: K) => void = defaultDispose
  ) {
    this.registry = new _FinalizationRegistry<Node<K, V>>(
      this.deleteNode.bind(this)
    );
  }

  public has(key: K): boolean {
    return this.map.has(key);
  }

  public get(key: K): V | undefined {
    const node = this.getNode(key);
    return node && node.value;
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
      return (node.value = value);
    }

    node = {
      key,
      value,
      newer: null,
      older: this.newest,
    };

    if (this.newest) {
      this.newest.newer = node;
    }

    this.newest = node;
    this.oldest = this.oldest || node;

    this.scheduleFinalization(node);
    this.map.set(key, node);
    this.size++;

    return node.value;
  }

  public clean() {
    while (this.oldest && this.size > this.max) {
      this.deleteNode(this.oldest);
    }
  }

  private deleteNode(node: Node<K, V>) {
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

    this.size--;
    const key = node.key || (node.keyRef && node.keyRef.deref());
    this.dispose(node.value, key);
    if (!node.keyRef) {
      this.unfinalizedNodes.delete(node);
    } else {
      this.registry.unregister(node);
    }
    if (key) this.map.delete(key);
  }

  public delete(key: K): boolean {
    const node = this.map.get(key);
    if (node) {
      this.deleteNode(node);

      return true;
    }

    return false;
  }

  private scheduleFinalization(node: UnfinalizedNode<K, V>) {
    this.unfinalizedNodes.add(node);
    if (!this.finalizationScheduled) {
      this.finalizationScheduled = true;
      queueMicrotask(this.finalize);
    }
  }

  private finalize = () => {
    const iterator = this.unfinalizedNodes.values();
    for (let i = 0; i < finalizationBatchSize; i++) {
      const node = iterator.next().value;
      if (!node) break;
      this.unfinalizedNodes.delete(node);
      const key = node.key;
      delete (node as unknown as FullNode<K, V>).key;
      (node as unknown as FullNode<K, V>).keyRef = new _WeakRef(key);
      this.registry.register(key, node, node);
    }
    if (this.unfinalizedNodes.size > 0) {
      queueMicrotask(this.finalize);
    } else {
      this.finalizationScheduled = false;
    }
  };
}
