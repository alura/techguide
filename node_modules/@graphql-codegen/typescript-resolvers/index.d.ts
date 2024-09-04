import { Types, PluginFunction } from '@graphql-codegen/plugin-helpers';
import { TypeScriptResolversVisitor } from './visitor';
import { TypeScriptResolversPluginConfig } from './config';
export declare const plugin: PluginFunction<TypeScriptResolversPluginConfig, Types.ComplexPluginOutput>;
export { TypeScriptResolversVisitor, TypeScriptResolversPluginConfig };
