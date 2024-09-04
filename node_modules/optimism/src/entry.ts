import { parentEntrySlot } from "./context.js";
import { OptimisticWrapOptions } from "./index.js";
import { Dep } from "./dep.js";
import { maybeUnsubscribe, arrayFromSet, Unsubscribable } from "./helpers.js";

const emptySetPool: Set<any>[] = [];
const POOL_TARGET_SIZE = 100;

// Since this package might be used browsers, we should avoid using the
// Node built-in assert module.
function assert(condition: any, optionalMessage?: string) {
  if (! condition) {
    throw new Error(optionalMessage || "assertion failure");
  }
}

// Since exceptions are cached just like normal values, we need an efficient
// way of representing unknown, ordinary, and exceptional values.
type Value<T> =
  | []           // unknown
  | [T]          // known value
  | [void, any]; // known exception

function valueIs(a: Value<any>, b: Value<any>) {
  const len = a.length;
  return (
    // Unknown values are not equal to each other.
    len > 0 &&
    // Both values must be ordinary (or both exceptional) to be equal.
    len === b.length &&
    // The underlying value or exception must be the same.
    a[len - 1] === b[len - 1]
  );
}

function valueGet<T>(value: Value<T>): T {
  switch (value.length) {
    case 0: throw new Error("unknown value");
    case 1: return value[0];
    case 2: throw value[1];
  }
}

function valueCopy<T>(value: Value<T>): Value<T> {
  return value.slice(0) as Value<T>;
}

export type AnyEntry = Entry<any, any>;

export class Entry<TArgs extends any[], TValue> {
  public static count = 0;

  public normalizeResult: OptimisticWrapOptions<TArgs, any, any, TValue>["normalizeResult"];
  public subscribe: OptimisticWrapOptions<TArgs>["subscribe"];
  public unsubscribe: Unsubscribable["unsubscribe"];

  public readonly parents = new Set<AnyEntry>();
  public readonly childValues = new Map<AnyEntry, Value<any>>();

  // When this Entry has children that are dirty, this property becomes
  // a Set containing other Entry objects, borrowed from emptySetPool.
  // When the set becomes empty, it gets recycled back to emptySetPool.
  public dirtyChildren: Set<AnyEntry> | null = null;

  public dirty = true;
  public recomputing = false;
  public readonly value: Value<TValue> = [];

  constructor(
    public readonly fn: (...args: TArgs) => TValue,
  ) {
    ++Entry.count;
  }

  public peek(): TValue | undefined {
    if (this.value.length === 1 && !mightBeDirty(this)) {
      rememberParent(this);
      return this.value[0];
    }
  }

  // This is the most important method of the Entry API, because it
  // determines whether the cached this.value can be returned immediately,
  // or must be recomputed. The overall performance of the caching system
  // depends on the truth of the following observations: (1) this.dirty is
  // usually false, (2) this.dirtyChildren is usually null/empty, and thus
  // (3) valueGet(this.value) is usually returned without recomputation.
  public recompute(args: TArgs): TValue {
    assert(! this.recomputing, "already recomputing");
    rememberParent(this);
    return mightBeDirty(this)
      ? reallyRecompute(this, args)
      : valueGet(this.value);
  }

  public setDirty() {
    if (this.dirty) return;
    this.dirty = true;
    reportDirty(this);
    // We can go ahead and unsubscribe here, since any further dirty
    // notifications we receive will be redundant, and unsubscribing may
    // free up some resources, e.g. file watchers.
    maybeUnsubscribe(this);
  }

