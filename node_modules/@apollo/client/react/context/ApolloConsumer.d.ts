import type * as ReactTypes from "react";
import type { ApolloClient } from "../../core/index.js";
export interface ApolloConsumerProps {
    children: (client: ApolloClient<object>) => ReactTypes.ReactNode;
}
export declare const ApolloConsumer: ReactTypes.FC<ApolloConsumerProps>;
//# sourceMappingURL=ApolloConsumer.d.ts.map