import type { GraphQLExtensionDeclaration } from '../extension.cjs';
import type { WithList } from '../types.cjs';
export interface Endpoint {
    url: string;
    headers?: Record<string, WithList<string>>;
    introspect?: boolean;
    subscription?: {
        url: string;
        connectionParams?: Record<string, string | undefined>;
    };
}
export type Endpoints = Record<string, Endpoint>;
export declare const EndpointsExtension: GraphQLExtensionDeclaration;
//# sourceMappingURL=endpoints.d.ts.map