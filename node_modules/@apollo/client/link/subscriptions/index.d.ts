import type { Client } from "graphql-ws";
import type { Operation, FetchResult } from "../core/index.js";
import { ApolloLink } from "../core/index.js";
import { Observable } from "../../utilities/index.js";
export declare class GraphQLWsLink extends ApolloLink {
    readonly client: Client;
    constructor(client: Client);
    request(operation: Operation): Observable<FetchResult>;
}
//# sourceMappingURL=index.d.ts.map