  public dispose() {
    this.setDirty();

    // Sever any dependency relationships with our own children, so those
    // children don't retain this parent Entry in their child.parents sets,
    // thereby preventing it from being fully garbage collected.
    forgetChildren(this);

    // Because this entry has been kicked out of the cache (in index.js),
    // we've lost the ability to find out if/when this entry becomes dirty,
    // whether that happens through a subscription, because of a direct call
    // to entry.setDirty(), or because one of its children becomes dirty.
    // Because of this loss of future information, we have to assume the
    // worst (that this entry might have become dirty very soon), so we must
    // immediately mark this entry's parents as dirty. Normally we could
    // just call entry.setDirty() rather than calling parent.setDirty() for
    // each parent, but that would leave this entry in parent.childValues
    // and parent.dirtyChildren, which would prevent the child from being
    // truly forgotten.
    eachParent(this, (parent, child) => {
      parent.setDirty();
      forgetChild(parent, this);
    });
  }

  public forget() {
    // The code that creates Entry objects in index.ts will replace this method
    // with one that actually removes the Entry from the cache, which will also
    // trigger the entry.dispose method.
    this.dispose();
  }

  private deps: Set<Dep<any>> | null = null;

  public dependOn(dep: Dep<any>) {
    dep.add(this);
    if (! this.deps) {
      this.deps = emptySetPool.pop() || new Set<Set<AnyEntry>>();
    }
    this.deps.add(dep);
  }

  public forgetDeps() {
    if (this.deps) {
      arrayFromSet(this.deps).forEach(dep => dep.delete(this));
      this.deps.clear();
      emptySetPool.push(this.deps);
      this.deps = null;
    }
  }
}

function rememberParent(child: AnyEntry) {
  const parent = parentEntrySlot.getValue();
  if (parent) {
    child.parents.add(parent);

    if (! parent.childValues.has(child)) {
      parent.childValues.set(child, []);
    }

    if (mightBeDirty(child)) {
      reportDirtyChild(parent, child);
    } else {
      reportCleanChild(parent, child);
    }

    return parent;
  }
}

function reallyRecompute(entry: AnyEntry, args: any[]) {
  forgetChildren(entry);

  // Set entry as the parent entry while calling recomputeNewValue(entry).
  parentEntrySlot.withValue(entry, recomputeNewValue, [entry, args]);

  if (maybeSubscribe(entry, args)) {
    // If we successfully recomputed entry.value and did not fail to
    // (re)subscribe, then this Entry is no longer explicitly dirty.
    setClean(entry);
  }

  return valueGet(entry.value);
}

function recomputeNewValue(entry: AnyEntry, args: any[]) {
  entry.recomputing = true;

  const { normalizeResult } = entry;
  let oldValueCopy: Value<any> | undefined;
  if (normalizeResult && entry.value.length === 1) {
    oldValueCopy = valueCopy(entry.value);
  }

  // Make entry.value an empty array, representing an unknown value.
  entry.value.length = 0;

  try {
    // If entry.fn succeeds, entry.value will become a normal Value.
    entry.value[0] = entry.fn.apply(null, args);

    // If we have a viable oldValueCopy to compare with the (successfully
    // recomputed) new entry.value, and they are not already === identical, give
    // normalizeResult a chance to pick/choose/reuse parts of oldValueCopy[0]
    // and/or entry.value[0] to determine the final cached entry.value.
    if (normalizeResult && oldValueCopy && !valueIs(oldValueCopy, entry.value)) {
      try {
        entry.value[0] = normalizeResult(entry.value[0], oldValueCopy[0]);
      } catch {
        // If normalizeResult throws, just use the newer value, rather than
        // saving the exception as entry.value[1].
      }
    }

  } catch (e) {
    // If entry.fn throws, entry.value will hold that exception.
    entry.value[1] = e;
  }

  // Either way, this line is always reached.
  entry.recomputing = false;
}

function mightBeDirty(entry: AnyEntry) {
  return entry.dirty || !!(entry.dirtyChildren && entry.dirtyChildren.size);
}

function setClean(entry: AnyEntry) {
  entry.dirty = false;

  if (mightBeDirty(entry)) {
    // This Entry may still have dirty children, in which case we can't
    // let our parents know we're clean just yet.
    return;
  }

  reportClean(entry);
}

