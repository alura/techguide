import { PluginFunction, Types } from '@graphql-codegen/plugin-helpers';
import { TypeScriptDocumentsVisitor } from './visitor';
import { TypeScriptDocumentsPluginConfig } from './config';
export { TypeScriptDocumentsPluginConfig } from './config';
export declare const plugin: PluginFunction<TypeScriptDocumentsPluginConfig, Types.ComplexPluginOutput>;
export { TypeScriptDocumentsVisitor };
