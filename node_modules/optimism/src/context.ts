import { Slot } from "@wry/context";
import { AnyEntry } from "./entry.js";

export const parentEntrySlot = new Slot<AnyEntry | undefined>();

export function nonReactive<R>(fn: () => R): R {
  return parentEntrySlot.withValue(void 0, fn);
}

export { Slot }
export {
  bind as bindContext,
  noContext,
  setTimeout,
  asyncFromGen,
} from "@wry/context";