function reportDirty(child: AnyEntry) {
  eachParent(child, reportDirtyChild);
}

function reportClean(child: AnyEntry) {
  eachParent(child, reportCleanChild);
}

function eachParent(
  child: AnyEntry,
  callback: (parent: AnyEntry, child: AnyEntry) => any,
) {
  const parentCount = child.parents.size;
  if (parentCount) {
    const parents = arrayFromSet(child.parents);
    for (let i = 0; i < parentCount; ++i) {
      callback(parents[i], child);
    }
  }
}

// Let a parent Entry know that one of its children may be dirty.
function reportDirtyChild(parent: AnyEntry, child: AnyEntry) {
  // Must have called rememberParent(child) before calling
  // reportDirtyChild(parent, child).
  assert(parent.childValues.has(child));
  assert(mightBeDirty(child));
  const parentWasClean = !mightBeDirty(parent);

  if (! parent.dirtyChildren) {
    parent.dirtyChildren = emptySetPool.pop() || new Set;

  } else if (parent.dirtyChildren.has(child)) {
    // If we already know this child is dirty, then we must have already
    // informed our own parents that we are dirty, so we can terminate
    // the recursion early.
    return;
  }

  parent.dirtyChildren.add(child);

  // If parent was clean before, it just became (possibly) dirty (according to
  // mightBeDirty), since we just added child to parent.dirtyChildren.
  if (parentWasClean) {
    reportDirty(parent);
  }
}

// Let a parent Entry know that one of its children is no longer dirty.
function reportCleanChild(parent: AnyEntry, child: AnyEntry) {
  // Must have called rememberChild(child) before calling
  // reportCleanChild(parent, child).
  assert(parent.childValues.has(child));
  assert(! mightBeDirty(child));

  const childValue = parent.childValues.get(child)!;
  if (childValue.length === 0) {
    parent.childValues.set(child, valueCopy(child.value));
  } else if (! valueIs(childValue, child.value)) {
    parent.setDirty();
  }

  removeDirtyChild(parent, child);

  if (mightBeDirty(parent)) {
    return;
  }

  reportClean(parent);
}

function removeDirtyChild(parent: AnyEntry, child: AnyEntry) {
  const dc = parent.dirtyChildren;
  if (dc) {
    dc.delete(child);
    if (dc.size === 0) {
      if (emptySetPool.length < POOL_TARGET_SIZE) {
        emptySetPool.push(dc);
      }
      parent.dirtyChildren = null;
    }
  }
}

// Removes all children from this entry and returns an array of the
// removed children.
function forgetChildren(parent: AnyEntry) {
  if (parent.childValues.size > 0) {
    parent.childValues.forEach((_value, child) => {
      forgetChild(parent, child);
    });
  }

  // Remove this parent Entry from any sets to which it was added by the
  // addToSet method.
  parent.forgetDeps();

  // After we forget all our children, this.dirtyChildren must be empty
  // and therefore must have been reset to null.
  assert(parent.dirtyChildren === null);
}

function forgetChild(parent: AnyEntry, child: AnyEntry) {
  child.parents.delete(parent);
  parent.childValues.delete(child);
  removeDirtyChild(parent, child);
}

function maybeSubscribe(entry: AnyEntry, args: any[]) {
  if (typeof entry.subscribe === "function") {
    try {
      maybeUnsubscribe(entry); // Prevent double subscriptions.
      entry.unsubscribe = entry.subscribe.apply(null, args);
    } catch (e) {
      // If this Entry has a subscribe function and it threw an exception
      // (or an unsubscribe function it previously returned now throws),
      // return false to indicate that we were not able to subscribe (or
      // unsubscribe), and this Entry should remain dirty.
      entry.setDirty();
      return false;
    }
  }

  // Returning true indicates either that there was no entry.subscribe
  // function or that it succeeded.
  return true;
}
