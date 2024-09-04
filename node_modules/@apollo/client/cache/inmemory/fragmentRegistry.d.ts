import type { DocumentNode, FragmentDefinitionNode } from "graphql";
export interface FragmentRegistryAPI {
    register(...fragments: DocumentNode[]): this;
    lookup(fragmentName: string): FragmentDefinitionNode | null;
    transform<D extends DocumentNode>(document: D): D;
    resetCaches(): void;
}
export declare function createFragmentRegistry(...fragments: DocumentNode[]): FragmentRegistryAPI;
//# sourceMappingURL=fragmentRegistry.d.ts.map