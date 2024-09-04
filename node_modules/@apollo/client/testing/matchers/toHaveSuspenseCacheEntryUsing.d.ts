import type { MatcherFunction } from "expect";
import type { DocumentNode } from "graphql";
import type { OperationVariables } from "../../core/index.js";
export declare const toHaveSuspenseCacheEntryUsing: MatcherFunction<[
    query: DocumentNode,
    options: {
        variables?: OperationVariables;
        queryKey?: string | number | any[];
    }
]>;
//# sourceMappingURL=toHaveSuspenseCacheEntryUsing.d.ts.map