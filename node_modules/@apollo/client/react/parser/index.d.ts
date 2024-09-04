import type { DocumentNode, VariableDefinitionNode } from "graphql";
export declare enum DocumentType {
    Query = 0,
    Mutation = 1,
    Subscription = 2
}
export interface IDocumentDefinition {
    type: DocumentType;
    name: string;
    variables: ReadonlyArray<VariableDefinitionNode>;
}
export declare function operationName(type: DocumentType): string;
export declare function parser(document: DocumentNode): IDocumentDefinition;
export declare namespace parser {
    var resetCache: () => void;
}
export declare function verifyDocumentType(document: DocumentNode, type: DocumentType): void;
//# sourceMappingURL=index.d.ts.map