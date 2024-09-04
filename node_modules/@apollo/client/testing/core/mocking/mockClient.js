import { ApolloClient } from "../../../core/index.js";
import { InMemoryCache } from "../../../cache/index.js";
import { mockSingleLink } from "./mockLink.js";
export function createMockClient(data, query, variables) {
    if (variables === void 0) { variables = {}; }
    return new ApolloClient({
        link: mockSingleLink({
            request: { query: query, variables: variables },
            result: { data: data },
        }).setOnError(function (error) {
            throw error;
        }),
        cache: new InMemoryCache({ addTypename: false }),
    });
}
//# sourceMappingURL=mockClient.js.map