import type { DocumentNode, OperationDefinitionNode, FragmentDefinitionNode } from "graphql";
export declare function checkDocument(doc: DocumentNode): DocumentNode;
export declare function getOperationDefinition(doc: DocumentNode): OperationDefinitionNode | undefined;
export declare function getOperationName(doc: DocumentNode): string | null;
export declare function getFragmentDefinitions(doc: DocumentNode): FragmentDefinitionNode[];
export declare function getQueryDefinition(doc: DocumentNode): OperationDefinitionNode;
export declare function getFragmentDefinition(doc: DocumentNode): FragmentDefinitionNode;
/**
 * Returns the first operation definition found in this document.
 * If no operation definition is found, the first fragment definition will be returned.
 * If no definitions are found, an error will be thrown.
 */
export declare function getMainDefinition(queryDoc: DocumentNode): OperationDefinitionNode | FragmentDefinitionNode;
export declare function getDefaultValues(definition: OperationDefinitionNode | undefined): Record<string, any>;
//# sourceMappingURL=getFromAST.d.ts.map