import { BaseSelectionSetProcessor, ProcessResult, LinkField, PrimitiveAliasedFields, SelectionSetProcessorConfig, PrimitiveField } from './base';
import { GraphQLObjectType, GraphQLInterfaceType } from 'graphql';
export declare class PreResolveTypesProcessor extends BaseSelectionSetProcessor<SelectionSetProcessorConfig> {
    transformTypenameField(type: string, name: string): ProcessResult;
    transformPrimitiveFields(schemaType: GraphQLObjectType | GraphQLInterfaceType, fields: PrimitiveField[]): ProcessResult;
    transformAliasesPrimitiveFields(schemaType: GraphQLObjectType | GraphQLInterfaceType, fields: PrimitiveAliasedFields[]): ProcessResult;
    transformLinkFields(fields: LinkField[]): ProcessResult;
}
