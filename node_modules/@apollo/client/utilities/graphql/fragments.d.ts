import type { DocumentNode, FragmentDefinitionNode, InlineFragmentNode, SelectionNode } from "graphql";
/**
 * Returns a query document which adds a single query operation that only
 * spreads the target fragment inside of it.
 *
 * So for example a document of:
 *
 * ```graphql
 * fragment foo on Foo { a b c }
 * ```
 *
 * Turns into:
 *
 * ```graphql
 * { ...foo }
 *
 * fragment foo on Foo { a b c }
 * ```
 *
 * The target fragment will either be the only fragment in the document, or a
 * fragment specified by the provided `fragmentName`. If there is more than one
 * fragment, but a `fragmentName` was not defined then an error will be thrown.
 */
export declare function getFragmentQueryDocument(document: DocumentNode, fragmentName?: string): DocumentNode;
/**
 * This is an interface that describes a map from fragment names to fragment definitions.
 */
export interface FragmentMap {
    [fragmentName: string]: FragmentDefinitionNode;
}
export type FragmentMapFunction = (fragmentName: string) => FragmentDefinitionNode | null;
export declare function createFragmentMap(fragments?: FragmentDefinitionNode[]): FragmentMap;
export declare function getFragmentFromSelection(selection: SelectionNode, fragmentMap?: FragmentMap | FragmentMapFunction): InlineFragmentNode | FragmentDefinitionNode | null;
//# sourceMappingURL=fragments.d.ts.map