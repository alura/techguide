# KeyValueCache interface

```ts
export interface KeyValueCache<V = string> {
  get(key: string): Promise<V | undefined>;
  set(key: string, value: V, options?: KeyValueCacheSetOptions): Promise<void>;
  delete(key: string): Promise<boolean | void>;
}
```

This interface defines a minimally-compatible cache intended for (but not limited to) use by Apollo Server. It is notably implemented by `KeyvAdapter` from the `@apollo/utils.keyvadapter` package. (`KeyvAdapter` in conjunction with a `Keyv` is probably more interesting to you unless you're actually building a cache!)

# InMemoryLRUCache

This class wraps `lru-cache` and implements the `KeyValueCache` interface. It accepts `LRUCache.Options` as the constructor argument and passes them to the `LRUCache` which is created. A default `maxSize` and `sizeCalculator` are provided in order to prevent an unbounded cache; these can both be tweaked via the constructor argument.

```ts
const cache = new InMemoryLRUCache({
  // create a larger-than-default `LRUCache`
  maxSize: Math.pow(2, 20) * 50,
});
```

# PrefixingKeyValueCache

This class wraps a `KeyValueCache` in order to provide a specified prefix for keys entering the cache via this wrapper.

```ts
const cache = new InMemoryLRUCache();
const prefixedCache = new PrefixingKeyValueCache(cache, "apollo:");
```

# ErrorsAreMissesCache

This class wraps a `KeyValueCache` in order to provide error tolerance for caches which connect via a client like Redis. In the event that there's an _error_, this wrapper will treat it as a cache miss (and log the error instead, if a `logger` is provided).

An example usage (which makes use of the `keyv` Redis client and our `KeyvAdapter`) would look something like this:

```ts
import Keyv from "keyv";
import { KeyvAdapter } from "@apollo/utils.keyvadapter";
import { ErrorsAreMissesCache } from "@apollo/utils.keyvaluecache";

const redisCache = new Keyv("redis://user:pass@localhost:6379");
const faultTolerantCache = new ErrorsAreMissesCache(
  new KeyvAdapter(redisCache),
);
```
