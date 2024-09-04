import { Types, PluginFunction } from '@graphql-codegen/plugin-helpers';
import { GraphQLSchema } from 'graphql';
import { TypeScriptPluginConfig } from './config';
export * from './typescript-variables-to-object';
export * from './visitor';
export * from './config';
export * from './introspection-visitor';
export declare const plugin: PluginFunction<TypeScriptPluginConfig, Types.ComplexPluginOutput>;
export declare function includeIntrospectionTypesDefinitions(schema: GraphQLSchema, documents: Types.DocumentFile[], config: TypeScriptPluginConfig): string[];
