import { Slot } from "@wry/context";
export const parentEntrySlot = new Slot();
export function nonReactive(fn) {
    return parentEntrySlot.withValue(void 0, fn);
}
export { Slot };
export { bind as bindContext, noContext, setTimeout, asyncFromGen, } from "@wry/context";
//# sourceMappingURL=context.js.map