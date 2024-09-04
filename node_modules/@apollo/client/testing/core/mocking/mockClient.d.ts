import type { DocumentNode } from "graphql";
import { ApolloClient } from "../../../core/index.js";
import type { NormalizedCacheObject } from "../../../cache/index.js";
export declare function createMockClient<TData>(data: TData, query: DocumentNode, variables?: {}): ApolloClient<NormalizedCacheObject>;
//# sourceMappingURL=mockClient.d.ts.map