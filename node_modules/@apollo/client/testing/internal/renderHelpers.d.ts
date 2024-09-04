import type { ReactElement } from "react";
import type { Queries, RenderOptions, queries } from "@testing-library/react";
import type { ApolloClient } from "../../core/index.js";
import type { MockedProviderProps } from "../react/MockedProvider.js";
export interface RenderWithClientOptions<Q extends Queries = typeof queries, Container extends Element | DocumentFragment = HTMLElement, BaseElement extends Element | DocumentFragment = Container> extends RenderOptions<Q, Container, BaseElement> {
    client: ApolloClient<any>;
}
export declare function renderWithClient<Q extends Queries = typeof queries, Container extends Element | DocumentFragment = HTMLElement, BaseElement extends Element | DocumentFragment = Container>(ui: ReactElement, { client, wrapper: Wrapper, ...renderOptions }: RenderWithClientOptions<Q, Container, BaseElement>): import("@testing-library/react").RenderResult<Q, Container, BaseElement>;
export interface RenderWithMocksOptions<Q extends Queries = typeof queries, Container extends Element | DocumentFragment = HTMLElement, BaseElement extends Element | DocumentFragment = Container> extends RenderOptions<Q, Container, BaseElement>, MockedProviderProps<any> {
}
export declare function renderWithMocks<Q extends Queries = typeof queries, Container extends Element | DocumentFragment = HTMLElement, BaseElement extends Element | DocumentFragment = Container>(ui: ReactElement, { wrapper: Wrapper, ...renderOptions }: RenderWithMocksOptions<Q, Container, BaseElement>): import("@testing-library/react").RenderResult<Q, Container, BaseElement>;
//# sourceMappingURL=renderHelpers.d.ts.map