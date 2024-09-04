import { GraphQLSchema, GraphQLNamedType, EnumTypeDefinitionNode, ObjectTypeDefinitionNode } from 'graphql';
import { TsVisitor } from './visitor';
import { TypeScriptPluginConfig } from './config';
export declare class TsIntrospectionVisitor extends TsVisitor {
    private typesToInclude;
    constructor(schema: GraphQLSchema, pluginConfig: TypeScriptPluginConfig, typesToInclude: GraphQLNamedType[]);
    DirectiveDefinition(): any;
    ObjectTypeDefinition(node: ObjectTypeDefinitionNode, key: string | number, parent: any): string;
    EnumTypeDefinition(node: EnumTypeDefinitionNode): string;
}
