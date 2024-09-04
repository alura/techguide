import { BaseSelectionSetProcessor, ProcessResult, LinkField, PrimitiveAliasedFields, SelectionSetProcessorConfig, PrimitiveField } from '@graphql-codegen/visitor-plugin-common';
import { GraphQLObjectType, GraphQLInterfaceType } from 'graphql';
export declare class TypeScriptSelectionSetProcessor extends BaseSelectionSetProcessor<SelectionSetProcessorConfig> {
    transformPrimitiveFields(schemaType: GraphQLObjectType | GraphQLInterfaceType, fields: PrimitiveField[]): ProcessResult;
    transformTypenameField(type: string, name: string): ProcessResult;
    transformAliasesPrimitiveFields(schemaType: GraphQLObjectType | GraphQLInterfaceType, fields: PrimitiveAliasedFields[]): ProcessResult;
    transformLinkFields(fields: LinkField[]): ProcessResult;
}
