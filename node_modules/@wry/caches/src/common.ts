export interface CommonCache<K, V> {
  has(key: K): boolean;
  get(key: K): V | undefined;
  set(key: K, value: V): V;
  delete(key: K): boolean;
  clean(): void;
  readonly size: number;
}
