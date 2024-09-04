import type * as ReactTypes from "react";
import type { ApolloClient } from "../../core/index.js";
export interface ApolloProviderProps<TCache> {
    client: ApolloClient<TCache>;
    children: ReactTypes.ReactNode | ReactTypes.ReactNode[] | null;
}
export declare const ApolloProvider: ReactTypes.FC<ApolloProviderProps<any>>;
//# sourceMappingURL=ApolloProvider.d.ts.map