# @wry/caches

Various cache implementations, including but not limited to

* `StrongCache`: A standard `Map`-like cache with a least-recently-used (LRU)
   eviction policy and a callback hook for removed entries.

* `WeakCache`: Another LRU cache that holds its keys only weakly, so entries can be removed
   once no longer retained elsewhere in the application.
