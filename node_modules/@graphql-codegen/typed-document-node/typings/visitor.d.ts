import { Types } from '@graphql-codegen/plugin-helpers';
import { ClientSideBasePluginConfig, ClientSideBaseVisitor, LoadedFragment, RawClientSideBasePluginConfig } from '@graphql-codegen/visitor-plugin-common';
import { GraphQLSchema } from 'graphql';
interface TypeScriptDocumentNodesVisitorPluginConfig extends RawClientSideBasePluginConfig {
    addTypenameToSelectionSets?: boolean;
}
export declare class TypeScriptDocumentNodesVisitor extends ClientSideBaseVisitor<TypeScriptDocumentNodesVisitorPluginConfig, ClientSideBasePluginConfig> {
    private pluginConfig;
    constructor(schema: GraphQLSchema, fragments: LoadedFragment[], config: TypeScriptDocumentNodesVisitorPluginConfig, documents: Types.DocumentFile[]);
    SelectionSet(node: any, _: any, parent: any): any;
    protected getDocumentNodeSignature(resultType: string, variablesTypes: string, node: any): string;
}
export {};
