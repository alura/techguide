import { expect } from "@jest/globals";
import { toMatchDocument } from "./toMatchDocument.js";
import { toHaveSuspenseCacheEntryUsing } from "./toHaveSuspenseCacheEntryUsing.js";
import { toRerender, toRenderExactlyTimes } from "./ProfiledComponent.js";
import { toBeGarbageCollected } from "./toBeGarbageCollected.js";
import { toBeDisposed } from "./toBeDisposed.js";
expect.extend({
    toBeDisposed: toBeDisposed,
    toHaveSuspenseCacheEntryUsing: toHaveSuspenseCacheEntryUsing,
    toMatchDocument: toMatchDocument,
    toRerender: toRerender,
    toRenderExactlyTimes: toRenderExactlyTimes,
    toBeGarbageCollected: toBeGarbageCollected,
});
//# sourceMappingURL=index.js.map