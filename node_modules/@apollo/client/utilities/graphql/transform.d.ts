import type { DocumentNode, FieldNode, DirectiveNode, FragmentDefinitionNode, ArgumentNode, FragmentSpreadNode, VariableDefinitionNode, ASTNode } from "graphql";
export type RemoveNodeConfig<N> = {
    name?: string;
    test?: (node: N) => boolean;
    remove?: boolean;
};
export type GetNodeConfig<N> = {
    name?: string;
    test?: (node: N) => boolean;
};
export type RemoveDirectiveConfig = RemoveNodeConfig<DirectiveNode>;
export type GetDirectiveConfig = GetNodeConfig<DirectiveNode>;
export type RemoveArgumentsConfig = RemoveNodeConfig<ArgumentNode>;
export type GetFragmentSpreadConfig = GetNodeConfig<FragmentSpreadNode>;
export type RemoveFragmentSpreadConfig = RemoveNodeConfig<FragmentSpreadNode>;
export type RemoveFragmentDefinitionConfig = RemoveNodeConfig<FragmentDefinitionNode>;
export type RemoveVariableDefinitionConfig = RemoveNodeConfig<VariableDefinitionNode>;
export declare function removeDirectivesFromDocument(directives: RemoveDirectiveConfig[], doc: DocumentNode): DocumentNode | null;
export declare const addTypenameToDocument: (<TNode extends ASTNode>(doc: TNode) => TNode) & {
    added(field: FieldNode): boolean;
};
export declare function removeConnectionDirectiveFromDocument(doc: DocumentNode): DocumentNode | null;
export declare function removeArgumentsFromDocument(config: RemoveArgumentsConfig[], doc: DocumentNode): DocumentNode | null;
export declare function removeFragmentSpreadFromDocument(config: RemoveFragmentSpreadConfig[], doc: DocumentNode): DocumentNode | null;
export declare function buildQueryFromSelectionSet(document: DocumentNode): DocumentNode;
export declare function removeClientSetsFromDocument(document: DocumentNode): DocumentNode | null;
//# sourceMappingURL=transform.d.ts.map