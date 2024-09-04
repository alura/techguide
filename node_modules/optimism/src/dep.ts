import { AnyEntry } from "./entry.js";
import { OptimisticWrapOptions } from "./index.js";
import { parentEntrySlot } from "./context.js";
import {
  hasOwnProperty,
  Unsubscribable,
  maybeUnsubscribe,
  arrayFromSet,
 } from "./helpers.js";

type EntryMethodName = keyof typeof EntryMethods;
const EntryMethods = {
  setDirty: true, // Mark parent Entry as needing to be recomputed (default)
  dispose: true,  // Detach parent Entry from parents and children, but leave in LRU cache
  forget: true,   // Fully remove parent Entry from LRU cache and computation graph
};

export type OptimisticDependencyFunction<TKey> =
  ((key: TKey) => void) & {
    dirty: (key: TKey, entryMethodName?: EntryMethodName) => void;
  };

export type Dep<TKey> = Set<AnyEntry> & {
  subscribe: OptimisticWrapOptions<[TKey]>["subscribe"];
} & Unsubscribable;

export function dep<TKey>(options?: {
  subscribe: Dep<TKey>["subscribe"];
}) {
  const depsByKey = new Map<TKey, Dep<TKey>>();
  const subscribe = options && options.subscribe;

  function depend(key: TKey) {
    const parent = parentEntrySlot.getValue();
    if (parent) {
      let dep = depsByKey.get(key);
      if (!dep) {
        depsByKey.set(key, dep = new Set as Dep<TKey>);
      }
      parent.dependOn(dep);
      if (typeof subscribe === "function") {
        maybeUnsubscribe(dep);
        dep.unsubscribe = subscribe(key);
      }
    }
  }

  depend.dirty = function dirty(
    key: TKey,
    entryMethodName?: EntryMethodName,
  ) {
    const dep = depsByKey.get(key);
    if (dep) {
      const m: EntryMethodName = (
        entryMethodName &&
        hasOwnProperty.call(EntryMethods, entryMethodName)
      ) ? entryMethodName : "setDirty";
      // We have to use arrayFromSet(dep).forEach instead of dep.forEach,
      // because modifying a Set while iterating over it can cause elements in
      // the Set to be removed from the Set before they've been iterated over.
      arrayFromSet(dep).forEach(entry => entry[m]());
      depsByKey.delete(key);
      maybeUnsubscribe(dep);
    }
  };

  return depend as OptimisticDependencyFunction<TKey>;
}
