import type { Operation, GraphQLRequest, FetchResult } from "../../../link/core/index.js";
import { ApolloLink } from "../../../link/core/index.js";
import { Observable } from "../../../utilities/index.js";
/** @internal */
type CovariantUnaryFunction<out Arg, out Ret> = {
    fn(arg: Arg): Ret;
}["fn"];
export type ResultFunction<T, V = Record<string, any>> = CovariantUnaryFunction<V, T>;
export type VariableMatcher<V = Record<string, any>> = CovariantUnaryFunction<V, boolean>;
export interface MockedResponse<out TData = Record<string, any>, out TVariables = Record<string, any>> {
    request: GraphQLRequest<TVariables>;
    maxUsageCount?: number;
    result?: FetchResult<TData> | ResultFunction<FetchResult<TData>, TVariables>;
    error?: Error;
    delay?: number;
    variableMatcher?: VariableMatcher<TVariables>;
    newData?: ResultFunction<FetchResult<TData>, TVariables>;
}
export interface MockLinkOptions {
    showWarnings?: boolean;
}
export declare class MockLink extends ApolloLink {
    operation: Operation;
    addTypename: Boolean;
    showWarnings: boolean;
    private mockedResponsesByKey;
    constructor(mockedResponses: ReadonlyArray<MockedResponse<any, any>>, addTypename?: Boolean, options?: MockLinkOptions);
    addMockedResponse(mockedResponse: MockedResponse): void;
    request(operation: Operation): Observable<FetchResult> | null;
    private normalizeMockedResponse;
    private normalizeVariableMatching;
}
export interface MockApolloLink extends ApolloLink {
    operation?: Operation;
}
export declare function mockSingleLink(...mockedResponses: Array<any>): MockApolloLink;
export {};
//# sourceMappingURL=mockLink.d.ts.map