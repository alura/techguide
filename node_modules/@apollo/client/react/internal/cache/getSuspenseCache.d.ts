import type { SuspenseCacheOptions } from "../index.js";
import { SuspenseCache } from "./SuspenseCache.js";
import type { ApolloClient } from "../../../core/ApolloClient.js";
declare module "../../../core/ApolloClient.js" {
    interface DefaultOptions {
        react?: {
            suspense?: Readonly<SuspenseCacheOptions>;
        };
    }
}
declare const suspenseCacheSymbol: unique symbol;
export declare function getSuspenseCache(client: ApolloClient<object> & {
    [suspenseCacheSymbol]?: SuspenseCache;
}): SuspenseCache;
export {};
//# sourceMappingURL=getSuspenseCache.d.ts.map