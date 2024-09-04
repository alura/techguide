import type { GraphQLRequest } from "../core/index.js";
import { ApolloLink } from "../core/index.js";
import type { DefaultContext } from "../../core/index.js";
export type ContextSetter = (operation: GraphQLRequest, prevContext: DefaultContext) => Promise<DefaultContext> | DefaultContext;
export declare function setContext(setter: ContextSetter): ApolloLink;
//# sourceMappingURL=index.d.ts.map