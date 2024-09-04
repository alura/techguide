import type { DocumentNode } from "graphql";
import type { ApolloQueryResult, OperationVariables } from "./types.js";
export declare function equalByQuery(query: DocumentNode, { data: aData, ...aRest }: Partial<ApolloQueryResult<unknown>>, { data: bData, ...bRest }: Partial<ApolloQueryResult<unknown>>, variables?: OperationVariables): boolean;
//# sourceMappingURL=equalByQuery.d.ts.map