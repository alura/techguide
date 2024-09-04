import { ApolloLink } from "../../../core/index.js";
import type { TypedDocumentNode } from "../../../core/index.js";
import type { MockedResponse } from "../../core/index.js";
export interface SimpleCaseData {
    greeting: string;
}
export declare function setupSimpleCase(): {
    query: TypedDocumentNode<SimpleCaseData, Record<string, never>>;
    mocks: MockedResponse<SimpleCaseData, Record<string, any>>[];
};
export interface VariablesCaseData {
    character: {
        __typename: "Character";
        id: string;
        name: string;
    };
}
export interface VariablesCaseVariables {
    id: string;
}
export declare function setupVariablesCase(): {
    mocks: MockedResponse<VariablesCaseData, Record<string, any>>[];
    query: TypedDocumentNode<VariablesCaseData, VariablesCaseVariables>;
};
interface Letter {
    letter: string;
    position: number;
}
export interface PaginatedCaseData {
    letters: Letter[];
}
export interface PaginatedCaseVariables {
    limit?: number;
    offset?: number;
}
export declare function setupPaginatedCase(): {
    query: TypedDocumentNode<PaginatedCaseData, PaginatedCaseVariables>;
    link: ApolloLink;
};
export {};
//# sourceMappingURL=index.d.ts.map