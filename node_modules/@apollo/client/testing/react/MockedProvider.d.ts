import * as React from "react";
import type { DefaultOptions } from "../../core/index.js";
import { ApolloClient } from "../../core/index.js";
import type { MockedResponse } from "../core/index.js";
import type { ApolloLink } from "../../link/core/index.js";
import type { Resolvers } from "../../core/index.js";
import type { ApolloCache } from "../../cache/index.js";
export interface MockedProviderProps<TSerializedCache = {}> {
    mocks?: ReadonlyArray<MockedResponse<any, any>>;
    addTypename?: boolean;
    defaultOptions?: DefaultOptions;
    cache?: ApolloCache<TSerializedCache>;
    resolvers?: Resolvers;
    childProps?: object;
    children?: any;
    link?: ApolloLink;
    showWarnings?: boolean;
    /**
     * If set to true, the MockedProvider will try to connect to the Apollo DevTools.
     * Defaults to false.
     */
    connectToDevTools?: boolean;
}
export interface MockedProviderState {
    client: ApolloClient<any>;
}
export declare class MockedProvider extends React.Component<MockedProviderProps, MockedProviderState> {
    static defaultProps: MockedProviderProps;
    constructor(props: MockedProviderProps);
    render(): React.JSX.Element | null;
    componentWillUnmount(): void;
}
//# sourceMappingURL=MockedProvider.d.ts.map